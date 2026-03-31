import { create } from 'zustand';

export type ViewType = 'lobby' | 'slots' | 'mines' | 'tables' | 'profile';

interface UiState {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentView: 'lobby',
  setView: (view) => set({ currentView: view }),
}));
