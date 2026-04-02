import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  isMuted: boolean;
  volume: number;
  theme: 'neon' | 'cyberpunk' | 'vaporwave';
  language: 'en' | 'uk' | 'ru' | 'pl';
  highQualityFx: boolean;
  neonGlow: boolean;
  actions: {
    toggleMute: () => void;
    setVolume: (val: number) => void;
    setTheme: (theme: SettingsState['theme']) => void;
    setLanguage: (lang: SettingsState['language']) => void;
    setHighQualityFx: (enabled: boolean) => void;
    setNeonGlow: (enabled: boolean) => void;
  };
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      isMuted: false,
      volume: 0.5,
      theme: 'neon',
      language: 'en',
      highQualityFx: true,
      neonGlow: true,
      actions: {
        toggleMute: () => set({ isMuted: !get().isMuted }),
        setVolume: (volume) => set({ volume }),
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
        setHighQualityFx: (highQualityFx) => set({ highQualityFx }),
        setNeonGlow: (neonGlow) => set({ neonGlow }),
      },
    }),
    {
      name: 'casino-settings',
      partialize: (state) => ({ 
        isMuted: state.isMuted, 
        volume: state.volume, 
        theme: state.theme,
        language: state.language,
        highQualityFx: state.highQualityFx,
        neonGlow: state.neonGlow
      }),
    }
  )
);

