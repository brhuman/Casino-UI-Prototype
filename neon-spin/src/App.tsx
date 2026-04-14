import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/components/layout/MainLayout';
import { AboutModal } from '@/components/ui/AboutModal';
import { LoadingView } from '@/components/ui/LoadingView';
import { MinesView } from '@/games/mines/Views/MinesView';
import { RouletteView } from '@/games/roulette/Views/RouletteView';
import { soundManager } from '@/game/audio/SoundManager';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUiStore } from '@/store/useUiStore';
import { LobbyView } from '@/views/LobbyView';
import { ProfileView } from '@/views/ProfileView';
import { SettingsView } from '@/views/SettingsView';
import { SlotView } from '@/views/SlotView';

function App() {
  const { i18n } = useTranslation();
  const { currentView, setShowAboutModal } = useUiStore();
  const { language, highQualityFx, neonGlow, hasSeenWelcome } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(true);

  // Sync i18next with store language
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  useEffect(() => {
    soundManager.stopAll();
  }, [currentView]);

  // Show Welcome Modal on first visit
  useEffect(() => {
    if (!hasSeenWelcome) {
      setShowAboutModal(true);
    }
  }, [hasSeenWelcome, setShowAboutModal]);

  return (
    <div className={`${!highQualityFx ? 'fx-off' : ''} ${!neonGlow ? 'glow-off' : ''} h-screen w-full bg-black overflow-hidden relative`}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingView key="loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="h-full w-full flex flex-col"
          >
            <MainLayout>
              <AnimatePresence mode="wait">
                {currentView === 'lobby' && (
                  <motion.div
                    key="lobby"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col"
                  >
                    <LobbyView />
                  </motion.div>
                )}
                {currentView === 'slots' && (
                  <motion.div
                    key="slots"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col"
                  >
                    <SlotView />
                  </motion.div>
                )}
                {currentView === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col"
                  >
                    <ProfileView />
                  </motion.div>
                )}
                {currentView === 'mines' && (
                  <motion.div
                    key="mines"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col"
                  >
                    <MinesView />
                  </motion.div>
                )}
                {currentView === 'roulette' && (
                  <motion.div
                    key="roulette"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col"
                  >
                    <RouletteView />
                  </motion.div>
                )}
                {currentView === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%' }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col"
                  >
                    <SettingsView />
                  </motion.div>
                )}
              </AnimatePresence>
            </MainLayout>
            <AboutModal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
