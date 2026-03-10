import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user';

interface AuthState {
  user: User | null;
  users: User[];
  token: string | null;
  login: (email: string, password: string) => boolean;
  register: (userData: any) => void;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const DEFAULT_STUDENT: User = {
  id: 'std-001',
  full_name: 'Amine Slimani',
  email: 'student@supmti.ma',
  role: 'student', // Correction : 'student' match ton type Role
  is_active: true,
  created_at: new Date().toISOString(),
  average: 15.5,
  bac_type: 'PC',
  level: '2ème année Bac',
  city: 'Fès',
  interests: ['Informatique', 'Robotique']
};

const DEFAULT_ADMIN: User = {
  id: 'admin-001',
  full_name: 'Admin SUPMTI',
  email: 'admin@supmti.ma',
  role: 'admin', // Correction : 'admin' match ton type Role
  is_active: true,
  created_at: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      users: [DEFAULT_ADMIN, DEFAULT_STUDENT],

      login: (email, password) => {
        const foundUser = get().users.find(u => u.email === email);
        if (foundUser) {
          set({ user: foundUser, token: "session_token_" + Math.random() });
          return true;
        }
        return false;
      },

      register: (userData) => {
        const newUser: User = {
          id: `user-${Math.random().toString(36).substr(2, 9)}`,
          full_name: userData.full_name || 'Nouvel Étudiant',
          email: userData.email || '',
          role: 'student', // On utilise 'student' au lieu de 'user'
          is_active: true,
          created_at: new Date().toISOString(),
          average: userData.average || 0,
          bac_type: userData.bac_type || '',
          level: userData.level || '',
          city: userData.city || '',
          interests: userData.interests || [],
        };

        set((state) => ({
          users: [...state.users, newUser],
          user: newUser,
          token: "new_session_token"
        }));
      },

      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'supmti-auth-system' }
  )
);