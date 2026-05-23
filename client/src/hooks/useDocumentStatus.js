import { useState, useEffect, useRef, useCallback } from 'react';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useDocumentStatus(documentId, onReady) {
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const eventSourceRef = useRef(null);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const connect = useCallback(() => {
    if (!documentId) return;

    const token = useAuthStore.getState().accessToken;
    const url = `${API_URL}/api/documents/${documentId}/status?token=${encodeURIComponent(token)}`;

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStatus(data.status);
        setProgress(data.progress || 0);

        if (data.status === 'ready') {
          onReadyRef.current?.();
          eventSource.close();
        } else if (data.status === 'failed') {
          eventSource.close();
        }
      } catch {
        // Ignore parse errors
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };
  }, [documentId]);

  useEffect(() => {
    connect();
    return () => {
      eventSourceRef.current?.close();
    };
  }, [connect]);

  return { status, progress };
}
