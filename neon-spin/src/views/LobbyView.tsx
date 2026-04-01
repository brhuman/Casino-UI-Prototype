import { Gamepad2, Zap, Layers } from 'lucide-react';
import { useUiStore } from '../store/useUiStore';
import { LatestWins } from '../components/game/LatestWins';

export const LobbyView = () => {
  const setView = useUiStore((state) => state.setView);
  
  return (
    <div className="w-full flex-1 flex flex-col p-4 sm:p-12 mb-10 overflow-x-hidden relative">
      {/* Atmospheric Background */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-20 bg-[url('/assets/neon_lobby_background.png')] bg-cover bg-center bg-no-repeat"
      />
      
      <div className="relative z-10 flex flex-col gap-8">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
            <Zap className="text-neon-fuchsia" /> 
            Popular Games
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Slot Card */}
            <div 
              className="group relative h-48 rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-neon-purple transition-all duration-300"
              onClick={() => setView('slots')}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                 <Gamepad2 size={64} className="text-gray-600 group-hover:text-neon-purple drop-shadow-[0_0_15px_rgba(147,51,234,0.5)] transition-colors" />
              </div>
              <div className="absolute bottom-4 left-4 z-20">
                <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">Neon Spin Slot</h3>
                <p className="text-sm text-neon-purple font-mono">Premium</p>
              </div>
            </div>
            
            {/* Mines Card */}
            <div 
              className="group relative h-48 rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-neon-purple transition-all duration-300"
              onClick={() => setView('mines')}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                 <Zap size={64} className="text-gray-600 group-hover:text-neon-fuchsia drop-shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-colors" />
              </div>
              <div className="absolute bottom-4 left-4 z-20">
                <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">Neon Mines</h3>
                <p className="text-sm text-neon-fuchsia font-mono">Original</p>
              </div>
            </div>

            {/* Roulette Card */}
            <div 
              className="group relative h-48 rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-neon-purple transition-all duration-300"
              onClick={() => setView('roulette')}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                 <Layers size={64} className="text-gray-600 group-hover:text-neon-cyan drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-colors" />
              </div>
              <div className="absolute bottom-4 left-4 z-20">
                <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">Roulette</h3>
                <p className="text-sm text-neon-cyan font-mono">Classic Table</p>
              </div>
            </div>
          </div>
        </section>

        <LatestWins />
      </div>
    </div>
  );
};
