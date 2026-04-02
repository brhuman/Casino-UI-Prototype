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
    <div className="w-full bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl shadow-2xl">
      <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <h3 className="text-3xl sm:text-4xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
          <div className="w-2 h-8 bg-yellow-400 rounded-full shadow-[0_0_15px_#facc15]" /> {t('lobby.champions_league')}
        </h3>
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{t('lobby.updated_moments_ago')}</span>
      </div>

      <div className="p-4">
        <div className="flex flex-col gap-2">
          {leaderboardData.map((player, index) => {
            const isTop3 = index < 3;
            const RankIcon = index === 0 ? Trophy : index === 1 ? Medal : index === 2 ? Medal : null;
            const rankColor = index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-white/20';

            return (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                  player.isCurrentUser 
                    ? 'bg-neon-cyan/30 border border-neon-cyan/40 shadow-[0_0_20px_rgba(0,255,255,0.2)]' 
                    : 'bg-white/[0.08] border border-white/5 hover:bg-white/[0.15]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/5 font-black text-xs">
                    {isTop3 && RankIcon ? (
                      <RankIcon size={18} className={rankColor} />
                    ) : (
                      <span className={rankColor}>#{index + 1}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-black uppercase tracking-tight ${player.isCurrentUser ? 'text-neon-cyan' : 'text-white'}`}>
                      {player.name}
                    </span>
                    {player.isCurrentUser && (
                      <span className="text-[9px] font-black text-neon-cyan/50 uppercase tracking-widest">{t('lobby.you_are_here')}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className={`text-lg font-mono font-black ${isTop3 ? 'text-white' : 'text-white/60'}`}>
                      ${player.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    <span className="block text-[8px] font-black text-white/10 uppercase tracking-widest">{t('lobby.total_win')}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
