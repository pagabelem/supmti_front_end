// 'use client';
// import { create } from 'zustand';

// export type PanelType =
//   | 'profil' | 'fitscore' | 'admission' | 'carriere'
//   | 'comparer' | 'psycho' | 'coach' | 'peermatch'
//   | null;

// interface PanelState {
//   current:  PanelType;
//   open:  (t: PanelType) => void;
//   close: () => void;
// }

// export const usePanelStore = create<PanelState>((set) => ({
//   current: null,
//   open:  (t) => set({ current: t }),
//   close: () => set({ current: null }),
// }));