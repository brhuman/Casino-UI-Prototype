import { Home, Gamepad2, Layers, User, Bomb } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUiStore } from '../../store/useUiStore';
import { useUserStore } from '../../store/useUserStore';
import type { ViewType } from '../../store/useUiStore';

const MENU_ITEMS: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'lobby', label: 'Lobby', icon: Home },
  { id: 'slots', label: 'Slots', icon: Gamepad2 },
  { id: 'mines', label: 'Mines', icon: Bomb },
  { id: 'roulette', label: 'Roulette', icon: Layers },
  { id: 'profile', label: 'Profile', icon: User },
];

export const BottomMenu = () => {
  const { currentView, setView } = useUiStore();
  const isVip = useUserStore(state => state.isVip);

  return (
    <nav className={`fixed bottom-0 left-0 w-full h-20 backdrop-blur-3xl z-50 flex justify-center items-center gap-2 sm:gap-10 px-4 pb-safe transition-all duration-500 ${
      isVip 
        ? 'bg-yellow-950/20 border-t border-yellow-500/50 shadow-[0_-15px_30px_rgba(250,204,21,0.2)]' 
        : 'bg-gray-950/80 border-t border-white/5 shadow-[0_-20px_60px_rgba(0,0,0,0.9)]'
    }`}>
      {MENU_ITEMS.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className="flex flex-col items-center justify-center gap-1.5 transition-all duration-300 group relative min-w-[64px]"
          >
            {isActive && (
              <motion.div
                layoutId="active-glow"
                className="absolute -top-1 w-8 h-1 bg-neon-cyan rounded-full shadow-[0_0_15px_#00ffff]"
              />
            )}
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              isActive 
                ? 'text-white' 
                : 'text-white/40 group-hover:text-white/80'
            }`}>
              <Icon 
                size={24} 
                className={isActive ? 'drop-shadow-[0_0_8px_white]' : ''} 
              />
            </div>
            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.1em] transition-all duration-300 ${
              isActive 
                ? 'text-white' 
                : 'text-white/30 group-hover:text-white/60'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
