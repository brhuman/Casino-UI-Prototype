import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUiStore, type ViewType } from '@/store/useUiStore';

export const LobbyHero = () => {
  const { t } = useTranslation();
  const neonGlow = useSettingsStore((state) => state.neonGlow);
  const setView = useUiStore((state) => state.setView);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slides = useMemo(() => [
    {
      id: 'slots' as ViewType,
      title: t('lobby.hero.slots.title'),
      subtitle: t('lobby.hero.slots.subtitle'),
      description: t('lobby.hero.slots.description'),
      buttonText: t('lobby.hero.slots.button'),
      bg: '/assets/banner_slots.png',
      color: 'purple',
    },
    {
      id: 'roulette' as ViewType,
      title: t('lobby.hero.roulette.title'),
      subtitle: t('lobby.hero.roulette.subtitle'),
      description: t('lobby.hero.roulette.description'),
      buttonText: t('lobby.hero.roulette.button'),
      bg: '/assets/banner_roulette.png',
      color: 'cyan',
    },
    {
      id: 'mines' as ViewType,
      title: t('lobby.hero.mines.title'),
      subtitle: t('lobby.hero.mines.subtitle'),
      description: t('lobby.hero.mines.description'),
      buttonText: t('lobby.hero.mines.button'),
      bg: '/assets/banner_mines.png',
      color: 'fuchsia',
    },
  ], [t]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((current) => (current + 1) % slides.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  const slide = slides[currentSlide];
  const accent = slide.color === 'purple'
    ? 'text-neon-purple from-neon-purple to-neon-fuchsia'
    : slide.color === 'cyan'
      ? 'text-neon-cyan from-neon-cyan to-blue-500'
      : 'text-neon-fuchsia from-neon-fuchsia to-neon-purple';

  return (
    <section
      className="relative h-[350px] sm:h-[450px] lg:h-[500px] w-full rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl group bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {neonGlow && <div className="absolute -inset-10 bg-neon-cyan/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-duration-1000 pointer-events-none" />}
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
            if (info.offset.x > 50) {
              setCurrentSlide((current) => (current - 1 + slides.length) % slides.length);
            } else if (info.offset.x < -50) {
              setCurrentSlide((current) => (current + 1) % slides.length);
            }
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <img src={slide.bg} alt={slide.title} className="absolute inset-0 w-full h-full object-cover brightness-[0.7] contrast-[1.1] scale-105 pointer-events-none" />
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute top-10 right-10 sm:top-16 sm:right-16 hidden sm:flex items-center gap-3 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/5 pointer-events-none"
          >
            <div className="w-2 h-2 rounded-full animate-pulse bg-current shadow-[0_0_10px_currentColor]" />
            <span className={`text-xs sm:text-sm font-black uppercase tracking-[0.5em] ${accent.split(' ')[0]}`}>{slide.subtitle}</span>
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/10 to-transparent p-8 sm:p-20 flex flex-col justify-start pt-16 sm:pt-24 pointer-events-none">
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }} className="max-w-xl">
              <div className="sm:hidden flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-neon-cyan" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/70">{slide.subtitle}</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.85] mb-6">
                {slide.title.split(' ')[0]} <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accent.split(' ').slice(1).join(' ')}`}>
                  {slide.title.split(' ').slice(1).join(' ')}
                </span>
              </h1>
              <p className="text-sm sm:text-lg text-white/80 mb-8 leading-relaxed max-w-md font-medium drop-shadow-md">{slide.description}</p>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setView(slide.id);
                }}
                className="group/btn relative px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-[0_15px_60px_rgba(255,255,255,0.2)] pointer-events-auto"
              >
                <Play size={16} fill="currentColor" /> {slide.buttonText}
                <div className="absolute inset-0 rounded-2xl bg-white blur-xl opacity-0 group-hover/btn:opacity-30 transition-opacity" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {slides.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Show ${item.title}`}
            className={`h-1 rounded-full transition-all duration-500 ${currentSlide === index ? 'w-12 bg-white shadow-[0_0_15px_white]' : 'w-4 bg-white/10 hover:bg-white/30'}`}
          />
        ))}
      </div>
    </section>
  );
};
