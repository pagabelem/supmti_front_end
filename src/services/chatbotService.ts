// src/services/chatbotService.ts
import { ENDPOINTS } from '@/config/constants';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatResponse {
  reponse:     string;
  response?:   string;
  profil?:     Record<string, unknown> | null;
  peer_match?: { filiere: string; message: string } | null;
}

export interface SessionData {
  profil:           ProfilData | null;
  fitscore:         FitscoreData | null;
  historique_chats: HistoriqueChat[];
  chat_actuel_id?:  string;
}

export interface ProfilData {
  statut_profil?: 'complet' | 'incomplet' | 'partiel';
  informations_personnelles?: { prenom?: string; pays?: string; ville?: string; };
  parcours_academique?: {
    type_bac?: string; label_bac?: string; moyenne_generale?: number;
    mention?: string; niveau_actuel?: string; diplome_actuel?: string;
    notes_matieres?: Record<string, number>;
  };
  preferences?: { centres_interet?: string[]; ambition_professionnelle?: string; };
  profil_psychometrique?: Record<string, unknown>;
}

export interface FitscoreData {
  meilleure_filiere?: string;
  classement?: Array<{ filiere_id: string; filiere_nom: string; score_total: number; }>;
  rapport?: string;
}

export interface HistoriqueChat {
  id:          string;
  titre:       string;
  date:        string;
  nb_messages: number;
  en_cours?:   boolean;
}

export interface FitScoreResult {
  rapport:           string;
  classement:        Array<{ filiere_id: string; filiere_nom: string; score_total: number }>;
  meilleure_filiere: string;
  profil:            unknown;
}

// ─── Récupère le user_id depuis le localStorage (authStore Zustand) ──────────
function getUserId(): string {
  try {
    const raw = localStorage.getItem('supmti-auth');
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.id || '';
  } catch {
    return '';
  }
}

// ─── Helper fetch — ajoute X-User-Id automatiquement ────────────────────────
const apiFetch = (url: string, opts: RequestInit = {}) => {
  const uid = getUserId();
  return fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(uid ? { 'X-User-Id': uid } : {}),
      ...opts.headers,
    },
    ...opts,
  });
};

// ─── Service ─────────────────────────────────────────────────────────────────
const chatbotService = {

  /* ── Chat ── */
  async sendMessage(message: string): Promise<ChatResponse> {
    const res = await apiFetch(ENDPOINTS.CHAT, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
    return res.json();
  },

  /* ── Session ── */
  async getSession(): Promise<SessionData> {
    const res = await apiFetch(ENDPOINTS.SESSION);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async newChat(): Promise<void> {
    await apiFetch(ENDPOINTS.NEW_CHAT, { method: 'POST' });
  },

  async reset(): Promise<void> {
    await apiFetch(ENDPOINTS.RESET, { method: 'POST' });
  },

  /* ── FitScore ── */
  async getFitScore(): Promise<FitScoreResult> {
    const res = await apiFetch(ENDPOINTS.FITSCORE, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message ?? `Erreur ${res.status}`);
    }
    return res.json();
  },

  /* ── Admission ── */
  async getAdmission(): Promise<{ rapport: string; profil: unknown }> {
    const res = await apiFetch(ENDPOINTS.ADMISSION, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  /* ── Carrière ── */
  async getCarriere(filiereId = ''): Promise<unknown> {
    const res = await apiFetch(ENDPOINTS.CARRIERE, {
      method: 'POST',
      body: JSON.stringify({ filiere_id: filiereId }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  /* ── Comparer ── */
  async comparer(filiere1: string, filiere2: string): Promise<unknown> {
    const res = await apiFetch(ENDPOINTS.COMPARER, {
      method: 'POST',
      body: JSON.stringify({ filiere_1: filiere1, filiere_2: filiere2 }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  /* ── Coach ── */
  async getCoach(): Promise<{ rapport: string; profil: unknown }> {
    const res = await apiFetch(ENDPOINTS.COACH, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  /* ── Psychométrique ── */
  async startPsycho(): Promise<{ message: string; question_actuelle: number; total_questions: number }> {
    const res = await apiFetch(ENDPOINTS.PSYCHO_START, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async answerPsycho(reponse: string): Promise<unknown> {
    const res = await apiFetch(ENDPOINTS.PSYCHO_ANSWER, {
      method: 'POST',
      body: JSON.stringify({ reponse }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  /* ── PeerMatch ── */
  async peerMatch(prenom: string, email: string, filiere: string, message: string): Promise<unknown> {
    const res = await apiFetch(ENDPOINTS.PEERMATCH, {
      method: 'POST',
      body: JSON.stringify({ prenom, email, filiere, message }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  /* ── Filières ── */
  async getFilieres(): Promise<{ filieres: unknown[] }> {
    const res = await apiFetch(ENDPOINTS.FILIERES);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  /* ── Historique ── */
  async getHistorique(chatId: string): Promise<unknown> {
    const res = await apiFetch(`${ENDPOINTS.HISTORIQUE}/${chatId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async deleteHistorique(chatId: string): Promise<void> {
    await apiFetch(`${ENDPOINTS.HISTORIQUE}/${chatId}`, { method: 'DELETE' });
  },
};

export default chatbotService;