import { create } from 'zustand';

export type ViewType = 'lobby' | 'slots' | 'mines' | 'roulette' | 'profile' | 'settings';

interface UiState {
  currentView: ViewType;
  showAboutModal: boolean;
  setView: (view: ViewType) => void;
  setShowAboutModal: (show: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentView: 'lobby',
  showAboutModal: false,
  setView: (view) => set({ currentView: view }),
  setShowAboutModal: (show) => set({ showAboutModal: show }),
}));
