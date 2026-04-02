import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Cpu, Layers, Zap, ExternalLink } from 'lucide-react';
import { useUiStore } from '../../store/useUiStore';
import { useTranslation } from 'react-i18next';

export const AboutModal = () => {
  const { t } = useTranslation();
  const showAboutModal = useUiStore((state) => state.showAboutModal);
  const setShowAboutModal = useUiStore((state) => state.setShowAboutModal);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hasBeenShown = localStorage.getItem('about_modal_shown');
    if (!hasBeenShown) {
      setShowAboutModal(true);
    }
  }, [setShowAboutModal]);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('about_modal_shown', 'true');
    }
    setShowAboutModal(false);
  };

  if (!showAboutModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-xl bg-gray-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,1)]"
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/10 blur-[100px] -ml-32 -mb-32" />
          
          {/* Top Border Glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50" />
          
          <button 
            onClick={handleClose}
            className="absolute top-8 right-8 p-2 text-white/20 hover:text-white transition-colors cursor-pointer z-10"
          >
            <X size={20} />
          </button>

          <div className="p-12 sm:p-16 flex flex-col items-center">
            {/* Header */}
            <div className="flex flex-col items-center gap-3 mb-10">
               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-fuchsia flex items-center justify-center shadow-[0_0_30px_rgba(147,51,234,0.3)] mb-2">
                 <Zap size={32} className="text-white fill-white" />
               </div>
               <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                 {t('common.about.title')}
               </h2>
               <span className="text-[10px] font-black text-neon-cyan uppercase tracking-[0.4em] opacity-80">
                 {t('common.about.subtitle')}
               </span>
            </div>

            {/* Description */}
            <p className="text-white/60 text-center text-sm leading-relaxed mb-12 font-medium max-w-sm">
              {t('common.about.desc')}
            </p>

            {/* Tech Stack Grid */}
            <div className="grid grid-cols-2 gap-4 w-full mb-12">
               {[
                 { icon: <Cpu size={16} />, label: 'React 19', color: 'text-blue-400' },
                 { icon: <Layers size={16} />, label: 'PIXI.js 8', color: 'text-orange-400' },
                 { icon: <Zap size={16} />, label: 'Framer Motion', color: 'text-fuchsia-400' },
                 { icon: <ExternalLink size={16} />, label: 'Vite 6', color: 'text-white' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <div className={`${item.color} opacity-60`}>{item.icon}</div>
                    <span className="text-[11px] font-black text-white/80 uppercase tracking-widest">{item.label}</span>
                 </div>
               ))}
            </div>

            {/* GitHub Button */}
            <a 
              href="https://github.com/human/Code_roll_casino" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full group relative p-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-4 hover:scale-[1.02] shadow-[0_15px_40px_rgba(255,255,255,0.1)] transition-all mb-12"
            >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
               {t('common.about.github')}
               <ExternalLink size={14} className="opacity-40 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>

            {/* Disclaimer */}
            <div className="flex items-center gap-4 p-5 bg-yellow-400/5 border border-yellow-400/20 rounded-2xl mb-12 text-left w-full">
               <ShieldCheck className="text-yellow-400 shrink-0" size={20} />
               <p className="text-[10px] text-yellow-400/80 font-black uppercase tracking-wider leading-relaxed">
                 {t('common.about.disclaimer')}
               </p>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col gap-6 w-full items-center">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-neon-cyan focus:ring-neon-cyan transition-all"
                />
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-white/60 transition-colors">
                  {t('common.about.dont_show')}
                </span>
              </label>

              <button
                onClick={handleClose}
                className="w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-neon-purple to-neon-fuchsia text-white font-black uppercase tracking-[0.4em] text-xs shadow-[0_20px_50px_rgba(147,51,234,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/10"
              >
                {t('common.about.continue')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
