import api from './api';

export const alertService = {
  getAlerts: async (filters = {}) => {
    const response = await api.get('/api/alerts', { params: filters });
    return response.data;
  },

  dismissAlert: async (id) => {
    const response = await api.patch(`/api/alerts/${id}/dismiss`);
    return response.data;
  },

  snoozeAlert: async (id, days) => {
    const response = await api.patch(`/api/alerts/${id}/snooze`, { days });
    return response.data;
  },
};
