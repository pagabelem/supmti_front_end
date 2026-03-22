// // src/store/authStore.ts
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// // ─── Type User aligné avec ce que renvoie le backend ─────────
// export interface User {
//   id:         string;
//   full_name:  string;
//   email:      string;
//   role:       'student' | 'admin';
//   is_active?: boolean;
//   created_at?: string;
//   // Champs optionnels renvoyés par /api/session
//   average?:   number;
//   bac_type?:  string;
//   level?:     string;
//   city?:      string;
//   interests?: string[];
// }

// interface AuthState {
//   user:    User | null;
//   token:   string | null;
//   setAuth: (user: User, token: string) => void;
//   logout:  () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user:  null,
//       token: null,

//       setAuth: (user, token) => set({ user, token }),

//       logout: () => {
//         // Appel optionnel au backend pour effacer le cookie de session
//         fetch(
//           `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/auth/logout`,
//           { method: 'POST', credentials: 'include' }
//         ).catch(() => {});
//         set({ user: null, token: null });
//       },
//     }),
//     {
//       name: 'supmti-auth',
//       // Ne persiste que user et token (pas les fonctions)
//       partialize: (state) => ({ user: state.user, token: state.token }),
//     }
//   )
// );




// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id:         string;
  full_name:  string;
  email:      string;
  role:       'student' | 'admin';
  is_active?: boolean;
  created_at?: string;
  average?:   number;
  bac_type?:  string;
  level?:     string;
  city?:      string;
  interests?: string[];
}

interface AuthState {
  user:    User | null;
  token:   string | null;
  setAuth: (user: User, token: string) => void;
  logout:  () => void;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// ── Clés localStorage à vider à la déconnexion ───────────────
const LS_KEYS_TO_CLEAR = [
  'peermatch_demande_id',  // demande PeerMatch de l'ancien user
  'supmti-session',        // sessionStore Zustand
  'supmti-chat',           // chatStore si persisté
  'supmti-settings',       // préférences (optionnel — commenter si tu veux garder)
  'sami-ai-config',        // config IA admin
];

function clearAllUserData() {
  // 1. Vider les clés spécifiques
  LS_KEYS_TO_CLEAR.forEach(key => localStorage.removeItem(key));

  // 2. Vider supmti-auth (sera re-set à null par Zustand)
  // On ne fait pas localStorage.clear() pour ne pas casser next-themes etc.
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:  null,
      token: null,

      setAuth: (user, token) => {
        // Au login d'un nouveau user — nettoyer les données de l'ancien
        clearAllUserData();
        set({ user, token });
      },

      logout: () => {
        // 1. Appel backend pour invalider cookie supmti_sid
        fetch(`${API}/api/auth/logout`, {
          method: 'POST', credentials: 'include'
        }).catch(() => {});

        // 2. Reset session SAMI côté backend
        fetch(`${API}/api/reset`, {
          method: 'POST', credentials: 'include'
        }).catch(() => {});

        // 3. Nettoyer tout le localStorage utilisateur
        clearAllUserData();

        // 4. Vider le store Zustand
        set({ user: null, token: null });

        // 5. Dispatch event pour vider ChatWindow et SessionStore
        window.dispatchEvent(new CustomEvent('sami:logout'));
      },
    }),
    {
      name: 'supmti-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);