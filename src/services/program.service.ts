import api from './api';

export const programService = {
  getAll: () => api.get('/programs'),
  getOne: (id: string) => api.get(`/programs/${id}`),
  // Fonctions Admin [cite: 254]
  create: (data: any) => api.post('/programs', data),
  update: (id: string, data: any) => api.put(`/programs/${id}`, data),
  delete: (id: string) => api.delete(`/programs/${id}`),
};