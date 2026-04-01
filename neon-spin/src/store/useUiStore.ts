import { create } from 'zustand';
import { useSettingsStore } from './useSettingsStore';

export type ViewType = 'lobby' | 'slots' | 'mines' | 'tables' | 'profile';

interface UiState {
  currentView: ViewType;
  isMuted: boolean;
  showAboutModal: boolean;
  isMenuOpen: boolean;
  setView: (view: ViewType) => void;
  setMuted: (muted: boolean) => void;
  setShowAboutModal: (show: boolean) => void;
  toggleMenu: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentView: 'lobby',
  isMuted: useSettingsStore.getState().isMuted,
  showAboutModal: false,
  isMenuOpen: false,
  setView: (view) => set({ currentView: view, isMenuOpen: false }),
  setMuted: (muted) => {
    set({ isMuted: muted });
    // Keep SettingsStore in sync for persistence
    if (useSettingsStore.getState().isMuted !== muted) {
      useSettingsStore.getState().actions.toggleMute();
    }
  },
  setShowAboutModal: (show) => set({ showAboutModal: show }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
}));
