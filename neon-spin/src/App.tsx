import { Suspense, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/components/layout/MainLayout';
import { AboutModal } from '@/components/ui/AboutModal';
import { LoadingView } from '@/components/ui/LoadingView';
import { soundManager } from '@/game/audio/SoundManager';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUiStore } from '@/store/useUiStore';
import { preloadView, viewRegistry } from '@/views/viewRegistry';

const ViewFallback = () => (
  <div className="flex flex-1 items-center justify-center bg-black/40">
    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/35">
      Loading view
    </span>
  </div>
);

function App() {
  const { i18n } = useTranslation();
  const { currentView, setShowAboutModal } = useUiStore();
  const { language, highQualityFx, neonGlow, hasSeenWelcome } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(true);
  const CurrentView = viewRegistry[currentView];

  // Sync i18next with store language
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  useEffect(() => {
    soundManager.stopAll();
  }, [currentView]);

  useEffect(() => {
    void preloadView('lobby');
  }, []);

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
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%' }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col"
                >
                  <Suspense fallback={<ViewFallback />}>
                    <CurrentView />
                  </Suspense>
                </motion.div>
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
