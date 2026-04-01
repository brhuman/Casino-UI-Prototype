import { create } from 'zustand';

export type ViewType = 'lobby' | 'slots' | 'mines' | 'tables' | 'profile';

interface UiState {
  currentView: ViewType;
  isMuted: boolean;
  setView: (view: ViewType) => void;
  setMuted: (muted: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentView: 'lobby',
  isMuted: false,
  setView: (view) => set({ currentView: view }),
  setMuted: (muted) => set({ isMuted: muted }),
}));
