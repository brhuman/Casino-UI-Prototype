import { Home, User, Settings } from 'lucide-react';
import { SlotsIcon, MinesIcon, RouletteIcon } from '@/components/ui/GameIcons';
import { motion } from 'framer-motion';
import { useUiStore } from '@/store/useUiStore';
import { useUserStore } from '@/store/useUserStore';
import type { ViewType } from '@/store/useUiStore';

const MENU_ITEMS: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'lobby', label: 'Lobby', icon: Home },
  { id: 'slots', label: 'Slots', icon: SlotsIcon },
  { id: 'mines', label: 'Mines', icon: MinesIcon },
  { id: 'roulette', label: 'Roulette', icon: RouletteIcon },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const BottomMenu = () => {
  const { currentView, setView } = useUiStore();
  const isVip = useUserStore(state => state.isVip);

  return (
    <nav className={`fixed bottom-0 left-0 w-full h-[64px] sm:h-20 backdrop-blur-3xl z-50 px-2 pb-safe transition-all duration-500 ${
      isVip 
        ? 'bg-yellow-950/20 border-t border-yellow-500/50 shadow-[0_-15px_30px_rgba(250,204,21,0.2)]' 
        : 'bg-gray-950/80 border-t border-white/5 shadow-[0_-20px_60px_rgba(0,0,0,0.9)]'
    }`}>
      <div className="mx-auto h-full max-w-xl flex justify-between items-center px-4 sm:px-8">
        {MENU_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className="flex flex-col items-center justify-center gap-1 transition-all duration-300 group relative min-w-[60px] sm:px-[10px]"
            >
              {isActive && (
                <motion.div
                  layoutId="active-glow"
                  className="absolute -top-4 w-4 sm:w-10 h-1 bg-neon-cyan rounded-full shadow-[0_0_15px_#00ffff]"
                />
              )}
              <div className={`transition-all duration-300 ${
                isActive 
                  ? 'text-white' 
                  : 'text-white/30 group-hover:text-white/70'
              }`}>
                <Icon 
                  size={20} 
                  className={`sm:w-[28px] sm:h-[28px] ${isActive ? 'drop-shadow-[0_0_8px_white]' : ''}`} 
                />
              </div>
              <span className={`text-[7px] sm:text-[11px] font-black uppercase tracking-tighter sm:tracking-[0.1em] transition-all duration-300 ${
                isActive 
                  ? 'text-white' 
                  : 'text-white/20 group-hover:text-white/50'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
