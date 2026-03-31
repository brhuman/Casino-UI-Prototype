import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  isMuted: boolean;
  volume: number;
  theme: 'neon' | 'cyberpunk' | 'vaporwave';
  actions: {
    toggleMute: () => void;
    setVolume: (val: number) => void;
    setTheme: (theme: SettingsState['theme']) => void;
  };
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      isMuted: false,
      volume: 0.5,
      theme: 'neon',
      actions: {
        toggleMute: () => set({ isMuted: !get().isMuted }),
        setVolume: (volume) => set({ volume }),
        setTheme: (theme) => set({ theme }),
      },
    }),
    {
      name: 'casino-settings',
      partialize: (state) => ({ 
        isMuted: state.isMuted, 
        volume: state.volume, 
        theme: state.theme 
      }),
    }
  )
);
