// src/store/sessionStore.ts
'use client';
import { create } from 'zustand';
import { ENDPOINTS } from '@/config/constants';

/* ── Types ── */
export interface StudentProfile {
  informations_personnelles?: { prenom?: string; pays?: string; ville?: string; };
  parcours_academique?: {
    type_bac?: string; label_bac?: string; moyenne_generale?: number;
    mention?: string; niveau_actuel?: string; diplome_actuel?: string;
    notes_matieres?: Record<string, number>;
  };
  preferences?:           { centres_interet?: string[]; ambition_professionnelle?: string; };
  statut_profil?:         string;
  profil_psychometrique?: Record<string, unknown>;
}

export interface FitscoreData {
  classement:        { filiere_id: string; filiere_nom: string; score_total: number; }[];
  meilleure_filiere: string;
  rapport:           string;
}

export interface HistoriqueChat {
  id:          string;
  titre:       string;
  date:        string;
  nb_messages: number;
  en_cours?:   boolean;
}

export interface ChatMessage {
  role:    'user' | 'assistant';
  content: string;
}

interface SessionState {
  profil:           StudentProfile | null;
  fitscore:         FitscoreData   | null;
  historique_chats: HistoriqueChat[];
  chat_actuel_id:   string;
  peerBadge:        boolean;

  setHistorique: (h: HistoriqueChat[]) => void;
  setProfil:     (p: StudentProfile)   => void;
  setFitscore:   (f: FitscoreData)     => void;
  setPeerBadge:  (v?: boolean)         => void;

  loadSession: ()           => Promise<void>;
  newChat:     ()           => Promise<void>;
  loadChat:    (id: string) => Promise<ChatMessage[]>;
  deleteChat:  (id: string) => Promise<void>;
}

// ─── Récupère le user_id depuis le localStorage ───────────────────────────────
function getUserId(): string {
  try {
    const raw = localStorage.getItem('supmti-auth');
    if (!raw) return '';
    return JSON.parse(raw)?.state?.user?.id || '';
  } catch {
    return '';
  }
}

function authHeaders(): HeadersInit {
  const uid = getUserId();
  return uid ? { 'X-User-Id': uid } : {};
}

export const useSessionStore = create<SessionState>((set, get) => ({
  profil:           null,
  fitscore:         null,
  historique_chats: [],
  chat_actuel_id:   '',
  peerBadge:        false,

  setHistorique: (h) => set({ historique_chats: h }),
  setProfil:     (p) => set({ profil: p }),
  setFitscore:   (f) => set({ fitscore: f }),
  setPeerBadge:  ()  => set({ peerBadge: true }),

  /* ── Charger la session depuis le backend ── */
  loadSession: async () => {
    try {
      const res = await fetch(ENDPOINTS.SESSION, {
        credentials: 'include',
        headers:     authHeaders(),   // ← X-User-Id envoyé ici
      });
      if (!res.ok) return;
      const data = await res.json();
      set({
        profil:           data.profil           || null,
        fitscore:         data.fitscore         || null,
        historique_chats: data.historique_chats || [],
        chat_actuel_id:   data.chat_actuel_id   || '',
      });
    } catch (e) {
      console.error('[sessionStore] loadSession error:', e);
    }
  },

  /* ── Créer une nouvelle conversation ── */
  newChat: async () => {
    try {
      await fetch(ENDPOINTS.NEW_CHAT, {
        method:      'POST',
        credentials: 'include',
        headers:     authHeaders(),
      });
      await get().loadSession();
    } catch (e) {
      console.error('[sessionStore] newChat error:', e);
    }
  },

  /* ── Charger les messages d'une conversation passée ── */
  loadChat: async (chatId: string): Promise<ChatMessage[]> => {
    try {
      const res  = await fetch(`${ENDPOINTS.HISTORIQUE}/${chatId}`, {
        credentials: 'include',
        headers:     authHeaders(),
      });
      const data = await res.json();
      if (data.error) return [];
      if (data.profil) set({ profil: data.profil });
      return (data.messages || []) as ChatMessage[];
    } catch (e) {
      console.error('[sessionStore] loadChat error:', e);
      return [];
    }
  },

  /* ── Supprimer une conversation ── */
  deleteChat: async (chatId: string) => {
    try {
      await fetch(`${ENDPOINTS.HISTORIQUE}/${chatId}`, {
        method:      'DELETE',
        credentials: 'include',
        headers:     authHeaders(),
      });
      set((s) => ({
        historique_chats: s.historique_chats.filter((c) => c.id !== chatId),
      }));
    } catch (e) {
      console.error('[sessionStore] deleteChat error:', e);
    }
  },
}));