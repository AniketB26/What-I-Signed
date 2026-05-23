import api from './api';
import useAuthStore from '../store/authStore';

// Use empty base so requests go through Vite proxy
const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Try to refresh the access token. Returns the new token or null.
 */
async function tryRefreshToken() {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data?.accessToken) {
        useAuthStore.getState().setAccessToken(result.data.accessToken);
        if (result.data.user) {
          useAuthStore.getState().setAuth(result.data.user, result.data.accessToken);
        }
        return result.data.accessToken;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export const queryService = {
  sendQuery: async (question, filters = {}, onChunk, onSources, onDone, onError) => {
    let token = useAuthStore.getState().accessToken;

    const doFetch = async (authToken) => {
      const response = await fetch(`${API_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ question, ...filters }),
      });
      return response;
    };

    try {
      let response = await doFetch(token);

      // If 401, try refreshing the token once
      if (response.status === 401) {
        const newToken = await tryRefreshToken();
        if (newToken) {
          token = newToken;
          response = await doFetch(newToken);
        } else {
          useAuthStore.getState().logout();
          onError?.('Session expired. Please log in again.');
          return;
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Query failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let currentEvent = 'message';
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') {
              onDone?.();
              return;
            }
            try {
              const parsed = JSON.parse(data);

              switch (currentEvent) {
                case 'answer':
                  onChunk?.(parsed.text || '');
                  break;
                case 'sources':
                  onSources?.(parsed.sources || []);
                  break;
                case 'error':
                  onError?.(parsed.message || 'Unknown error');
                  break;
                case 'done':
                  onDone?.();
                  return;
                case 'status':
                  // Status updates (embedding, retrieving, analyzing, generating)
                  break;
                default:
                  if (parsed.type === 'chunk' || parsed.token) {
                    onChunk?.(parsed.token || parsed.content || '');
                  } else if (parsed.type === 'sources' || parsed.sources) {
                    onSources?.(parsed.sources || []);
                  }
                  break;
              }
            } catch {
              onChunk?.(data);
            }
            currentEvent = 'message';
          }
        }
      }

      onDone?.();
    } catch (error) {
      onError?.(error.message);
      throw error;
    }
  },

  compareDocuments: async (docIdA, docIdB, topic) => {
    const response = await api.post('/api/query/compare', {
      documentIds: [docIdA, docIdB],
      topic,
    });
    return response.data;
  },

  getQueryHistory: async () => {
    const response = await api.get('/api/query/history');
    return response.data;
  },
};
