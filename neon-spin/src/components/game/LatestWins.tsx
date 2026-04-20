import { useLiveWinsStore } from '@/store/useLiveWinsStore';
import { useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { DUMMY_NICKNAMES, PRESET_AVATARS } from '@/constants/dummyData';
import { useTranslation } from 'react-i18next';

// Constants for layout
const VISIBLE_COUNT = 6;

interface WinItem {
  id: number;
  player: string;
  game: string;
  amount: string;
  multiplier?: string;
  avatar?: string;
  isPremium?: boolean;
  time: string;
}

interface RegItem {
  id: number;
  player: string;
  time: string;
}

const StaticFeed = <T extends { id: number }>({ 
  items, 
  renderItem 
}: { 
  items: T[], 
  renderItem: (item: T) => React.ReactNode 
}) => {
  return (
    <div className="relative h-[610px] overflow-hidden bg-black/20 rounded-[3rem] border border-white/5 p-4">
      <div className="flex flex-col gap-[12px]">
        {items.slice(0, VISIBLE_COUNT).map((item) => (
          <div key={item.id} className="h-[88px] shrink-0">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export const LatestWins = () => {
  const wins = useLiveWinsStore((state) => state.wins);
  const registrations = useLiveWinsStore((state) => state.registrations);
  const addWin = useLiveWinsStore((state) => state.actions.addWin);
  const addRegistration = useLiveWinsStore((state) => state.actions.addRegistration);
  const { t } = useTranslation();

  // Spawners keep the store fresh
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
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
      timeoutId = setTimeout(spawnWin, Math.random() * 6000 + 4000);
    };
    timeoutId = setTimeout(spawnWin, 5000);
    return () => clearTimeout(timeoutId);
  }, [addWin]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const spawnReg = () => {
      const randomNick = DUMMY_NICKNAMES[Math.floor(Math.random() * DUMMY_NICKNAMES.length)];
      const newReg = {
        id: Date.now() + 1,
        player: randomNick,
        time: 'JUST NOW'
      };
      addRegistration(newReg);
      timeoutId = setTimeout(spawnReg, (Math.random() * 15000 + 8000) * 3);
    };
    timeoutId = setTimeout(spawnReg, 15000);
    return () => clearTimeout(timeoutId);
  }, [addRegistration]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 pt-4 pb-12">
      <section className="flex flex-col gap-6 relative">
        <div className="flex items-center justify-between px-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
             <div className="w-2 h-8 bg-neon-purple rounded-full shadow-[0_0_15px_#9333ea]" /> {t('lobby.win_stream')}
          </h2>
          <div className="flex items-center gap-2 bg-neon-cyan/5 px-4 py-2 rounded-full border border-neon-cyan/20 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_10px_#00ffff]" />
            <span className="text-[10px] font-black text-neon-cyan uppercase tracking-[0.2em]">{t('lobby.live')}</span>
          </div>
        </div>

        <StaticFeed 
          items={wins}
          renderItem={(win: WinItem) => (
            <div className={`flex items-center justify-between h-full px-5 rounded-[2rem] border transition-all ${win.isPremium ? 'bg-yellow-400/10 border-yellow-500/40 shadow-[0_0_20px_rgba(250,204,21,0.1)]' : 'bg-white/5 border-white/10 shadow-2xl'}`}>
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center border transition-all overflow-hidden ${win.isPremium ? 'border-yellow-400/40 bg-yellow-400/10' : 'bg-black/40 border-white/10'}`}>
                  {win.avatar ? <img src={win.avatar} className="w-full h-full object-cover" /> : <TrendingUp size={18} className="text-white/40" />}
                </div>
                <div className="flex flex-col min-w-0 overflow-hidden">
                  <span className={`font-black uppercase italic tracking-tighter text-base leading-none truncate ${win.isPremium ? 'text-yellow-400' : 'text-white'}`}>{win.game}</span>
                  <span className="text-white/40 text-[9px] font-black uppercase tracking-widest truncate mt-1">{win.player}</span>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <span className={`${win.isPremium ? 'text-yellow-400 shadow-yellow-400/20' : 'text-neon-cyan'} font-mono font-black block text-xl tracking-tighter`}>+${win.amount}</span>
                <span className="text-white/20 text-[8px] font-black uppercase block tracking-widest mt-0.5">{t('lobby.just_now')}</span>
              </div>
            </div>
          )}
        />
      </section>

      <section className="flex flex-col gap-6 relative">
        <div className="flex items-center justify-between px-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
             <div className="w-2 h-8 bg-neon-cyan rounded-full shadow-[0_0_15px_#00ffff]" /> {t('lobby.new_arrivals')}
          </h2>
          <div className="flex gap-2 p-2 bg-white/5 rounded-xl border border-white/5">
             {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />)}
          </div>
        </div>

        <StaticFeed 
          items={registrations}
          renderItem={(reg: RegItem) => (
            <div className="flex items-center justify-between h-full px-5 rounded-[2rem] bg-white/5 border border-white/10 shadow-2xl transition-all">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-tr from-neon-purple/20 via-black to-neon-purple/5 flex items-center justify-center border border-white/10 shadow-2xl">
                  <span className="text-[10px] font-black text-neon-purple tracking-tighter italic uppercase">{reg.player.slice(0, 2)}</span>
                </div>
                <div className="flex flex-col min-w-0 overflow-hidden">
                  <span className="text-white font-black uppercase italic tracking-tighter text-lg leading-none truncate">{reg.player}</span>
                  <span className="text-emerald-400/60 font-black text-[8px] uppercase tracking-widest truncate mt-1">{t('lobby.verified_member')}</span>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap">{t('lobby.just_now')}</span>
                <div className="h-0.5 w-12 bg-neon-purple/30 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full w-full bg-neon-purple animate-pulse" />
                </div>
              </div>
            </div>
          )}
        />
      </section>
    </div>
  );
};
