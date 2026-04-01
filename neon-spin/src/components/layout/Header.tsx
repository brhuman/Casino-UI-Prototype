import { useEffect } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useUiStore } from '../../store/useUiStore';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { User, Volume2, VolumeX, Menu, X, Home, Ghost, Coins, UserCircle } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';

export const Header = () => {
  const balance = useUserStore((state) => state.balance);
  const setView = useUiStore((state) => state.setView);
  const isMuted = useUiStore((state) => state.isMuted);
  const setMuted = useUiStore((state) => state.setMuted);
  
  const isMenuOpen = useUiStore((state) => state.isMenuOpen);
  const toggleMenu = useUiStore((state) => state.toggleMenu);
  
  useAudio();

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
        <button onClick={() => setMuted(!isMuted)} className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-300">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button 
          onClick={() => setView('profile')}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 p-1.5 pr-4 rounded-full transition-colors border border-gray-700 cursor-pointer group"
        >
          <div className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center text-neon-pink group-hover:text-neon-cyan transition-colors">
            <User size={16} />
          </div>
          <span className="text-sm font-medium hidden sm:block">Player</span>
        </button>
        
        {/* Mobile Menu Icon */}
        <button 
          onClick={toggleMenu}
          className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-gray-950 border-l border-white/10 z-[70] p-6 lg:hidden flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-black italic tracking-tighter text-white uppercase">Menu</span>
                <button onClick={toggleMenu} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { id: 'lobby', label: 'Lobby', icon: Home },
                  { id: 'slots', label: 'Slots', icon: Coins },
                  { id: 'mines', label: 'Mines', icon: Ghost },
                  { id: 'profile', label: 'Profile', icon: UserCircle },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id as any)}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors text-left group"
                  >
                    <item.icon size={20} className="text-gray-400 group-hover:text-neon-cyan transition-colors" />
                    <span className="font-bold uppercase tracking-widest text-sm text-gray-300 group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                <button
                  onClick={() => {
                    setMuted(!isMuted);
                  }}
                  className="flex items-center gap-4 w-full p-4 rounded-xl hover:bg-white/5 transition-colors"
                >
                  {isMuted ? <VolumeX size={20} className="text-red-400" /> : <Volume2 size={20} className="text-emerald-400" />}
                  <span className="font-bold uppercase tracking-widest text-sm text-gray-300">
                    {isMuted ? 'Unmute' : 'Muted'}
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
