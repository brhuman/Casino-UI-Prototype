import { motion } from 'framer-motion';
import { User, Activity, Clock } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { Card } from '../components/ui/Card';

export const ProfileView = () => {
  const balance = useUserStore(state => state.balance);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-4xl mx-auto h-full flex flex-col gap-6"
    >
      <Card className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center shadow-[0_0_20px_#ff00ff80]">
           <User size={48} className="text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Player_9481</h2>
          <p className="text-neon-blue font-mono mt-1 flex items-center gap-2">
            <Activity size={14} /> VIP Level 1
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
             <span className="flex items-center gap-1"><Clock size={14}/> Joined: Oct 2026</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glass={false}>
           <h3 className="text-lg font-bold text-gray-300 mb-4">Statistics</h3>
           <div className="flex flex-col gap-4">
             <div className="flex justify-between border-b border-gray-800 pb-2">
               <span className="text-gray-500">Current Balance</span>
               <span className="text-white font-mono font-bold">${balance.toLocaleString()}</span>
             </div>
             <div className="flex justify-between border-b border-gray-800 pb-2">
               <span className="text-gray-500">Total Bets Made</span>
               <span className="text-white font-mono">0</span>
             </div>
             <div className="flex justify-between border-b border-gray-800 pb-2">
               <span className="text-gray-500">Biggest Win</span>
               <span className="text-neon-pink font-mono font-bold">$0.00</span>
             </div>
           </div>
        </Card>
      </div>
    </motion.div>
  );
};
