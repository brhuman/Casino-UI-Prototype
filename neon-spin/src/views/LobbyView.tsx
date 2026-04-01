import { motion } from 'framer-motion';
import { Gamepad2, Zap, Layers } from 'lucide-react';
import { useUiStore } from '../store/useUiStore';
import { LatestWins } from '../components/game/LatestWins';

export const LobbyView = () => {
  const setView = useUiStore((state) => state.setView);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full flex flex-col gap-8 pt-8 px-6 pb-8"
    >
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
          <Zap className="text-neon-pink" /> 
          Popular Games
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            className="group relative h-48 rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-neon-purple transition-all duration-300"
            onClick={() => setView('slots')}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
               <Gamepad2 size={64} className="text-gray-600 group-hover:text-neon-blue drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-colors" />
            </div>
            <div className="absolute bottom-4 left-4 z-20">
              <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">Neon Spin Slot</h3>
              <p className="text-sm text-neon-blue font-mono">MVP Demo</p>
            </div>
          </div>
          
          <div 
            className="group relative h-48 rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-neon-purple transition-all duration-300"
            onClick={() => setView('mines')}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
               <Zap size={64} className="text-gray-600 group-hover:text-neon-pink drop-shadow-[0_0_15px_rgba(255,0,255,0.5)] transition-colors" />
            </div>
            <div className="absolute bottom-4 left-4 z-20">
              <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">Neon Mines</h3>
              <p className="text-sm text-neon-pink font-mono">Original</p>
            </div>
          </div>

          <div 
            className="group relative h-48 rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-neon-purple transition-all duration-300"
            onClick={() => setView('roulette')}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
               <Layers size={64} className="text-gray-600 group-hover:text-neon-purple drop-shadow-[0_0_15px_rgba(191,0,255,0.5)] transition-colors" />
            </div>
            <div className="absolute bottom-4 left-4 z-20">
              <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">Roulette</h3>
              <p className="text-sm text-neon-purple font-mono">Classic Table</p>
            </div>
          </div>
        </div>
      </section>

      <LatestWins />
    </motion.div>
  );
};
