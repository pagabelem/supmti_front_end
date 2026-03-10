// 'use client';
// import { create } from 'zustand';
// import type { SessionData, StudentProfile, FitscoreResult, HistoriqueChat } from '@/types/student';
// import { ENDPOINTS } from '@/config/constants';

// interface SessionState {
//   // Miroir exact de `let session = { profil, fitscore, historique_chats }` dans index.html
//   profil:            StudentProfile | null;
//   fitscore:          FitscoreResult | null;
//   historique_chats:  HistoriqueChat[];
//   session_id:        string | null;
//   nb_messages:       number;
//   test_psycho_en_cours: boolean;
//   isLoaded:          boolean;
//   peerMatchBadge:    boolean;

//   loadSession:   () => Promise<void>;
//   setProfil:     (p: StudentProfile | null) => void;
//   setFitscore:   (f: FitscoreResult) => void;
//   setPeerBadge:  () => void;
//   resetSession:  () => void;
// }

// export const useSessionStore = create<SessionState>((set) => ({
//   profil:               null,
//   fitscore:             null,
//   historique_chats:     [],
//   session_id:           null,
//   nb_messages:          0,
//   test_psycho_en_cours: false,
//   isLoaded:             false,
//   peerMatchBadge:       false,

//   loadSession: async () => {
//     try {
//       const res  = await fetch(ENDPOINTS.SESSION, { credentials: 'include' });
//       const data: SessionData = await res.json();
//       set({
//         profil:               data.profil,
//         fitscore:             data.fitscore,
//         historique_chats:     data.historique_chats || [],
//         session_id:           data.session_id,
//         nb_messages:          data.nb_messages,
//         test_psycho_en_cours: data.test_psycho_en_cours,
//         isLoaded:             true,
//       });
//     } catch (e) {
//       console.error('Session Flask error:', e);
//       set({ isLoaded: true });
//     }
//   },

//   setProfil:    (p) => set({ profil: p }),
//   setFitscore:  (f) => set({ fitscore: f }),
//   setPeerBadge: () => set({ peerMatchBadge: true }),
//   resetSession: () => set({ profil: null, fitscore: null, historique_chats: [], nb_messages: 0, peerMatchBadge: false }),
// }));