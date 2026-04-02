import { useState, useEffect, useMemo } from 'react';
import { Crown, Plus, Play } from 'lucide-react';
import { SlotsIcon, MinesIcon, RouletteIcon } from '../components/ui/GameIcons';
import { useUiStore } from '../store/useUiStore';
import { useUserStore } from '../store/useUserStore';
import { LatestWins } from '../components/game/LatestWins';
import { LeaderboardView } from '../components/game/LeaderboardView';
import { GlobalChat } from '../components/game/GlobalChat';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';



export const LobbyView = () => {
  const { t } = useTranslation();
  const setView = useUiStore((state) => state.setView);
  const isVip = useUserStore((state) => state.isVip);
  const setVip = useUserStore((state) => state.actions.setVip);
  const updateBalance = useUserStore((state) => state.actions.updateBalance);

  const HERO_SLIDES = useMemo(() => [
    {
      id: 'slots',
      title: t('lobby.hero.slots.title'),
      subtitle: t('lobby.hero.slots.subtitle'),
      description: t('lobby.hero.slots.description'),
      buttonText: t('lobby.hero.slots.button'),
      bg: '/assets/banner_slots.png',
      color: 'neon-purple'
    },
    {
      id: 'roulette',
      title: t('lobby.hero.roulette.title'),
      subtitle: t('lobby.hero.roulette.subtitle'),
      description: t('lobby.hero.roulette.description'),
      buttonText: t('lobby.hero.roulette.button'),
      bg: '/assets/banner_roulette.png',
      color: 'neon-cyan'
    },
    {
      id: 'mines',
      title: t('lobby.hero.mines.title'),
      subtitle: t('lobby.hero.mines.subtitle'),
      description: t('lobby.hero.mines.description'),
      buttonText: t('lobby.hero.mines.button'),
      bg: '/assets/banner_mines.png',
      color: 'neon-fuchsia'
    }
  ], [t]);


  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 1. DYNAMIC PRE-LOADING LOGIC
  useEffect(() => {
    // Pre-load game modules in the background after lobby is ready
    const preloadGames = async () => {
      try {
        await Promise.all([
          import('./SlotView'),
          import('../games/mines/Views/MinesView'),
          import('../games/roulette/Views/RouletteView')
        ]);
        console.log('🎮 Games pre-loaded for instant access');
      } catch (err) {
        console.warn('Game pre-loading failed:', err);
      }
    };
    
    // Small delay to ensure Lobby is smooth first
    const timeout = setTimeout(preloadGames, 2000);
    return () => clearTimeout(timeout);
  }, []);

  // 2. AUTO-SLIDE LOGIC (Paused on hover)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [isHovered]);
  
  return (
    <div className="w-full flex-1 flex flex-col items-center bg-black overflow-x-hidden relative">
      <div className="w-full max-w-[1920px] flex flex-col pb-24 relative">
        {/* Background Atmosphere */}
        <div className="pointer-events-none fixed inset-0 z-0 opacity-10 bg-[url('/assets/neon_lobby_background.png')] bg-cover bg-center bg-no-repeat" />
        
        <div className="relative z-10 flex flex-col gap-12 pt-4 sm:pt-8 px-4 sm:px-10">
          {/* 3. HERO SLIDER */}
          <section 
            className="relative h-[350px] sm:h-[450px] lg:h-[500px] w-full rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl group bg-black"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  const swipeThreshold = 50;
                  if (info.offset.x > swipeThreshold) {
                    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
                  } else if (info.offset.x < -swipeThreshold) {
                    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
                  }
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <img 
                  src={HERO_SLIDES[currentSlide].bg} 
                  alt={HERO_SLIDES[currentSlide].title} 
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.7] contrast-[1.1] scale-105 pointer-events-none"
                />
                
                {/* Repositioned Subtitle (Top Right) */}
                <motion.div 
                   initial={{ y: -20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.2, duration: 0.4 }}
                   className="absolute top-10 right-10 sm:top-16 sm:right-16 hidden sm:flex items-center gap-3 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/5 pointer-events-none"
                >
                   <div className={`w-2 h-2 rounded-full animate-pulse ${
                      HERO_SLIDES[currentSlide].color === 'neon-purple' ? 'bg-neon-purple shadow-[0_0_10px_#9333ea]' : 
                      HERO_SLIDES[currentSlide].color === 'neon-cyan' ? 'bg-neon-cyan shadow-[0_0_10px_#00ffff]' : 'bg-neon-fuchsia shadow-[0_0_10px_#d946ef]'
                    }`} />
                    <span className={`text-xs sm:text-sm font-black uppercase tracking-[0.5em] ${
                      HERO_SLIDES[currentSlide].color === 'neon-purple' ? 'text-neon-purple' : 
                      HERO_SLIDES[currentSlide].color === 'neon-cyan' ? 'text-neon-cyan' : 'text-neon-fuchsia'
                    }`}>
                      {HERO_SLIDES[currentSlide].subtitle}
                    </span>
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/10 to-transparent p-8 sm:p-20 flex flex-col justify-start pt-16 sm:pt-24 pointer-events-none">
                   <motion.div
                     initial={{ x: -50, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ delay: 0.1, duration: 0.5 }}
                     className="max-w-xl"
                   >
                     {/* Mobile Subtitle */}
                     <div className="sm:hidden flex items-center gap-3 mb-4">
                        <div className={`w-2 h-2 rounded-full bg-neon-cyan`} />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/50">
                          {HERO_SLIDES[currentSlide].subtitle}
                        </span>
                     </div>

                     <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.85] mb-6">
                       {HERO_SLIDES[currentSlide].title.split(' ')[0]} <br />
                       <span className={`text-transparent bg-clip-text bg-gradient-to-r ${
                         HERO_SLIDES[currentSlide].color === 'neon-purple' ? 'from-neon-purple to-neon-fuchsia' : 
                         HERO_SLIDES[currentSlide].color === 'neon-cyan' ? 'from-neon-cyan to-blue-500' : 'from-neon-fuchsia to-neon-purple'
                       }`}>
                         {HERO_SLIDES[currentSlide].title.split(' ')[1]}
                       </span>
                     </h1>
                     <p className="text-sm sm:text-lg text-white/80 mb-8 leading-relaxed max-w-md font-medium drop-shadow-md">
                       {HERO_SLIDES[currentSlide].description}
                     </p>
                     <button 
                       onClick={(e) => {
                         e.stopPropagation(); // Prevent drag from triggering
                         setView(HERO_SLIDES[currentSlide].id as any);
                       }}
                       className="group/btn relative px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-[0_15px_60px_rgba(255,255,255,0.2)] pointer-events-auto"
                     >
                       <Play size={16} fill="currentColor" /> {HERO_SLIDES[currentSlide].buttonText}
                       <div className="absolute inset-0 rounded-2xl bg-white blur-xl opacity-0 group-hover/btn:opacity-30 transition-opacity" />
                     </button>
                   </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Centered Pagination Dots (Bottom Center) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
               {HERO_SLIDES.map((_, i) => (
                 <button 
                   key={i}
                   onClick={() => setCurrentSlide(i)}
                   className={`h-1 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-12 bg-white shadow-[0_0_15px_white]' : 'w-4 bg-white/10 hover:bg-white/30'}`}
                 />
               ))}
            </div>
          </section>

          {/* 4. STATS BAR / SOCIAL PROOF */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2">
             {[
               { label: t('lobby.stats.active_players'), value: '1,248', color: 'text-neon-cyan' },
               { label: t('lobby.stats.total_payout'), value: '$2.4M', color: 'text-neon-fuchsia' },
               { label: t('lobby.stats.luck_factor'), value: t('lobby.stats.high'), color: 'text-yellow-400' },
               { label: t('lobby.stats.system_check'), value: t('lobby.stats.verified'), color: 'text-green-400' }
             ].map((stat, i) => (
               <div key={i} className="bg-white/10 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center backdrop-blur-md group hover:bg-white/[0.15] transition-all shadow-lg">
                 <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] mb-3 group-hover:text-white/40 transition-colors">{stat.label}</span>
                 <span className={`text-xl font-black italic uppercase ${stat.color} tracking-tighter`}>{stat.value}</span>
               </div>
             ))}
          </section>

          {/* 5. PREMIUM GAMES GRID */}
          <section>
            <div className="flex items-center justify-between mb-10 px-4">
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                 <div className="w-2 h-8 bg-neon-purple rounded-full shadow-[0_0_15px_#9333ea]" /> {t('lobby.universe')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
              {/* Slot Card */}
              <div 
                className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden cursor-pointer border border-white/5 hover:border-neon-purple/5 transition-all duration-500 shadow-2xl"
                onClick={() => setView('slots')}
              >
                <img src="/assets/slots_thumb.png" alt="Slots" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-4">
                  <span className="w-fit px-5 py-2 bg-neon-purple/20 text-neon-purple border border-neon-purple/30 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] backdrop-blur-md">{t('lobby.games.premium_slot')}</span>
                  <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">{t('lobby.games.slots')}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800" />)}
                       <span className="text-[10px] font-black text-white/40 flex items-center ml-4 uppercase">4.8k {t('lobby.games.playing')}</span>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-neon-purple transition-all group-hover:scale-110 shadow-lg">
                       <SlotsIcon size={32} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Roulette Card */}
              <div 
                className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden cursor-pointer border border-white/5 hover:border-neon-cyan/ transition-all duration-500 shadow-2xl"
                onClick={() => setView('roulette')}
              >
                <img src="/assets/roulette_thumb.png" alt="Roulette" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-4">
                  <span className="w-fit px-5 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] backdrop-blur-md">{t('lobby.games.live_table')}</span>
                  <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">{t('lobby.games.roulette')}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800" />)}
                       <span className="text-[10px] font-black text-white/40 flex items-center ml-4 uppercase">1.2k {t('lobby.games.playing')}</span>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-neon-cyan transition-all group-hover:scale-110 shadow-lg">
                       <RouletteIcon size={32} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mines Card */}
              <div 
                className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden cursor-pointer border border-white/5 hover:border-neon-fuchsia transition-all duration-500 shadow-2xl"
                onClick={() => setView('mines')}
              >
                <img src="/assets/mines_thumb.png" alt="Mines" className="absolute inset-0 w-full h-full object-cover object-left transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-4">
                  <span className="w-fit px-5 py-2 bg-neon-fuchsia/20 text-neon-fuchsia border border-neon-fuchsia/30 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] backdrop-blur-md">{t('lobby.games.logic_game')}</span>
                  <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">{t('lobby.games.mines')}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800" />)}
                       <span className="text-[10px] font-black text-white/40 flex items-center ml-4 uppercase">842 {t('lobby.games.playing')}</span>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-neon-fuchsia transition-all group-hover:scale-110 shadow-lg">
                       <MinesIcon size={32} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. PERFORMANCE DASHBOARDS (CTAs) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
             <div 
               className={`relative p-10 rounded-[3rem] overflow-hidden border transition-all cursor-pointer group ${isVip ? 'bg-yellow-400/10 border-yellow-500/30' : 'bg-white/10 border-white/20 hover:bg-white/[0.15]'}`}
               onClick={() => setVip(!isVip)}
             >
                <div className="relative z-10 flex flex-col gap-6">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-yellow-600 via-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform">
                      <Crown size={32} className="text-black" strokeWidth={3} />
                   </div>
                   <div>
                      <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                        {isVip ? t('lobby.cta.vip_title_active') : t('lobby.cta.vip_title_inactive')}
                      </h4>
                      <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mt-3">
                        {isVip ? t('lobby.cta.vip_desc_active') : t('lobby.cta.vip_desc_inactive')}
                      </p>
                   </div>
                   <button className={`w-fit px-10 py-4 rounded-2xl text-xs font-black uppercase transition-all shadow-xl ${isVip ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white hover:bg-white hover:text-black'}`}>
                     {isVip ? t('lobby.cta.vip_button_active') : t('lobby.cta.vip_button_inactive')}
                   </button>
                </div>
                <Crown size={300} className="absolute -bottom-20 -right-20 text-white/[0.02] -rotate-12 pointer-events-none" />
             </div>

             <div 
               className="relative p-10 rounded-[3rem] overflow-hidden border border-white/20 bg-white/10 hover:bg-white/[0.15] transition-all cursor-pointer group"
               onClick={() => updateBalance(5000)}
             >
                <div className="relative z-10 flex flex-col gap-6">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-neon-cyan to-blue-600 flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform">
                      <Plus size={32} className="text-white" strokeWidth={3} />
                   </div>
                   <div>
                      <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">{t('lobby.cta.recharge_title')}</h4>
                      <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mt-3">{t('lobby.cta.recharge_desc')}</p>
                   </div>
                   <button className="w-fit px-10 py-4 rounded-2xl bg-neon-cyan text-black text-xs font-black uppercase hover:bg-white transition-all shadow-[0_0_30px_rgba(0,255,255,0.4)]">
                     {t('lobby.cta.recharge_button')}
                   </button>
                </div>
                <Plus size={300} className="absolute -bottom-20 -right-20 text-white/[0.02] pointer-events-none" />
             </div>
          </section>

          {/* 7. LIVE LATEST WINS */}
          <section>
             <LatestWins />
          </section>

          {/* 8. GLOBAL CHAT */}
          <section>
             <GlobalChat />
          </section>

          {/* 9. GLOBAL LEADERBOARD */}
          <section className="pb-10">
             <LeaderboardView />
          </section>
        </div>
      </div>
    </div>
  );
};
