// src/config/constants.ts
// ─── Config générale ──────────────────────────────────────────
export const APP_CONFIG = {
  NAME:                "SUPMTI Chatbot",
  VERSION:             "1.0.0",
  API_BASE_URL:        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  SUPPORTED_LANGUAGES: ['fr', 'en', 'ar-MA'],
};

// ── Endpoints Backend ─────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const ENDPOINTS = {
  SESSION:       `${API_BASE}/api/session`,
  NEW_CHAT:      `${API_BASE}/api/new_chat`,
  RESET:         `${API_BASE}/api/reset`,
  CHAT:          `${API_BASE}/api/chat`,
  FITSCORE:      `${API_BASE}/api/fitscore`,
  ADMISSION:     `${API_BASE}/api/admission`,
  CARRIERE:      `${API_BASE}/api/carriere`,
  COMPARER:      `${API_BASE}/api/comparer`,
  FILIERES:      `${API_BASE}/api/filieres`,
  PROFIL:        `${API_BASE}/api/profil`,
  PSYCHO_START:  `${API_BASE}/api/psycho/start`,
  PSYCHO_ANSWER: `${API_BASE}/api/psycho/answer`,
  COACH:         `${API_BASE}/api/coach`,
  PEERMATCH:     `${API_BASE}/api/peermatch`,   // ← était manquant
  HISTORIQUE:    `${API_BASE}/api/historique`,
} as const;

// ── Filières (pour compatibilité avec l'ancien code) ──────────
export const FILIERES = [
  { id: 'ISI',   name: 'Ingénierie Systèmes Informatiques', minAverage: 12.5 },
  { id: 'ME',    name: 'Management des Entreprises',        minAverage: 11.0 },
  { id: 'IISIC', name: 'IA & Systèmes d\'Information',      minAverage: 13.0 },
  { id: 'IISRT', name: 'Réseaux & Télécommunications',      minAverage: 12.0 },
  { id: 'FACG',  name: 'Finance, Audit & Contrôle',         minAverage: 11.5 },
  { id: 'MSTIC', name: 'Management Digital & TIC',          minAverage: 11.0 },
];

// ── Métadonnées filières SUPMTI (SidePanel / PeerMatch) ───────
export const FILIERE_META: Record<string, { nom: string; icon: string; couleur: string }> = {
  ISI:   { nom: "Ingénierie Systèmes Informatiques", icon: "💻", couleur: "#3b82f6" },
  ME:    { nom: "Management des Entreprises",        icon: "📊", couleur: "#22c55e" },
  IISIC: { nom: "IA & Systèmes d'Information",       icon: "🤖", couleur: "#a855f7" },
  IISRT: { nom: "Réseaux & Télécommunications",      icon: "📡", couleur: "#06b6d4" },
  FACG:  { nom: "Finance, Audit & Contrôle",         icon: "💰", couleur: "#f59e0b" },
  MSTIC: { nom: "Management Digital & TIC",          icon: "🌐", couleur: "#ec4899" },
};