import { MainLayout } from './components/layout/MainLayout';
import { useUiStore } from './store/useUiStore';
import { LobbyView } from './views/LobbyView';
import { SlotView } from './views/SlotView';
import { ProfileView } from './views/ProfileView';
import { MinesView } from './games/mines/Views/MinesView';
import { RouletteView } from './games/roulette/Views/RouletteView';
import { AboutModal } from './components/ui/AboutModal';
import { useEffect } from 'react';
import { soundManager } from './game/audio/SoundManager';

function App() {
  const currentView = useUiStore((state) => state.currentView);

  useEffect(() => {
    soundManager.stopAll();
  }, [currentView]);

  return (
    <>
      <MainLayout>
        {currentView === 'lobby' && <LobbyView />}
        {currentView === 'slots' && <SlotView />}
        {currentView === 'profile' && <ProfileView />}
        {currentView === 'mines' && <MinesView />}
        {currentView === 'roulette' && <RouletteView />}
      </MainLayout>
      <AboutModal />
    </>
  );
}

export default App;
