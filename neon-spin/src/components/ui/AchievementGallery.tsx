import { motion } from 'framer-motion';
import { ACHIEVEMENTS } from '@/constants/achievements';
import { useUserStore } from '@/store/useUserStore';
import { Lock } from 'lucide-react';

export const AchievementGallery = () => {
  const unlockedIds = useUserStore((state) => state.achievements);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {ACHIEVEMENTS.map((achievement, index) => {
        const isUnlocked = unlockedIds.includes(achievement.id);
        const Icon = achievement.icon;

        return (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-6 rounded-[2.5rem] border transition-all group ${
              isUnlocked 
                ? 'bg-white/10 border-white/20 hover:bg-white/[0.18] hover:border-white/30 shadow-2xl' 
                : 'bg-black/40 border-white/10 grayscale opacity-60'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
              isUnlocked ? 'bg-white/10' : 'bg-white/5'
            }`}>
              {isUnlocked ? (
                <Icon size={24} className={achievement.color} />
              ) : (
                <Lock size={20} className="text-white/20" />
              )}
            </div>
            
            <h4 className={`text-sm font-black uppercase italic tracking-tight mb-1 ${
              isUnlocked ? 'text-white' : 'text-white/40'
            }`}>
              {achievement.title}
            </h4>
            <p className="text-[10px] text-white/20 uppercase font-black tracking-widest leading-tight">
              {achievement.description}
            </p>

            {isUnlocked && (
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_#00ffff]" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
