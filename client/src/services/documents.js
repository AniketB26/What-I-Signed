import api from './api';

export const documentService = {
  getDocuments: async (params = {}) => {
    const response = await api.get('/api/documents', { params });
    return response.data;
  },

  getDocument: async (id) => {
    const response = await api.get(`/api/documents/${id}`);
    return response.data;
  },

  uploadDocument: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await api.delete(`/api/documents/${id}`);
    return response.data;
  },
};
