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

export const Sidebar = () => {
  const { currentView, setView } = useUiStore();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-full bg-gray-900/50 backdrop-blur-lg border-r border-gray-800 p-4">
      <div className="flex-1 mt-8 flex flex-col gap-2">
        {MENU_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-neon-purple/20 to-transparent text-neon-pink border-l-2 border-neon-pink' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? "drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]" : ""} />
              <span className="font-medium tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
