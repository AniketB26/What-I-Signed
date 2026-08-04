import { useState, useEffect, useRef } from 'react';
import useAuthStore from '../store/authStore';
import { documentService } from '../services/documents';

// Empty by default so the SSE stream is same-origin and rides the same proxy
// as every other call — Vite's in dev, nginx's in Docker. Hardcoding
// localhost:5000 here breaks any deployment where the API isn't on that exact
// host port, which silently freezes the progress bar at its initial 10%.
// Must stay in sync with services/api.js.
const API_URL = import.meta.env.VITE_API_URL || '';

const POLL_INTERVAL_MS = 3000;
const TERMINAL = new Set(['ready', 'failed']);

/**
 * Track a document's processing progress.
 *
 * Prefers the SSE stream, but falls back to polling if it cannot be
 * established. Without the fallback any proxy or network hiccup leaves the
 * progress bar frozen with no indication that it has stopped updating.
 */
export function useDocumentStatus(documentId, onReady) {
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);

  const eventSourceRef = useRef(null);
  const pollRef = useRef(null);
  const stoppedRef = useRef(false);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (!documentId) return undefined;

    stoppedRef.current = false;

    const cleanup = () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    const apply = (nextStatus, nextProgress) => {
      if (stoppedRef.current) return;
      setStatus(nextStatus);
      setProgress(nextProgress || 0);

      if (TERMINAL.has(nextStatus)) {
        stoppedRef.current = true;
        if (nextStatus === 'ready') onReadyRef.current?.();
        cleanup();
      }
    };

    // Polling fallback — uses the regular axios client, so it carries the
    // Bearer token and benefits from the 401 refresh interceptor.
    const startPolling = () => {
      if (pollRef.current || stoppedRef.current) return;

      const tick = async () => {
        try {
          const res = await documentService.getDocument(documentId);
          const doc = res?.data?.document || res?.data;
          if (doc?.status) apply(doc.status, doc.processingProgress);
        } catch {
          // Transient failures are fine; the next tick retries.
        }
      };

      pollRef.current = setInterval(tick, POLL_INTERVAL_MS);
      tick();
    };

    const token = useAuthStore.getState().accessToken;

    // EventSource cannot set headers, so the token rides as a query param.
    if (token) {
      const url = `${API_URL}/api/documents/${documentId}/status?token=${encodeURIComponent(token)}`;
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          apply(data.status, data.progress);
        } catch {
          // Ignore malformed frames.
        }
      };

      eventSource.onerror = () => {
        // The browser retries an EventSource on its own, but not when the
        // endpoint is unreachable outright. Drop it and poll instead.
        eventSource.close();
        eventSourceRef.current = null;
        startPolling();
      };
    } else {
      startPolling();
    }

    return () => {
      stoppedRef.current = true;
      cleanup();
    };
  }, [documentId]);

  return { status, progress };
}
