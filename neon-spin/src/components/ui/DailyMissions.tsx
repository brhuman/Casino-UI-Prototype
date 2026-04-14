import { Check, Gift, Target } from 'lucide-react';
import { useQuestsStore } from '@/store/useQuestsStore';
import { useUserStore } from '@/store/useUserStore';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const DailyMissions = () => {
  const quests = useQuestsStore(state => state.quests);
  const { claimReward, checkDailyReset } = useQuestsStore(state => state.actions);
  const { updateBalance } = useUserStore(state => state.actions);

  // Check for daily reset on mount
  useEffect(() => {
    checkDailyReset();
  }, [checkDailyReset]);

  const handleClaim = (questId: string) => {
    const reward = claimReward(questId);
    if (reward) {
      updateBalance(reward.cash);
      // XP is not tracked in updateBalance if it's positive without wins, but for now just adding cash is fine.
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {quests.map((quest) => (
        <div 
          key={quest.id} 
          className={`relative p-4 sm:p-5 rounded-2xl border transition-all ${
            quest.claimed 
              ? 'bg-white/5 border-white/5 opacity-60' 
              : quest.completed 
                ? 'bg-neon-cyan/10 border-neon-cyan/40 shadow-[0_0_20px_rgba(0,255,255,0.15)]' 
                : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className={`mt-1 p-2 rounded-xl flex-shrink-0 ${quest.completed && !quest.claimed ? 'bg-neon-cyan/20 text-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.3)] animate-pulse' : 'bg-white/10 text-white/50'}`}>
                {quest.claimed ? <Check size={20} /> : <Target size={20} />}
              </div>
              <div className="flex flex-col flex-1">
                <h4 className={`text-sm font-black uppercase tracking-widest ${quest.completed && !quest.claimed ? 'text-neon-cyan' : 'text-white/90'}`}>
                  {quest.title}
                </h4>
                <p className="text-[10px] text-white/60 mb-2">{quest.description}</p>
                
                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(quest.progress / quest.target) * 100}%` }}
                      className={`h-full rounded-full ${quest.completed ? 'bg-neon-cyan' : 'bg-white/40'}`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/50 w-12 text-right">
                    {quest.progress} / {quest.target}
                  </span>
                </div>
              </div>
            </div>

            {/* Action / Reward Area */}
            <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4 min-w-[120px]">
              <div className="flex flex-col items-center mb-0 sm:mb-2 text-[10px] font-black tracking-widest">
                <span className="text-yellow-400">+{quest.rewardCash} CR</span>
                <span className="text-neon-purple">+{quest.rewardXP} XP</span>
              </div>
              
              <AnimatePresence mode="popLayout">
                {quest.completed && !quest.claimed ? (
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClaim(quest.id)}
                    className="px-4 py-2 bg-neon-cyan text-black rounded-xl font-black uppercase text-[9px] shadow-[0_0_15px_rgba(0,255,255,0.4)] flex items-center gap-1 w-full justify-center"
                  >
                    <Gift size={12} strokeWidth={3} /> Claim
                  </motion.button>
                ) : quest.claimed ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-4 py-2 rounded-xl font-black uppercase text-[9px] text-white/30 flex items-center gap-1 w-full justify-center border border-white/10"
                  >
                    <Check size={12} /> Claimed
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
