import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { GlobalChat } from '@/components/game/GlobalChat';
import { LatestWins } from '@/components/game/LatestWins';
import { LeaderboardView } from '@/components/game/LeaderboardView';
import { MinesIcon, RouletteIcon, SlotsIcon } from '@/components/ui/GameIcons';
import type { ViewType } from '@/store/useUiStore';
import { useUiStore } from '@/store/useUiStore';
import { preloadViews } from '@/views/viewRegistry';
import { PageMeta } from '@/components/ui/PageMeta';
import { LobbyActionCards } from '@/components/lobby/LobbyActionCards';
import { LobbyHero } from '@/components/lobby/LobbyHero';

const GAME_VIEW_IDS: ViewType[] = ['slots', 'roulette', 'mines'];

export const LobbyView = () => {
  const { t } = useTranslation();
  const setView = useUiStore((state) => state.setView);
  const [currentUniverseSlide, setCurrentUniverseSlide] = useState(0);

  const GAMES_DATA = useMemo(() => [
    {
      id: 'slots',
      title: t('lobby.games.slots'),
      subtitle: t('lobby.games.premium_slot'),
      image: '/assets/slots_thumb.png',
      icon: SlotsIcon,
      color: 'neon-purple',
      players: '4.8k',
      border: 'hover:border-neon-purple/5'
    },
    {
      id: 'roulette',
      title: t('lobby.games.roulette'),
      subtitle: t('lobby.games.live_table'),
      image: '/assets/roulette_thumb.png',
      icon: RouletteIcon,
      color: 'neon-cyan',
      players: '1.2k',
      border: 'hover:border-neon-cyan/'
    },
    {
      id: 'mines',
      title: t('lobby.games.mines'),
      subtitle: t('lobby.games.logic_game'),
      image: '/assets/mines_thumb.png',
      icon: MinesIcon,
      color: 'neon-fuchsia',
      players: '842',
      border: 'hover:border-neon-fuchsia'
    }
  ], [t]);

  const nextUniverseSlide = () => setCurrentUniverseSlide((prev) => (prev + 1) % GAMES_DATA.length);
  const prevUniverseSlide = () => setCurrentUniverseSlide((prev) => (prev - 1 + GAMES_DATA.length) % GAMES_DATA.length);

  // Pre-load game view chunks once the lobby settles.
  useEffect(() => {
    const preloadGames = async () => {
      try {
        await preloadViews(GAME_VIEW_IDS);
      } catch (err) {
        console.warn('Game pre-loading failed:', err);
      }
    };

    const timeout = setTimeout(preloadGames, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full flex-1 flex flex-col items-center bg-black overflow-x-hidden relative">
      <PageMeta
        title="Neon Spin | The Ultimate Cyberpunk Gaming Experience"
        description="Welcome to Neon Spin, where high-stakes mystery meets futuristic aesthetics. Play Mines, Roulette, and Slots in a world of neon lights."
      />
      <div className="w-full max-w-[1920px] flex flex-col pb-24 relative">
        {/* Background Atmosphere */}
        <div className="pointer-events-none fixed inset-0 z-0 opacity-10 bg-[url('/assets/neon_lobby_background.png')] bg-cover bg-center bg-no-repeat" />
        
        <div className="relative z-10 flex flex-col gap-12 pt-4 sm:pt-8 px-4 sm:px-10">
          <LobbyHero />

          {/* 4. STATS BAR / SOCIAL PROOF */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2">
             {[
               { label: t('lobby.stats.active_players'), value: '1,248', color: 'text-neon-cyan' },
               { label: t('lobby.stats.total_payout'), value: '$2.4M', color: 'text-neon-fuchsia' },
               { label: t('lobby.stats.luck_factor'), value: t('lobby.stats.high'), color: 'text-yellow-400' },
               { label: t('lobby.stats.system_check'), value: t('lobby.stats.verified'), color: 'text-green-400' }
             ].map((stat, i) => (
               <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center backdrop-blur-2xl group hover:bg-white/[0.08] transition-all shadow-lg">
                 <span className="text-[13px] font-black text-white/90 uppercase tracking-[0.4em] mb-3 group-hover:text-white transition-colors tracking-widest">{stat.label}</span>
                 <span className={`text-2xl font-black italic uppercase ${stat.color} tracking-tighter`}>{stat.value}</span>
               </div>
             ))}
          </section>

          {/* 5. PREMIUM GAMES GRID */}
          <section className="relative overflow-hidden sm:overflow-visible">
            <div className="flex items-center justify-between mb-10 px-4">
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                 <div className="w-2 h-8 bg-neon-purple rounded-full shadow-[0_0_15px_#9333ea]" /> {t('lobby.universe')}
              </h2>
            </div>
            
            {/* Desktop Grid (3 columns) */}
            <div className="hidden sm:grid grid-cols-3 gap-8 sm:gap-10">
              {GAMES_DATA.map((game) => (
                <div 
                  key={game.id}
                  className={`group relative aspect-[4/5] rounded-[3rem] overflow-hidden cursor-pointer border border-white/5 ${game.border} transition-all duration-500 shadow-2xl`}
                  onClick={() => setView(game.id as ViewType)}
                >
                  <img src={game.image} alt={game.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-4">
                    <span className={`w-fit px-5 py-2 bg-${game.color}/20 text-${game.color} border border-${game.color}/30 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] backdrop-blur-md`}>{game.subtitle}</span>
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">{game.title}</h3>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex -space-x-2">
                         {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800" />)}
                         <span className="text-[10px] font-black text-white/60 flex items-center ml-4 uppercase">{game.players} {t('lobby.games.playing')}</span>
                      </div>
                      <button className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-${game.color} transition-all group-hover:scale-110 shadow-lg`}>
                         <game.icon size={32} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Slider (1 card with Swipe & Indicators) */}
            <div className="sm:hidden relative h-[500px]">
               <AnimatePresence mode="wait">
                  <motion.div
                    key={currentUniverseSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(_, info) => {
                       const swipeThreshold = 50;
                       if (info.offset.x > swipeThreshold) prevUniverseSlide();
                       else if (info.offset.x < -swipeThreshold) nextUniverseSlide();
                    }}
                    className="absolute inset-0 px-4 cursor-grab active:cursor-grabbing"
                    onClick={() => setView(GAMES_DATA[currentUniverseSlide].id as ViewType)}
                  >
                    <div className={`relative h-full w-full aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/5 transition-all shadow-2xl`}>
                       <img src={GAMES_DATA[currentUniverseSlide].image} alt={GAMES_DATA[currentUniverseSlide].title} className="absolute inset-0 w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                       <div className="absolute bottom-10 left-8 right-8 flex flex-col gap-4">
                          <span className={`w-fit px-5 py-2 bg-${GAMES_DATA[currentUniverseSlide].color}/20 text-${GAMES_DATA[currentUniverseSlide].color} border border-${GAMES_DATA[currentUniverseSlide].color}/30 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] backdrop-blur-md`}>{GAMES_DATA[currentUniverseSlide].subtitle}</span>
                          <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">{GAMES_DATA[currentUniverseSlide].title}</h3>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex -space-x-2">
                               {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800" />)}
                               <span className="text-[10px] font-black text-white/60 flex items-center ml-4 uppercase">{GAMES_DATA[currentUniverseSlide].players} {t('lobby.games.playing')}</span>
                            </div>
                            <div className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center shadow-lg`}>
                               {(() => {
                                  const Icon = GAMES_DATA[currentUniverseSlide].icon;
                                  return <Icon size={32} />;
                               })()}
                            </div>
                          </div>
                       </div>
                    </div>
                  </motion.div>
               </AnimatePresence>
            </div>

            {/* Mobile Indicators (Dots & Arrows) */}
            <div className="sm:hidden flex items-center justify-center gap-6 mt-8">
               <button 
                  onClick={prevUniverseSlide}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 active:bg-white/10 transition-colors"
               >
                  <ChevronLeft size={20} />
               </button>

               <div className="flex gap-2">
                  {GAMES_DATA.map((_, i) => (
                    <button 
                       key={i}
                       onClick={() => setCurrentUniverseSlide(i)}
                       className={`h-1.5 rounded-full transition-all duration-500 ${currentUniverseSlide === i ? 'w-8 bg-white shadow-[0_0_10px_white]' : 'w-2 bg-white/10'}`}
                    />
                  ))}
               </div>

               <button 
                  onClick={nextUniverseSlide}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 active:bg-white/10 transition-colors"
               >
                  <ChevronRight size={20} />
               </button>
            </div>
          </section>

          {/* 6. PERFORMANCE DASHBOARDS (CTAs) */}
          <LobbyActionCards />

          {/* 7. LIVE LATEST WINS */}
          <section>
             <LatestWins />
          </section>

          {/* 8. SOCIAL & COMPETITION GRID (50/50 Desktop) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pb-24">
             <LeaderboardView />
             <GlobalChat />
          </section>
        </div>
      </div>
    </div>
  );
};
