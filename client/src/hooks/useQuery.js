import { useState, useCallback, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryService } from '../services/query';
import toast from 'react-hot-toast';

export function useQueryHistory() {
  return useQuery({
    queryKey: ['queryHistory'],
    queryFn: () => queryService.getQueryHistory(),
  });
}

export function useSendQuery() {
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(false);

  const reset = useCallback(() => {
    setAnswer('');
    setSources([]);
    setError(null);
    abortRef.current = false;
  }, []);

  const stop = useCallback(() => {
    abortRef.current = true;
    setIsStreaming(false);
  }, []);

  const sendQuery = useCallback(async (question, filters = {}) => {
    reset();
    setIsStreaming(true);

    try {
      await queryService.sendQuery(
        question,
        filters,
        (chunk) => {
          if (abortRef.current) return;
          setAnswer((prev) => prev + chunk);
        },
        (sourcesData) => {
          if (abortRef.current) return;
          setSources(sourcesData);
        },
        () => {
          setIsStreaming(false);
        },
        (errorMsg) => {
          setError(errorMsg);
          setIsStreaming(false);
          toast.error(errorMsg || 'Query failed');
        }
      );
    } catch (err) {
      if (!abortRef.current) {
        setError(err.message);
        setIsStreaming(false);
      }
    }
  }, [reset]);

  return { answer, sources, isStreaming, error, sendQuery, reset, stop };
}

export function useCompareDocuments() {
  return useMutation({
    mutationFn: ({ docIdA, docIdB, topic }) =>
      queryService.compareDocuments(docIdA, docIdB, topic),
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Comparison failed');
    },
  });
}
