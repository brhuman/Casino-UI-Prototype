import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useUiStore } from '../../store/useUiStore';
import { motion, useSpring, useTransform } from 'framer-motion';
import { User, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';

export const Header = () => {
  const balance = useUserStore((state) => state.balance);
  const setView = useUiStore((state) => state.setView);
  const [muted, setMuted] = useState(false);
  
  useAudio(muted);

  const springBalance = useSpring(balance, { bounce: 0, duration: 800 });
  const displayBalance = useTransform(springBalance, (current) => `$${Math.floor(current).toLocaleString()}`);

  useEffect(() => {
    springBalance.set(balance);
  }, [balance, springBalance]);

  return (
    <header className="h-16 w-full flex items-center justify-between px-4 lg:px-8 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="flex items-center">
        <img
          src="/logo.png"
          alt="Neon Spin"
          className="h-11 w-auto max-w-[220px] object-contain [filter:drop-shadow(0_0_8px_rgba(255,0,200,0.35))_drop-shadow(0_0_14px_rgba(0,220,255,0.28))] sm:h-12 sm:max-w-[260px]"
        />
      </div>

      <div className="flex bg-black/50 rounded-full px-4 py-1.5 border border-gray-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] items-center">
        <span className="text-gray-400 text-xs mr-2 uppercase tracking-wide">Balance</span>
        <motion.span className="text-neon-blue font-mono font-semibold tracking-wider">
          {displayBalance}
        </motion.span>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => setMuted(!muted)} className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-300">
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button 
          onClick={() => setView('profile')}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 p-1.5 pr-4 rounded-full transition-colors border border-gray-700"
        >
          <div className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center text-neon-pink">
            <User size={16} />
          </div>
          <span className="text-sm font-medium hidden sm:block">Player</span>
        </button>
      </div>
    </header>
  );
};
