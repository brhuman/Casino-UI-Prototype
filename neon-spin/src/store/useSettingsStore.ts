import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getInitialLanguage = (): 'en' | 'uk' | 'ru' | 'pl' => {
  if (typeof window === 'undefined') return 'en';
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  
  // Custom requirement: Russian browsers MUST default to English
  if (browserLang === 'ru') return 'en';
  
  const supported: Array<SettingsState['language']> = ['en', 'uk', 'ru', 'pl'];
  return supported.includes(browserLang as any) ? (browserLang as any) : 'en';
};

interface SettingsState {
  isMuted: boolean;
  volume: number;
  theme: 'neon' | 'cyberpunk' | 'vaporwave';
  language: 'en' | 'uk' | 'ru' | 'pl';
  highQualityFx: boolean;
  neonGlow: boolean;
  hasSeenWelcome: boolean;
  actions: {
    toggleMute: () => void;
    setVolume: (val: number) => void;
    setTheme: (theme: SettingsState['theme']) => void;
    setLanguage: (lang: SettingsState['language']) => void;
    setHighQualityFx: (enabled: boolean) => void;
    setNeonGlow: (enabled: boolean) => void;
    setHasSeenWelcome: (seen: boolean) => void;
  };
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      isMuted: false,
      volume: 0.5,
      theme: 'neon',
      language: getInitialLanguage(),
      highQualityFx: true,
      neonGlow: true,
      hasSeenWelcome: false,
      actions: {
        toggleMute: () => set({ isMuted: !get().isMuted }),
        setVolume: (volume) => set({ volume }),
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
        setHighQualityFx: (highQualityFx) => set({ highQualityFx }),
        setNeonGlow: (neonGlow) => set({ neonGlow }),
        setHasSeenWelcome: (hasSeenWelcome) => set({ hasSeenWelcome }),
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
        neonGlow: state.neonGlow,
        hasSeenWelcome: state.hasSeenWelcome
      }),
    }
  )
);

