import { motion, AnimatePresence } from 'framer-motion';
import { useLiveWinsStore } from '../../store/useLiveWinsStore';
import { useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { DUMMY_NICKNAMES, PRESET_AVATARS } from '../../constants/dummyData';
import { useTranslation } from 'react-i18next';

export const LatestWins = () => {
  const wins = useLiveWinsStore((state) => state.wins);
  const registrations = useLiveWinsStore((state) => state.registrations);
  const addWin = useLiveWinsStore((state) => state.actions.addWin);
  const addRegistration = useLiveWinsStore((state) => state.actions.addRegistration);
  const { t } = useTranslation();

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
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 pt-4 pb-12">
      {/* 1. LIVE WINNERS COLUMN */}
      <section className="flex flex-col gap-8 relative">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
             <div className="w-2 h-8 bg-neon-purple rounded-full shadow-[0_0_15px_#9333ea]" /> {t('lobby.win_stream')}
          </h2>
          <div className="flex items-center gap-2 bg-neon-cyan/5 px-4 py-2 rounded-full border border-neon-cyan/20 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_10px_#00ffff]" />
            <span className="text-[10px] font-black text-neon-cyan uppercase tracking-[0.2em]">{t('lobby.live')}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 min-h-[580px]">
          <AnimatePresence initial={false} mode="popLayout">
            {wins.slice(0, 6).map((win) => (
              <motion.div 
                key={win.id} 
                layout
                initial={{ opacity: 0, x: -30, filter: 'blur(15px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)', transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-center justify-between p-6 rounded-[2.5rem] border backdrop-blur-2xl transition-all group/win ${win.isPremium ? 'bg-yellow-400/10 border-yellow-500/40' : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30 shadow-xl'}`}
              >
                 <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all overflow-hidden relative shadow-2xl ${win.isPremium ? 'border-yellow-400/40 bg-yellow-400/5' : 'bg-black/40 border-white/10 group-hover/win:border-neon-cyan/60'}`}>
                      {win.avatar ? (
                        <img src={win.avatar} alt="Winner" className="w-full h-full object-cover" />
                      ) : (
                        <TrendingUp size={20} className={`${win.isPremium ? 'text-yellow-400' : 'text-white/70 group-hover/win:text-neon-cyan'}`} />
                      )}
                    </div>
                   <div className="flex flex-col gap-1">
                     <span className={`font-black uppercase italic tracking-tighter text-lg leading-none ${win.isPremium ? 'text-yellow-400' : 'text-white'}`}>{win.game}</span>
                     <span className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">{win.player}</span>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-10">
                    <div className="hidden sm:flex flex-col items-end gap-1">
                      <span className={`${win.isPremium ? 'text-yellow-500' : 'text-neon-purple'} font-black text-sm italic tracking-tighter`}>{win.multiplier}</span>
                      <span className="text-white/60 text-[8px] font-black uppercase tracking-widest whitespace-nowrap">{t('lobby.multiplier')}</span>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <span className={`${win.isPremium ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'text-neon-cyan drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]'} font-mono font-black block text-2xl tracking-tighter`}>+${win.amount}</span>
                      <span className="text-white/60 text-[9px] font-black uppercase block tracking-[0.2em] mt-1">{t('lobby.just_now')}</span>
                    </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* 2. RECENT REGISTRATIONS COLUMN */}
      <section className="flex flex-col gap-8 relative">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
             <div className="w-2 h-8 bg-neon-cyan rounded-full shadow-[0_0_15px_#00ffff]" /> {t('lobby.new_arrivals')}
          </h2>
          <div className="flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/5">
             {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />)}
          </div>
        </div>

        <div className="flex flex-col gap-4 min-h-[580px]">
          <AnimatePresence initial={false} mode="popLayout">
            {registrations.slice(0, 6).map((reg) => (
              <motion.div 
                key={reg.id} 
                layout
                initial={{ opacity: 0, x: 30, filter: 'blur(15px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)', transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-between p-6 rounded-[2.5rem] bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all group/reg shadow-xl backdrop-blur-2xl"
              >
                 <div className="flex items-center gap-5">
                   <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-neon-purple/20 via-black to-neon-purple/5 flex items-center justify-center border border-white/10 group-hover/reg:border-neon-purple/40 transition-all shadow-2xl relative">
                     <div className="absolute inset-0 rounded-full bg-neon-purple/5 group-hover/reg:bg-neon-purple/15 transition-colors" />
                     <span className="relative text-[10px] font-black text-neon-purple tracking-tighter whitespace-nowrap">
                       {reg.player.split('_')[1]?.slice(0, 2) || 'NS'}
                     </span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-white font-black uppercase italic tracking-tighter text-xl leading-none">{reg.player}</span>
                      <div className="flex items-center gap-2">
                         <span className="text-emerald-400 font-black text-[9px] uppercase tracking-widest">{t('lobby.verified_member')}</span>
                         <div className="w-1 h-1 rounded-full bg-emerald-400/40" />
                      </div>
                    </div>
                 </div>
                 
                 <div className="text-right flex flex-col items-end gap-2">
                    <span className="text-white/70 text-[9px] font-black uppercase tracking-[0.4em]">{t(`lobby.${reg.time.toLowerCase().replace(' ', '_')}`)}</span>
                   <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-neon-purple animate-pulse" />
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
