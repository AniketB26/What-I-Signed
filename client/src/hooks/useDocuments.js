import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../services/documents';
import toast from 'react-hot-toast';

export function useDocuments(params = {}) {
  return useQuery({
    queryKey: ['documents', params],
    queryFn: () => documentService.getDocuments(params),
  });
}

export function useDocument(id) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => documentService.getDocument(id),
    enabled: !!id,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, onProgress }) => documentService.uploadDocument(file, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Upload failed');
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => documentService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Delete failed');
    },
  });
}
