import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { useLiveWinsStore } from '../../store/useLiveWinsStore';

export const LatestWins = () => {
  const wins = useLiveWinsStore((state) => state.wins);
  const { addWin } = useLiveWinsStore((state) => state.actions);

  useEffect(() => {
    const games = ['Neon Spin', 'Neon Mines', 'Roulette'];
    const interval = setInterval(() => {
      const newWin = {
        id: Date.now(),
        player: `Player_${Math.floor(Math.random() * 9000 + 1000)}`,
        game: games[Math.floor(Math.random() * games.length)],
        amount: (Math.random() * 1000 + 5).toFixed(2),
        time: 'Just now'
      };
      addWin(newWin);
    }, Math.random() * 5000 + 5000);

    return () => clearInterval(interval);
  }, [addWin]);

  return (
    <section className="flex-1">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
        <TrendingUp className="text-neon-blue" /> 
        Latest Wins (Live)
      </h2>
      <div className="flex flex-col gap-3 relative min-h-[440px]">
        <AnimatePresence initial={false} mode="popLayout">
          {wins.map((win) => (
            <motion.div 
              key={win.id} 
              layout
              initial={{ opacity: 0, y: -40, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.3 } }}
              transition={{ 
                type: 'spring',
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-900/40 border border-gray-800 backdrop-blur-sm overflow-hidden"
            >
               <div className="flex-1">
                 <span className="text-gray-400 text-sm font-mono block">{win.player}</span>
                 <span className="text-white font-medium">{win.game}</span>
               </div>
               <div className="text-right">
                 <span className="text-neon-pink font-mono font-bold block">+${win.amount}</span>
                 <span className="text-gray-500 text-xs text-right">{win.time}</span>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};
