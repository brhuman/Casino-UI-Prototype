import { create } from 'zustand';
import { useSettingsStore } from './useSettingsStore';

export type ViewType = 'lobby' | 'slots' | 'mines' | 'roulette' | 'profile';

interface UiState {
  currentView: ViewType;
  isMuted: boolean;
  showAboutModal: boolean;
  setView: (view: ViewType) => void;
  setMuted: (muted: boolean) => void;
  setShowAboutModal: (show: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentView: 'lobby',
  isMuted: useSettingsStore.getState().isMuted,
  showAboutModal: false,
  setView: (view) => set({ currentView: view }),
  setMuted: (muted) => {
    set({ isMuted: muted });
    // Keep SettingsStore in sync for persistence
    if (useSettingsStore.getState().isMuted !== muted) {
      useSettingsStore.getState().actions.toggleMute();
    }
  },
  setShowAboutModal: (show) => set({ showAboutModal: show }),
}));
