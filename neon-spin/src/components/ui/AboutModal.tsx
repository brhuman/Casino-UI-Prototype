import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { useUiStore } from '../../store/useUiStore';
import { useTranslation } from 'react-i18next';

import { useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';

export const AboutModal = () => {
  const { t } = useTranslation();
  const showAboutModal = useUiStore((state) => state.showAboutModal);
  const setShowAboutModal = useUiStore((state) => state.setShowAboutModal);
  const { actions: settingsActions } = useSettingsStore();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      settingsActions.setHasSeenWelcome(true);
    }
    setShowAboutModal(false);
  };

  if (!showAboutModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-2xl bg-gray-950/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]"
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/10 blur-[100px] -ml-32 -mb-32" />
          
          {/* Top Border Glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50" />
          
          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 text-white hover:text-white/80 transition-all cursor-pointer z-10"
          >
            <X size={28} strokeWidth={3} />
          </button>

          <div className="p-10 sm:p-14 flex flex-col items-center w-full">
            {/* Main Greeting with Mascot */}
            {/* Main Greeting with Mascot */}
            <div className="flex items-center justify-center gap-4 mb-12 relative h-32">
              <motion.h1 
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.08 } }
                }}
                className="text-white text-4xl sm:text-5xl font-black tracking-tighter leading-tight flex"
              >
                {"Hi there!".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 5 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.h1>
              
              {/* Final Mascot - Super-Tight Mask with Continuous Rotation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 0, rotate: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: [0, -6, 6, -6, 6, 0],
                  rotate: [0, -8, 8, -8, 8, 0]
                }}
                transition={{ 
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                  x: { delay: 0.8, duration: 0.4, ease: "easeInOut" },
                  rotate: { 
                    delay: 1.2, 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }
                }}
                className="relative w-[101px] h-[101px] drop-shadow-[0_0_20px_rgba(0,255,255,0.4)] -translate-y-[15px]"
                style={{
                  WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 50%, transparent 68%)',
                  maskImage: 'radial-gradient(ellipse at 50% 100%, black 50%, transparent 68%)',
                }}
              >
                <img 
                  src="/assets/mascot_welcome.png" 
                  alt="Mascot Mascot" 
                  className="w-full h-full object-contain mix-blend-lighten"
                />
              </motion.div>
            </div>

            <div className="text-center mb-6 -mt-12">
              <div className="text-lg sm:text-xl font-light text-white tracking-tight leading-relaxed max-w-lg mx-auto">
                This is my <span className="font-black italic">pet project</span>.
                A technical demo with simulated credits. No real money gambling involved.
              </div>
            </div>

            {/* Tech Stack - Uniform Pills (3x2 Grid) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 w-full max-w-2xl">
              {[
                { name: 'React 19', color: 'text-[#61DAFB]', icon: <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-8 h-8 animate-[spin_10s_linear_infinite]"><circle cx="0" cy="0" r="2.05" fill="currentColor"/><g stroke="currentColor" strokeWidth="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg> },
                { name: 'PIXI.js 8', color: 'text-[#E53935]', icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><path fill="currentColor" d="M12 2L2 12l10 10l10-10L12 2zm0 4l6 6l-6 6l-6-6l6-6z"/></svg> },
                { name: 'TypeScript', color: 'text-[#3178C6]', icon: (
                  <svg viewBox="0 0 24 24" className="w-8 h-8">
                    <path fill="currentColor" d="M0 0h24v24H0V0z"/>
                    <path fill="white" d="M17.498 14.386c-.958 1.155-2.28 1.629-3.799 1.629-1.396 0-2.31-.639-2.31-1.547 0-.916 1.05-1.24 2.87-1.637l.42-.09c2.721-.577 3.998-1.577 3.998-3.414 0-1.92-1.579-3.33-4.01-3.33-1.94 0-3.36.78-4.32 2.12l1.64 1.15c.67-1.02 1.64-1.42 2.68-1.42.98 0 1.69.52 1.69 1.34 0 .86-.71 1.25-2.65 1.67l-.42.09c-2.73.57-3.99 1.58-3.99 3.39 0 1.95 1.6 3.33 4.14 3.33 2.21 0 3.73-.89 4.79-2.34l-1.63-1.18zM7.5 18h2.5V6H7.5v12z"/>
                  </svg>
                )},
                { name: 'Tailwind', color: 'text-cyan-400', icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><path fill="currentColor" d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8 1.144.3 1.961 1.139 2.866 2.063 1.474 1.507 3.184 3.253 6.934 3.253 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-1.145-.3-1.961-1.139-2.866-2.063-1.474-1.507-3.184-3.253-6.934-3.253zM6.001 11.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8 1.144.3 1.961 1.139 2.866 2.063 1.474 1.507 3.184 3.253 6.934 3.253 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-1.145-.3-1.961-1.139-2.866-2.063-1.474-1.507-3.184-3.253-6.934-3.253z"/></svg> },
                { name: 'Framer', color: 'text-fuchsia-400', icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><path fill="currentColor" d="M12 0L12 8L20 8L12 0ZM12 8L4 8L12 16L12 8ZM4 16L12 24L12 16L20 16L4 16Z"/></svg> },
                { name: 'Zustand', color: 'text-[#ece7da]', icon: (
                  <svg viewBox="0 0 24 24" className="w-8 h-8">
                    <path fill="currentColor" d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm0-18.4c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zm4.5 10c1.381 0 2.5 1.119 2.5 2.5s-1.119 2.5-2.5 2.5-2.5-1.119-2.5-2.5 1.119-2.5 2.5-2.5zm-9 0c1.381 0 2.5 1.119 2.5 2.5s-1.119 2.5-2.5 2.5-2.5-1.119-2.5-2.5 1.119-2.5 2.5-2.5z"/>
                  </svg>
                )}
              ].map((tech, idx) => (
                <div 
                  key={idx}
                  className="flex flex-col items-center justify-center gap-3.5 p-7 rounded-[1.75rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all cursor-default group aspect-square min-h-[125px]"
                >
                  <div className={`${tech.color} opacity-90 group-hover:opacity-100 transition-opacity`}>
                    {tech.icon}
                  </div>
                  <span className="text-[13px] font-black uppercase tracking-widest text-white transition-colors">{tech.name}</span>
                </div>
              ))}
            </div>

            {/* GitHub secondary link */}
            <a 
              href="https://github.com/brhuman/Casino-UI-Prototype" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-white/80 transition-all group underline underline-offset-8 decoration-white/40 decoration-2"
            >
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
               {t('common.about.github')}
            </a>




            {/* Footer Actions */}
            <div className="flex flex-col gap-6 w-full items-center">
              <button
                onClick={handleClose}
                className="w-full py-6 rounded-[2rem] bg-white text-black font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
              >
                {t('common.about.continue')}
              </button>

              {/* Don't show again checkbox */}
              <div 
                onClick={() => setDontShowAgain(!dontShowAgain)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${dontShowAgain ? 'bg-white border-white' : 'bg-white/5 border-white/20 group-hover:border-white/40'}`}>
                  {dontShowAgain && <Zap size={12} className="text-black" />}
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-white/80 transition-colors">
                  {t('common.about.dont_show')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
