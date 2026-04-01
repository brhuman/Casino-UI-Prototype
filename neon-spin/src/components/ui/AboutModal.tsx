import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck } from 'lucide-react';
import { useUiStore } from '../../store/useUiStore';

export const AboutModal = () => {
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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_20px_rgba(0,255,255,0.1)]"
        >
          {/* Neon Header Decoration */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#00ffff]" />
          
          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>

          <div className="p-10 pt-12 text-center">
            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase mb-4">
              Project Case Study
            </h2>

            <div className="space-y-4 text-gray-300 font-medium leading-relaxed mb-8">
              <p>
                Welcome! This project was created specifically to demonstrate <span className="text-cyan-400">PIXI.js</span> integration within a modern React application.
              </p>
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 text-left text-sm">
                <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <p>
                  <span className="text-white font-bold">Important:</span> This is a technical demonstration for a web developer portfolio. No real money gambling is involved. All credits are virtual and for testing purposes only.
                </p>
              </div>
              <p className="text-sm italic opacity-70">
                Created with passion to explore advanced graphics, state management, and smooth UI animations.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <label className="flex items-center justify-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                  Don't show this message again
                </span>
              </label>

              <button
                onClick={handleClose}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-black uppercase tracking-[0.2em] shadow-[0_4px_15px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/10"
              >
                Continue
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
