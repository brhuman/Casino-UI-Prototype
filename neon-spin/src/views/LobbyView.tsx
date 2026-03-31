import { motion } from 'framer-motion';
import { useState } from 'react';
import { Gamepad2, TrendingUp, Zap } from 'lucide-react';
import { useUiStore } from '../store/useUiStore';

export const LobbyView = () => {
  const setView = useUiStore((state) => state.setView);
  
  const [recentWins] = useState(() => {
    return [1,2,3].map(i => ({
      id: i,
      player: `Player_${Math.floor(Math.random() * 9000 + 1000)}`,
      amount: (Math.random() * 500).toFixed(2)
    }));
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full flex flex-col gap-8"
    >
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
          <Zap className="text-neon-pink" /> 
          Популярные Игры
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
        </div>
      </section>

      <section className="flex-1">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
          <TrendingUp className="text-neon-blue" /> 
          Последние Выигрыши (Live)
        </h2>
        <div className="flex flex-col gap-3">
          {recentWins.map((win) => (
             <div key={win.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-900/40 border border-gray-800 backdrop-blur-sm">
                <div className="flex-1">
                  <span className="text-gray-400 text-sm font-mono block">{win.player}</span>
                  <span className="text-white font-medium">Neon Spin</span>
                </div>
                <div className="text-right">
                  <span className="text-neon-pink font-mono font-bold block">+${win.amount}</span>
                  <span className="text-gray-500 text-xs text-right">Just now</span>
                </div>
             </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
