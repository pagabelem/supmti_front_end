import api from './api';

export const fitscoreService = {
  // Calcule la compatibilité entre un étudiant et les filières [cite: 121, 130]
  calculateFit: async (studentId: string) => {
    const { data } = await api.get(`/fitscore/${studentId}`);
    return data; // Retourne un tableau d'objets { programId, score, explanation } [cite: 132]
  },
  // Vérifie l'éligibilité automatique [cite: 134, 136]
  checkEligibility: async (studentId: string, programId: string) => {
    const { data } = await api.post('/eligibility/check', { studentId, programId });
    return data; 
  }
};