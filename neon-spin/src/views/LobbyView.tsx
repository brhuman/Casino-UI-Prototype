import { useState, useEffect, useMemo } from 'react';
import { Plus, Crown, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { SlotsIcon, MinesIcon, RouletteIcon } from '../components/ui/GameIcons';
import { useUiStore } from '../store/useUiStore';
import { useUserStore } from '../store/useUserStore';
import { LatestWins } from '../components/game/LatestWins';
import { LeaderboardView } from '../components/game/LeaderboardView';
import { GlobalChat } from '../components/game/GlobalChat';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../store/useSettingsStore';



export const LobbyView = () => {
  const { t } = useTranslation();
  const { neonGlow } = useSettingsStore();
  const setView = useUiStore((state) => state.setView);
  const isVip = useUserStore((state) => state.isVip);
  const setVip = useUserStore((state) => state.actions.setVip);
  const updateBalance = useUserStore((state) => state.actions.updateBalance);
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
      <title>Neon Spin | The Ultimate Cyberpunk Gaming Experience</title>
      <meta name="description" content="Welcome to Neon Spin, where high-stakes mystery meets futuristic aesthetics. Play Mines, Roulette, and Slots in a world of neon lights." />
      <meta property="og:title" content="Neon Spin | The Ultimate Cyberpunk Gaming Experience" />
      <meta property="og:description" content="Welcome to Neon Spin, where high-stakes mystery meets futuristic aesthetics. Play Mines, Roulette, and Slots in a world of neon lights." />
      <meta property="og:image" content="https://neonspin.vercel.app/og-image.png" />
      <meta name="twitter:title" content="Neon Spin | The Ultimate Cyberpunk Gaming Experience" />
      <meta name="twitter:description" content="Welcome to Neon Spin, where high-stakes mystery meets futuristic aesthetics. Play Mines, Roulette, and Slots in a world of neon lights." />
      <meta name="twitter:image" content="https://neonspin.vercel.app/og-image.png" />
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
            {neonGlow && (
              <div className="absolute -inset-10 bg-neon-cyan/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-duration-1000 pointer-events-none" />
            )}
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
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/70">
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
                  onClick={() => setView(game.id as any)}
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
                    onClick={() => setView(GAMES_DATA[currentUniverseSlide].id as any)}
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
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-2">
             {/* VIP Card */}
             <div 
               className={`relative p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border transition-all cursor-pointer group flex flex-col gap-6 sm:gap-8 ${isVip ? 'border-yellow-500/30 bg-yellow-400/5' : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'}`}
               onClick={() => setVip(!isVip)}
             >
                <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
                   <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-yellow-600 via-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-all">
                      <Crown size={32} className="text-black sm:scale-125" strokeWidth={2.5} />
                   </div>
                   <div className="flex flex-col gap-3 sm:gap-4">
                      <h4 className="text-2xl sm:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">
                        {isVip ? t('lobby.cta.vip_title_active') : t('lobby.cta.vip_title_inactive')}
                      </h4>
                      <p className="text-[10px] sm:text-sm font-black text-white/80 uppercase tracking-[0.2em] leading-relaxed max-w-[280px]">
                        {isVip ? t('lobby.cta.vip_desc_active') : t('lobby.cta.vip_desc_inactive')}
                      </p>
                   </div>
                   <button className={`w-fit px-8 py-4 sm:px-12 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase transition-all shadow-xl tracking-widest ${isVip ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white hover:bg-white hover:text-black hover:scale-105 active:scale-95'}`}>
                     {isVip ? t('lobby.cta.vip_button_active') : t('lobby.cta.vip_button_inactive')}
                   </button>
                </div>
                {neonGlow && (
                   <div className="absolute -inset-20 bg-yellow-400/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <Crown size={320} className="absolute -bottom-24 -right-24 text-white/[0.03] -rotate-12 pointer-events-none group-hover:text-white/[0.05] transition-colors" />
             </div>

             {/* Recharge Card */}
             <div 
               className="relative p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl hover:bg-white/[0.08] transition-all cursor-pointer group flex flex-col gap-6 sm:gap-8"
               onClick={() => updateBalance(5000)}
             >
                <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
                   <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-neon-cyan via-[#00ccff] to-neon-cyan flex items-center justify-center shadow-2xl transform group-hover:-rotate-12 transition-all">
                      <Plus size={32} className="text-black sm:scale-125" strokeWidth={3} />
                   </div>
                   <div className="flex flex-col gap-3 sm:gap-4">
                      <h4 className="text-2xl sm:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">
                        {t('lobby.cta.recharge_title')}
                      </h4>
                      <p className="text-[10px] sm:text-sm font-black text-white/80 uppercase tracking-[0.2em] leading-relaxed max-w-[280px]">
                        {t('lobby.cta.recharge_desc')}
                      </p>
                   </div>
                   <button className="w-fit px-8 py-4 sm:px-12 sm:py-5 rounded-xl sm:rounded-2xl bg-neon-cyan text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_15px_40px_rgba(0,255,255,0.25)] hover:scale-105 active:scale-95">
                     {t('lobby.cta.recharge_button')}
                   </button>
                </div>
                {neonGlow && (
                   <div className="absolute -inset-20 bg-neon-cyan/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <Plus size={320} className="absolute -bottom-24 -right-24 text-white/[0.03] rotate-12 pointer-events-none group-hover:text-white/[0.05] transition-colors" />
             </div>
          </section>

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
