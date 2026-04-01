import { MainLayout } from './components/layout/MainLayout';
import { useUiStore } from './store/useUiStore';
import { LobbyView } from './views/LobbyView';
import { SlotView } from './views/SlotView';
import { ProfileView } from './views/ProfileView';
import { MinesView } from './games/mines/Views/MinesView';
import { RouletteView } from './games/roulette/Views/RouletteView';
import { SettingsView } from './views/SettingsView';
import { AboutModal } from './components/ui/AboutModal';
import { useEffect } from 'react';
import { soundManager } from './game/audio/SoundManager';

import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const currentView = useUiStore((state) => state.currentView);

  useEffect(() => {
    soundManager.stopAll();
  }, [currentView]);

  return (
    <>
      <MainLayout>
        <AnimatePresence>
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
    </>
  );
}

export default App;
