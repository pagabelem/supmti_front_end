import { create } from 'zustand';

export type PanelType =
  | 'profil' | 'fitscore' | 'admission' | 'carriere'
  | 'comparer' | 'psycho' | 'coach' | 'peermatch' | null;

interface PanelState {
  activePanel:  PanelType;
  peerBadge:    boolean;

  openPanel:    (panel: PanelType) => void;
  closePanel:   () => void;
  setPeerBadge: (val: boolean) => void;
}

export const usePanelStore = create<PanelState>((set) => ({
  activePanel: null,
  peerBadge:   false,

  openPanel:    (panel) => set({ activePanel: panel }),
  closePanel:   ()      => set({ activePanel: null }),
  setPeerBadge: (val)   => set({ peerBadge: val }),
}));