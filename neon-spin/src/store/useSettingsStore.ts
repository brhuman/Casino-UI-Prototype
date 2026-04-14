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

const getLegacyUserVolume = (): number | undefined => {
  if (typeof window === 'undefined') return undefined;

  try {
    const rawUserSession = window.localStorage.getItem('casino-user-session');

    if (!rawUserSession) {
      return undefined;
    }

    const parsedUserSession = JSON.parse(rawUserSession);
    const legacyVolume = parsedUserSession?.state?.globalVolume;

    return typeof legacyVolume === 'number' ? legacyVolume : undefined;
  } catch {
    return undefined;
  }
};

const getInitialVolume = () => getLegacyUserVolume() ?? 0.3;

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
    setMuted: (muted: boolean) => void;
    setVolume: (val: number) => void;
    setTheme: (theme: SettingsState['theme']) => void;
    setLanguage: (lang: SettingsState['language']) => void;
    setHighQualityFx: (enabled: boolean) => void;
    setNeonGlow: (enabled: boolean) => void;
    setHasSeenWelcome: (seen: boolean) => void;
  };
}

type PersistedSettingsState = Pick<
  SettingsState,
  'isMuted' | 'volume' | 'theme' | 'language' | 'highQualityFx' | 'neonGlow' | 'hasSeenWelcome'
>;

const getDefaultSettingsState = (): PersistedSettingsState => ({
  isMuted: false,
  volume: getInitialVolume(),
  theme: 'neon',
  language: getInitialLanguage(),
  highQualityFx: true,
  neonGlow: true,
  hasSeenWelcome: false,
});

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...getDefaultSettingsState(),
      actions: {
        toggleMute: () => set({ isMuted: !get().isMuted }),
        setMuted: (isMuted) => set({ isMuted }),
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
      version: 2,
      migrate: (persistedState) => {
        const defaults = getDefaultSettingsState();
        const state = (persistedState ?? {}) as Partial<PersistedSettingsState>;
        const legacyVolume = getLegacyUserVolume();

        return {
          ...defaults,
          ...state,
          volume: legacyVolume ?? state.volume ?? 0.3,
        };
      },
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
