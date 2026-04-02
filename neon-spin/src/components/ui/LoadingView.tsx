import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const LoadingView = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500); // Small pause at 100%
          return 100;
        }
        return prev + Math.random() * 15; // Simulated progressive load
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00ffff10_0%,transparent_70%)]" />
      
      {/* Tech Grid Background Overlay */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }} />

      <div className="relative flex flex-col items-center gap-12 w-full max-w-sm px-10">
        
        {/* Central Logo / Branding Placeholder */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.1)]"
        >
          <div className="w-8 h-8 bg-neon-cyan/20 rounded-full blur-xl" />
          <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff]" />
        </motion.div>

        {/* Status Text */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.6em] mb-2 animate-pulse">
            System Initialization
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white italic tracking-tighter">
              {Math.min(100, Math.floor(progress))}
            </span>
            <span className="text-[10px] font-black text-neon-cyan uppercase tracking-widest">%</span>
          </div>
        </div>

        {/* Technical Progress Bar */}
        <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-right from-neon-cyan to-white shadow-[0_0_15px_#00ffff]"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          />
          {/* Scanning Line */}
          <motion.div 
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 w-20 h-full bg-white/20 blur-sm"
          />
        </div>

        {/* Footer Technical Logs */}
        <div className="flex flex-col gap-1 items-center">
          <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">
            ASSETS_BUFFER_LOADING....OK
          </span>
          <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">
             LOCALIZATION_SYNC....OK
          </span>
          <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">
             NEON_CORE_REACTIVE....OK
          </span>
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-white/5 rounded-tl-3xl" />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-white/5 rounded-br-3xl" />
    </motion.div>
  );
};
