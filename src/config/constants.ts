export const APP_CONFIG = {
  NAME: "SUPMTI Chatbot",
  VERSION: "1.0.0",
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  SUPPORTED_LANGUAGES: ['fr', 'en', 'ar-MA'], // Français, Anglais, Darija
};

export const FILIERES = [
  { id: 'ing-info', name: 'Ingénierie Informatique', minAverage: 12 },
  { id: 'mgt-bus', name: 'Management & Business', minAverage: 11 },
  // À compléter selon les données SUPMTI
];