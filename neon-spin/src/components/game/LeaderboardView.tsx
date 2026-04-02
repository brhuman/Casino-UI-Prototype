import { motion } from 'framer-motion';
import { useUserStore } from '../../store/useUserStore';
import { DUMMY_NICKNAMES } from '../../constants/dummyData';
import { Trophy, Medal } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const LeaderboardView = () => {
  const { t } = useTranslation();
  const username = useUserStore((state) => state.username);
  const totalWinAmount = useUserStore((state) => state.totalWinAmount);

  // Generate a stable-ish leaderboard with dummy data
  const leaderboardData = useMemo(() => {
    const dummyPlayers = DUMMY_NICKNAMES.slice(0, 10).map((name, i) => ({
      name,
      amount: Math.floor(50000 / (i + 1)) + Math.random() * 500,
      isCurrentUser: false
    }));

    const allPlayers = [...dummyPlayers, { name: username, amount: totalWinAmount, isCurrentUser: true }];
    return allPlayers.sort((a, b) => b.amount - a.amount);
  }, [username, totalWinAmount]);

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
          <div className="w-2 h-8 bg-yellow-400 rounded-full shadow-[0_0_15px_#facc15]" /> 
          {t('lobby.champions_league')}
        </h2>
        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">{t('lobby.updated_moments_ago')}</span>
      </div>

      <div className="h-[600px] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
          {leaderboardData.map((player, index) => {
            const isTop3 = index < 3;
            const RankIcon = index === 0 ? Trophy : index === 1 ? Medal : index === 2 ? Medal : null;
            const rankColor = index === 0 ? 'text-yellow-400' : index === 1 ? 'text-white' : index === 2 ? 'text-orange-400' : 'text-white/60';

            return (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-[2.5rem] transition-all group/item shadow-xl backdrop-blur-2xl border ${
                  player.isCurrentUser 
                    ? 'bg-neon-cyan/20 border-neon-cyan/40 shadow-[0_0_25px_rgba(0,255,255,0.1)]' 
                    : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border font-black text-xs transition-all ${
                    player.isCurrentUser ? 'bg-black/40 border-neon-cyan/20' : 'bg-black/40 border-white/5 group-hover/item:border-white/20'
                  }`}>
                    {isTop3 && RankIcon ? (
                      <RankIcon size={20} className={rankColor} />
                    ) : (
                      <span className={rankColor}>#{index + 1}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-md font-black uppercase italic tracking-tighter ${player.isCurrentUser ? 'text-neon-cyan' : 'text-white'}`}>
                      {player.name}
                    </span>
                    {player.isCurrentUser && (
                      <span className="text-[9px] font-black text-neon-cyan/85 uppercase tracking-[0.2em] leading-none mt-1">{t('lobby.you_are_here')}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <span className={`text-xl font-mono font-black tabular-nums ${isTop3 ? 'text-white font-black' : 'text-white/90'}`}>
                      ${player.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    <span className="block text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mt-0.5">{t('lobby.total_win')}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};
