import { Home, Gamepad2, Layers, User, Bomb } from 'lucide-react';
import { useUiStore } from '../../store/useUiStore';
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

  return (
    <nav className="fixed bottom-0 left-0 w-full h-20 bg-gray-950/90 backdrop-blur-3xl border-t border-white/10 z-50 flex justify-around items-center px-4 md:px-12 lg:px-32 pb-safe shadow-[0_-15px_50px_rgba(0,0,0,0.8)]">
      {MENU_ITEMS.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center min-w-[64px] h-full py-4 transition-all duration-300 relative group ${
              isActive ? 'text-neon-cyan' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {/* Glow effect on active */}
            {isActive && (
              <div className="absolute top-0 w-14 h-1 bg-neon-cyan shadow-[0_0_20px_#00ffff] rounded-full animate-pulse" />
            )}
            
            <div className={`flex flex-col items-center justify-center transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'group-hover:scale-105'}`}>
               <Icon size={isActive ? 24 : 22} className={isActive ? "drop-shadow-[0_0_12px_rgba(0,255,255,0.9)]" : ""} />
               
               <span className={`mt-1.5 text-[10px] font-black tracking-[0.25em] uppercase transition-all duration-300 ${
                 isActive ? 'opacity-100 text-neon-cyan shadow-[0_0_8px_rgba(0,255,255,0.4)]' : 'opacity-60 group-hover:opacity-100'
               }`}>
                 {item.label}
               </span>
            </div>
            
            {/* Hover Indicator */}
            {!isActive && (
              <div className="absolute top-0 w-0 h-0.5 bg-gray-700 transition-all duration-300 group-hover:w-10 group-hover:bg-gray-400 rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
