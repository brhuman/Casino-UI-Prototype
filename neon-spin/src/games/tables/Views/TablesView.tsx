import React from 'react';
import { TablesPixiBridge } from '../components/TablesPixiBridge';
import { useTablesStore } from '../store';
import { useUserStore } from '../../../store/useUserStore';
import { Coins, Play, RotateCcw, Trophy } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { AnimatePresence, motion } from 'framer-motion';

export const TablesView: React.FC = () => {
  const isSpinning = useTablesStore(state => state.isSpinning);
  const lastResult = useTablesStore(state => state.lastResult);
  const currentBet = useTablesStore(state => state.currentBet);
  const setSpinning = useTablesStore(state => state.actions.setSpinning);
  const setBet = useTablesStore(state => state.actions.setBet);
  
  const balance = useUserStore(state => state.balance);
  const updateBalance = useUserStore(state => state.actions.updateBalance);

  const handleSpin = () => {
    if (balance < currentBet) return;
    updateBalance(-currentBet);
    setSpinning(true);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-4 sm:p-8 max-w-6xl mx-auto overflow-y-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase flex items-center gap-4">
            <span className="w-2 h-10 bg-neon-cyan shadow-[0_0_15px_#00ffff]" />
            Neon Roulette
          </h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">European Classic • 37 Slots</p>
        </div>

        <div className="flex bg-black/40 border border-white/5 rounded-2xl p-4 gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Balance</span>
            <span className="font-mono text-xl font-bold text-white">${balance.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last Result</span>
            <span className="font-mono text-xl font-bold text-neon-cyan">{lastResult !== null ? lastResult : '--'}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[400px] flex items-center justify-center p-4 relative">
        <TablesPixiBridge />
        
        <AnimatePresence>
          {lastResult !== null && !isSpinning && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <div className="bg-black/80 backdrop-blur-xl border-2 border-neon-cyan p-8 rounded-[2rem] shadow-[0_0_50px_rgba(0,255,255,0.4)] flex flex-col items-center gap-4">
                <Trophy className="text-neon-cyan w-16 h-16 animate-bounce" />
                <h3 className="text-4xl font-black italic text-white uppercase tracking-tighter">Result: {lastResult}</h3>
                <p className="text-neon-cyan font-bold tracking-[0.2em] uppercase text-xs">Winning Number</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Card className="p-6 bg-gray-900/60 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Bet Selector */}
          <div className="w-full lg:w-auto">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Choose Your Stake</span>
            <div className="grid grid-cols-4 gap-2">
              {[10, 100, 500, 1000].map(amount => (
                <button
                  key={amount}
                  onClick={() => setBet(amount)}
                  disabled={isSpinning}
                  className={`py-3 px-4 rounded-xl border font-mono font-bold transition-all ${
                    currentBet === amount 
                      ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.4)]' 
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:block w-px h-16 bg-white/5" />

          {/* Action Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || balance < currentBet}
            className={`flex-1 h-16 rounded-2xl font-black uppercase tracking-[0.3em] text-xl transition-all flex items-center justify-center gap-4 relative overflow-hidden group ${
              isSpinning 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-neon-cyan to-blue-600 text-black shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isSpinning ? (
              <>
                <RotateCcw size={24} className="animate-spin" />
                Spinning...
              </>
            ) : (
              <>
                <Play size={24} fill="currentColor" />
                Place Bet & Spin
              </>
            )}
            {!isSpinning && (
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-shimmer" />
            )}
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan">
            <Coins size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Multiplier</p>
            <p className="text-white font-bold">35:1 for Straight Up</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Coins size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Wagers</p>
            <p className="text-white font-bold">Virtual Credits Only</p>
          </div>
        </div>
      </div>
    </div>
  );
};
