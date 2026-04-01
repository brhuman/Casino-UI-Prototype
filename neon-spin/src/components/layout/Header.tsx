import { useEffect } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useUiStore } from '../../store/useUiStore';
import { motion, useSpring, useTransform } from 'framer-motion';
import { User, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';

export const Header = () => {
  const balance = useUserStore((state) => state.balance);
  const setView = useUiStore((state) => state.setView);
  const isMuted = useUiStore((state) => state.isMuted);
  const setMuted = useUiStore((state) => state.setMuted);
  
  const { level, isVip } = useUserStore();
  
  useAudio();

  const springBalance = useSpring(balance, { bounce: 0, duration: 800 });
  const displayBalance = useTransform(springBalance, (current) => `$${Math.floor(current).toLocaleString()}`);

  useEffect(() => {
    springBalance.set(balance);
  }, [balance, springBalance]);

  return (
    <header className={`h-16 w-full flex items-center justify-between px-4 lg:px-8 backdrop-blur-md z-50 transition-all duration-500 border-b ${isVip ? 'bg-yellow-950/20 border-yellow-500/50 shadow-[0_0_20px_rgba(250,204,21,0.2)]' : 'bg-gray-900/80 border-gray-800'}`}>
      <div className="flex items-center transition-all">
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="Neon Spin"
            className="h-11 w-auto max-w-[220px] object-contain [filter:drop-shadow(0_0_8px_rgba(255,0,200,0.35))_drop-shadow(0_0_14px_rgba(0,220,255,0.28))] sm:h-12 sm:max-w-[260px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Balance Display - Always visible now */}
        <div className="flex bg-black/50 rounded-full px-3 py-1 border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] items-center">
          <motion.span className="text-neon-cyan font-mono text-sm font-black tracking-tighter">
            {displayBalance}
          </motion.span>
        </div>

        <button onClick={() => setMuted(!isMuted)} className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-300">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        
        <div className="relative group">
          <button 
            onClick={() => setView('profile')}
            className={`flex items-center gap-2 p-0.5 rounded-full transition-all border cursor-pointer group overflow-visible relative ${isVip ? 'bg-yellow-500/20 border-yellow-500/50 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center text-neon-fuchsia group-hover:text-neon-cyan transition-colors overflow-hidden">
              {useUserStore.getState().selectedAvatar ? (
                <img src={useUserStore.getState().selectedAvatar!} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={18} />
              )}
            </div>
            
            {/* Level Badge */}
            <div className={`absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-black border-2 border-gray-900 shadow-lg ${isVip ? 'bg-yellow-400 text-black' : 'bg-neon-purple text-white'}`}>
              {level}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
