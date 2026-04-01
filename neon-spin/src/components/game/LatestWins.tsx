import { motion, AnimatePresence } from 'framer-motion';
import { useLiveWinsStore } from '../../store/useLiveWinsStore';
import { useEffect } from 'react';
import { TrendingUp, UserPlus, Trophy } from 'lucide-react';
import { DUMMY_NICKNAMES, PRESET_AVATARS } from '../../constants/dummyData';

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
      const randomNick = DUMMY_NICKNAMES[Math.floor(Math.random() * DUMMY_NICKNAMES.length)];
      const hasAvatar = Math.random() > 0.4;
      const isPremium = Math.random() > 0.7;
      
      const newWin = {
        id: Date.now(),
        player: randomNick,
        game: games[Math.floor(Math.random() * games.length)],
        amount: (Math.random() * 800 + 5).toFixed(2),
        multiplier: `${multiplier}x`,
        avatar: hasAvatar ? PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)] : undefined,
        isPremium,
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
      const randomNick = DUMMY_NICKNAMES[Math.floor(Math.random() * DUMMY_NICKNAMES.length)];
      const newReg = {
        id: Date.now() + 1,
        player: randomNick,
        time: 'JUST NOW'
      };
      addRegistration(newReg);
      
      const nextDelay = (Math.random() * 15000 + 8000) * 4; // 32-92 seconds (4x slower)
      timeoutId = setTimeout(spawnReg, nextDelay);
    };

    timeoutId = setTimeout(spawnReg, 20000); // Wait longer for initial spawn
    return () => clearTimeout(timeoutId);
  }, [addRegistration]);

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 pt-10 pb-16 px-4">
      {/* 1. LIVE WINNERS COLUMN */}
      <section className="flex flex-col gap-6 relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
              <Trophy className="text-yellow-400" size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">Win Stream</h2>
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Latest payouts in real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-neon-cyan/5 px-3 py-1.5 rounded-full border border-neon-cyan/20">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_#00ffff]" />
            <span className="text-[10px] font-black text-neon-cyan uppercase tracking-widest">Live</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 min-h-[580px] overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            {wins.slice(0, 6).map((win) => (
              <motion.div 
                key={win.id} 
                layout
                initial={{ opacity: 0, y: -40, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.3 } }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 400, 
                  damping: 30,
                  layout: { duration: 0.4, type: 'spring', stiffness: 400, damping: 30 }
                }}
                className={`flex items-center justify-between p-5 h-[94px] rounded-2xl border backdrop-blur-3xl transition-all group/win ${win.isPremium ? 'bg-yellow-500/5 border-yellow-500/30 hover:bg-yellow-500/10 shadow-[0_0_20px_rgba(250,204,21,0.1)]' : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07]'}`}
              >
                 <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all overflow-hidden relative ${win.isPremium ? 'border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)]' : 'bg-gradient-to-br from-white/10 to-transparent border-white/10 group-hover/win:border-neon-cyan/40'}`}>
                     {win.avatar ? (
                       <img src={win.avatar} alt="Winner" className="w-full h-full object-cover" />
                     ) : (
                       <TrendingUp size={18} className={`${win.isPremium ? 'text-yellow-400' : 'text-white/40 group-hover/win:text-neon-cyan'}`} />
                     )}
                     {win.isPremium && (
                       <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent pointer-events-none" />
                     )}
                   </div>
                   <div className="flex flex-col">
                     <div className="flex items-center gap-1.5">
                       <span className={`font-black uppercase italic tracking-tighter text-base leading-tight ${win.isPremium ? 'text-yellow-400' : 'text-white'}`}>{win.game}</span>
                       {win.isPremium && <div className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse" />}
                     </div>
                     <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">{win.player}</span>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-8">
                   <div className="hidden sm:flex flex-col items-end">
                     <span className={`${win.isPremium ? 'text-yellow-400' : 'text-neon-purple'} font-black text-sm italic leading-tight`}>{win.multiplier}</span>
                     <span className="text-white/20 text-[8px] font-black uppercase tracking-widest">Multiplier</span>
                   </div>
                   <div className="text-right min-w-[90px]">
                     <span className={`${win.isPremium ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.45)]' : 'text-neon-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.45)]'} font-mono font-black block text-xl leading-tight`}>+${win.amount}</span>
                     <span className="text-white/10 text-[9px] font-black uppercase block tracking-widest mt-1">Just now</span>
                   </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* 2. RECENT REGISTRATIONS COLUMN */}
      <section className="flex flex-col gap-6 relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neon-purple/10 rounded-2xl border border-neon-purple/20">
              <UserPlus className="text-neon-purple" size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">New Arrivals</h2>
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Recent player registrations</p>
            </div>
          </div>
          <div className="flex gap-1.5 p-2 bg-white/5 rounded-xl border border-white/5">
             {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />)}
          </div>
        </div>

        <div className="flex flex-col gap-3 min-h-[580px] overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            {registrations.slice(0, 6).map((reg) => (
              <motion.div 
                key={reg.id} 
                layout
                initial={{ opacity: 0, y: -40, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.3 } }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 400, 
                  damping: 30,
                  layout: { duration: 0.4, type: 'spring', stiffness: 400, damping: 30 }
                }}
                className="flex items-center justify-between p-5 h-[94px] rounded-2xl bg-white/[0.015] border border-white/5 hover:bg-white/[0.05] transition-all group/reg"
              >
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-neon-purple/20 via-black to-neon-purple/5 flex items-center justify-center border border-white/10 group-hover/reg:border-neon-purple/40 transition-all shadow-2xl relative">
                     <div className="absolute inset-0 rounded-full bg-neon-purple/5 group-hover/reg:bg-neon-purple/15 transition-colors" />
                     <span className="relative text-[10px] font-black text-neon-purple tracking-tighter whitespace-nowrap">
                       {reg.player.split('_')[1]?.slice(0, 2) || 'NS'}
                     </span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-white font-black uppercase italic tracking-tighter text-lg leading-tight mb-0.5">{reg.player}</span>
                     <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-black text-[9px] uppercase tracking-widest">Established member</span>
                        <div className="w-1 h-1 rounded-full bg-emerald-400/30" />
                     </div>
                   </div>
                 </div>
                 
                 <div className="text-right flex flex-col items-end">
                   <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] mb-1">{reg.time}</span>
                   <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-neon-purple animate-shimmer" />
                   </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};
