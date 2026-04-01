import { motion } from 'framer-motion';
import { User, Activity, Clock, Plus, TrendingUp, History, Award } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { Card } from '../components/ui/Card';

export const ProfileView = () => {
  const { balance, totalBets, totalWinAmount, biggestWin } = useUserStore(state => ({
    balance: state.balance,
    totalBets: state.totalBets,
    totalWinAmount: state.totalWinAmount,
    biggestWin: state.biggestWin
  }));

  const updateBalance = useUserStore(state => state.actions.updateBalance);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-4xl mx-auto h-full flex flex-col gap-8 pb-12"
    >
      <Card className="flex items-center gap-8 p-8 bg-gradient-to-r from-gray-900/80 to-gray-800/40 border-neon-purple/30">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-pink to-neon-purple rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <div className="relative w-28 h-28 rounded-full bg-black flex items-center justify-center border-2 border-neon-purple">
             <User size={56} className="text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-neon-blue border-4 border-black flex items-center justify-center text-black font-bold">
            1
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="text-4xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 uppercase">
            Player_9481
          </h2>
          <div className="flex items-center gap-6 mt-3">
            <p className="text-neon-blue font-mono flex items-center gap-2 text-sm bg-neon-blue/10 px-3 py-1 rounded-full border border-neon-blue/30">
              <Activity size={14} /> VIP LEVEL 1
            </p>
            <span className="flex items-center gap-2 text-xs text-gray-500 font-mono">
              <Clock size={14}/> JOINED: OCT 2026
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Balance</p>
          <p className="text-4xl font-black text-white font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            ${balance.toLocaleString()}
          </p>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        <button 
          onClick={() => updateBalance(1000)}
          className="group relative w-full py-6 rounded-2xl overflow-hidden active:scale-[0.98] transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-teal-400 to-neon-blue bg-[length:200%_100%] animate-gradient-x opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.4)]" />
          <div className="relative flex items-center justify-center gap-4 text-black font-black text-2xl uppercase tracking-[0.2em]">
            <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
            Add $1.000 Credits
          </div>
        </button>

        <Card glass={false} className="p-8 border-gray-800 bg-black/40">
           <div className="flex items-center gap-3 mb-8">
             <TrendingUp className="text-neon-pink" />
             <h3 className="text-xl font-black text-white uppercase tracking-widest">Performance Statistics</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 flex flex-col gap-2 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <History size={64} />
               </div>
               <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Bets Made</span>
               <span className="text-3xl font-black text-white font-mono">${totalBets.toLocaleString()}</span>
               <div className="h-1 w-full bg-gray-800 rounded-full mt-2 overflow-hidden">
                 <div className="h-full bg-neon-blue w-1/3 shadow-[0_0_10px_#00ffff]" />
               </div>
             </div>

             <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 flex flex-col gap-2 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Award size={64} />
               </div>
               <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Biggest Win</span>
               <span className="text-3xl font-black text-neon-pink font-mono">${biggestWin.toLocaleString()}</span>
               <div className="h-1 w-full bg-gray-800 rounded-full mt-2 overflow-hidden">
                 <div className="h-full bg-neon-pink w-1/2 shadow-[0_0_10px_#ff00ff]" />
               </div>
             </div>

             <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800 flex flex-col gap-2 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <TrendingUp size={64} />
               </div>
               <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Returned</span>
               <span className="text-3xl font-black text-neon-purple font-mono">${totalWinAmount.toLocaleString()}</span>
               <div className="h-1 w-full bg-gray-800 rounded-full mt-2 overflow-hidden">
                 <div className="h-full bg-neon-purple w-2/3 shadow-[0_0_10px_#bf00ff]" />
               </div>
             </div>
           </div>
        </Card>
      </div>
    </motion.div>
  );
};
