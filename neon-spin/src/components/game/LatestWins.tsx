import { motion, AnimatePresence } from 'framer-motion';
import { useLiveWinsStore } from '../../store/useLiveWinsStore';
import { useEffect } from 'react';
import { TrendingUp, UserPlus, Trophy } from 'lucide-react';

export const LatestWins = () => {
  const wins = useLiveWinsStore((state) => state.wins);
  const registrations = useLiveWinsStore((state) => state.registrations);
  const addWin = useLiveWinsStore((state) => state.actions.addWin);
  const addRegistration = useLiveWinsStore((state) => state.actions.addRegistration);

  // Randomized Win Spawner
  useEffect(() => {
    let timeoutId: any;
    const spawnWin = () => {
      const games = ['Neon Spin', 'Mines', 'Roulette'];
      const multiplier = (Math.random() * 50 + 1.1).toFixed(1);
      const newWin = {
        id: Date.now(),
        player: `PLAYER_${Math.floor(Math.random() * 9000 + 1000)}`,
        game: games[Math.floor(Math.random() * games.length)],
        amount: (Math.random() * 800 + 5).toFixed(2),
        multiplier: `${multiplier}x`,
        time: 'JUST NOW'
      };
      addWin(newWin);
      
      const nextDelay = Math.random() * 8000 + 3000; // 3-11 seconds
      timeoutId = setTimeout(spawnWin, nextDelay);
    };

    timeoutId = setTimeout(spawnWin, 5000);
    return () => clearTimeout(timeoutId);
  }, [addWin]);

  // Randomized Registration Spawner
  useEffect(() => {
    let timeoutId: any;
    const spawnReg = () => {
      const newReg = {
        id: Date.now() + 1,
        player: `USER_${Math.floor(Math.random() * 9000 + 1000)}`,
        time: 'JUST NOW'
      };
      addRegistration(newReg);
      
      const nextDelay = Math.random() * 15000 + 8000; // 8-23 seconds (slower than wins)
      timeoutId = setTimeout(spawnReg, nextDelay);
    };

    timeoutId = setTimeout(spawnReg, 10000);
    return () => clearTimeout(timeoutId);
  }, [addRegistration]);

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pb-12">
      {/* 1. LIVE WINNERS COLUMN */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-xl font-black flex items-center gap-3 text-white uppercase italic tracking-tighter">
            <Trophy className="text-yellow-400" size={20} /> 
            Live Winners
          </h2>
          <span className="text-[9px] font-black text-neon-cyan animate-pulse uppercase tracking-widest bg-neon-cyan/10 px-2 py-1 rounded">Real-time</span>
        </div>

        <div className="flex flex-col gap-2 relative">
          <AnimatePresence initial={false} mode="popLayout">
            {wins.slice(0, 6).map((win) => (
              <motion.div 
                key={win.id} 
                layout
                initial={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)', transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 500, damping: 50 }}
                className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
              >
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-neon-cyan/30 transition-colors">
                     <TrendingUp size={14} className="text-white/20" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-white/30 text-[9px] font-black uppercase tracking-widest leading-none mb-1">{win.player}</span>
                     <span className="text-white font-black uppercase italic tracking-tighter text-sm leading-none">{win.game}</span>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-6">
                   <div className="hidden sm:flex flex-col items-end">
                     <span className="text-white/20 text-[8px] font-black uppercase tracking-widest leading-none mb-1">Mult</span>
                     <span className="text-neon-purple font-black text-xs italic leading-none">{win.multiplier}</span>
                   </div>
                   <div className="text-right min-w-[80px]">
                     <span className="text-neon-cyan font-mono font-black block text-base leading-none mb-1">${win.amount}</span>
                     <span className="text-white/10 text-[8px] font-black uppercase block tracking-widest leading-none">Just now</span>
                   </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* 2. RECENT REGISTRATIONS COLUMN */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-xl font-black flex items-center gap-3 text-white uppercase italic tracking-tighter">
            <UserPlus className="text-neon-purple" size={20} /> 
            New Players
          </h2>
          <div className="flex gap-1">
             {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white/20" />)}
          </div>
        </div>

        <div className="flex flex-col gap-2 relative">
          <AnimatePresence initial={false} mode="popLayout">
            {registrations.slice(0, 6).map((reg) => (
              <motion.div 
                key={reg.id} 
                layout
                initial={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)', transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 500, damping: 50 }}
                className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group"
              >
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple/20 to-transparent flex items-center justify-center border border-white/10 group-hover:border-neon-purple/30 transition-colors shadow-inner">
                     <span className="text-[8px] font-black text-neon-purple leading-none">{reg.player.split('_')[2]?.slice(0, 2) || 'US'}</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-white font-black uppercase italic tracking-tighter text-sm leading-none mb-1">{reg.player}</span>
                     <span className="text-emerald-400/60 text-[9px] font-black uppercase tracking-widest leading-none">Joined the club</span>
                   </div>
                 </div>
                 
                 <div className="text-right">
                   <span className="text-white/20 text-[8px] font-black uppercase tracking-[0.2em]">{reg.time}</span>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};
