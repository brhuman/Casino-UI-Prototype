import { Home, Gamepad2, Layers, User, Bomb } from 'lucide-react';
import { useUiStore } from '../../store/useUiStore';
import type { ViewType } from '../../store/useUiStore';

const MENU_ITEMS: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'lobby', label: 'Lobby', icon: Home },
  { id: 'slots', label: 'Slots', icon: Gamepad2 },
  { id: 'mines', label: 'Mines', icon: Bomb },
  { id: 'tables', label: 'Tables', icon: Layers },
  { id: 'profile', label: 'Profile', icon: User },
];

export const BottomTabBar = () => {
  const { currentView, setView } = useUiStore();

  return (
    <nav className="flex lg:hidden fixed bottom-0 left-0 w-full h-16 bg-gray-900/90 backdrop-blur-xl border-t border-gray-800 z-50 justify-around items-center px-2 pb-safe">
      {MENU_ITEMS.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              isActive ? 'text-neon-blue' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon size={20} className={isActive ? "drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]" : ""} />
            <span className="text-[10px] font-medium tracking-wider uppercase">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
