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
import { useSettingsStore } from './store/useSettingsStore';

function App() {
  const currentView = useUiStore((state) => state.currentView);
  const { highQualityFx, neonGlow } = useSettingsStore();

  useEffect(() => {
    soundManager.stopAll();
  }, [currentView]);

  // Dynamic SEO Metadata
  useEffect(() => {
    const metaDescription = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    
    const viewMetadata = {
      lobby: {
        title: 'Neon Spin | The Ultimate Cyberpunk Gaming Experience',
        description: 'Welcome to Neon Spin, where high-stakes mystery meets futuristic aesthetics. Play Mines, Roulette, and Slots in a world of neon lights.',
        image: 'https://neonspin.vercel.app/og-image.png'
      },
      slots: {
        title: 'Neon Slots | Spin to Win in the Cybercity',
        description: 'Experience the thrill of the Neon Slots. High volatility, massive payouts, and stunning visual effects. Your jackpot awaits.',
        image: 'https://neonspin.vercel.app/assets/slots_thumb.png'
      },
      mines: {
        title: 'Cyber Mines | High-Stakes Logic Game',
        description: 'Can you navigate the grid without hitting a mine? Multiply your balance in this high-tension logic game for the bold.',
        image: 'https://neonspin.vercel.app/assets/mines_thumb.png'
      },
      roulette: {
        title: 'Neon Roulette | The Wheel of Fortune',
        description: 'Place your bets on the glowing wheel. A classic casino experience reimagined for the neon future. Spin and win.',
        image: 'https://neonspin.vercel.app/assets/roulette_thumb.png'
      },
      profile: {
        title: 'User Profile | Neon Spin Identity',
        description: 'Track your wins, level up your rank, and customize your cyberpunk identity. See your progress in the Champions League.',
        image: 'https://neonspin.vercel.app/og-image.png'
      },
      settings: {
        title: 'Settings | Optimize Your Experience',
        description: 'Tune the neon glow, adjust audio levels, and optimize performance for your device. Personalize your Neon Spin session.',
        image: 'https://neonspin.vercel.app/og-image.png'
      }
    };

    const metadata = viewMetadata[currentView as keyof typeof viewMetadata] || viewMetadata.lobby;
    
    document.title = metadata.title;
    if (metaDescription) metaDescription.setAttribute('content', metadata.description);
    if (ogTitle) ogTitle.setAttribute('content', metadata.title);
    if (ogDescription) ogDescription.setAttribute('content', metadata.description);
    if (ogImage) ogImage.setAttribute('content', metadata.image);
    if (twitterTitle) twitterTitle.setAttribute('content', metadata.title);
    if (twitterDescription) twitterDescription.setAttribute('content', metadata.description);
    if (twitterImage) twitterImage.setAttribute('content', metadata.image);
  }, [currentView]);

  return (
    <div className={`${!highQualityFx ? 'fx-off' : ''} ${!neonGlow ? 'glow-off' : ''} min-h-screen flex flex-col`}>
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
    </div>
  );
}

export default App;
