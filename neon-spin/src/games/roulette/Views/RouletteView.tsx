import React from 'react';
import { RoulettePixiBridge } from '../components/RoulettePixiBridge';
import { useRouletteStore } from '../store';
import { useUserStore } from '../../../store/useUserStore';
import { Play, RotateCcw, Trophy, Layers } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { AnimatePresence, motion } from 'framer-motion';

export const RouletteView: React.FC = () => {
  const isSpinning = useRouletteStore((state: any) => state.isSpinning);
  const lastResult = useRouletteStore((state: any) => state.lastResult);
  const currentBet = useRouletteStore((state: any) => state.currentBet);
  const setSpinning = useRouletteStore((state: any) => state.actions.setSpinning);
  const setBet = useRouletteStore((state: any) => state.actions.setBet);
  
  const balance = useUserStore((state: any) => state.balance);
  const updateBalance = useUserStore((state: any) => state.actions.updateBalance);

  const handleSpin = () => {
    if (balance < currentBet) return;
    updateBalance(-currentBet);
    setSpinning(true);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-4 sm:p-8 overflow-y-auto custom-scrollbar">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.3)]">
            <Layers className="text-black" size={28} />
          </div>
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
              Neon Roulette
            </h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live Table • European Classic
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-black/60 border border-white/5 rounded-2xl p-3 px-5 flex flex-col items-end min-w-[140px]">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Balance</span>
            <span className="font-mono text-2xl font-bold text-white tracking-tight">${Math.floor(balance).toLocaleString()}</span>
          </div>
          <div className="bg-neon-cyan/10 border border-neon-cyan/20 rounded-2xl p-3 px-5 flex flex-col items-end min-w-[140px] shadow-[inset_0_0_20px_rgba(0,255,255,0.05)]">
            <span className="text-[10px] font-bold text-neon-cyan/60 uppercase tracking-widest mb-1">Win Tracker</span>
            <span className="font-mono text-2xl font-bold text-neon-cyan">{lastResult !== null ? lastResult : '--'}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[500px] flex items-center justify-center relative bg-gray-950/40 rounded-[3rem] border border-white/5 shadow-inner overflow-hidden p-4 sm:p-8">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        </div>
        
        <div className="w-full h-full flex items-center justify-center relative">
          <RoulettePixiBridge />
        </div>
        
        <AnimatePresence>
          {lastResult !== null && !isSpinning && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <div className="bg-gray-900/80 backdrop-blur-2xl border-2 border-neon-cyan/50 p-10 rounded-[3rem] shadow-[0_0_80px_rgba(0,255,255,0.3)] flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-neon-cyan/10 rounded-full flex items-center justify-center">
                    <Trophy className="text-neon-cyan w-12 h-12 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                </div>
                <div className="text-center">
                    <h3 className="text-6xl font-black italic text-white uppercase tracking-tighter mb-1">{lastResult}</h3>
                    <p className="text-neon-cyan font-black tracking-[0.4em] uppercase text-[10px]">Winning Number</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <Card className="lg:col-span-8 p-8 bg-gray-900/40 backdrop-blur-md border-white/5 shadow-2xl flex flex-col justify-center gap-6">
           <div>
              <div className="flex justify-between items-center mb-5">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Select Stake</span>
                <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest bg-neon-cyan/10 px-2 py-1 rounded">Min: $10</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[10, 100, 500, 1000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBet(amount)}
                    disabled={isSpinning}
                    className={`group relative py-4 px-6 rounded-2xl border font-mono font-black text-lg transition-all overflow-hidden ${
                      currentBet === amount 
                        ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">${amount.toLocaleString()}</span>
                    {currentBet === amount && (
                        <motion.div layoutId="activeBet" className="absolute inset-0 bg-white" />
                    )}
                  </button>
                ))}
              </div>
           </div>
        </Card>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <button
            onClick={handleSpin}
            disabled={isSpinning || balance < currentBet}
            className={`flex-1 min-h-[80px] rounded-[2rem] font-black uppercase tracking-[0.4em] text-xl transition-all flex items-center justify-center gap-4 relative overflow-hidden group shadow-2xl ${
              isSpinning 
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-br from-neon-cyan to-blue-600 text-black hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_0_40px_rgba(0,255,255,0.4)]'
            }`}
          >
            {isSpinning ? (
              <RotateCcw size={28} className="animate-spin" />
            ) : (
              <>
                <Play size={28} fill="currentColor" />
                <span>Place Bet</span>
              </>
            )}
            {!isSpinning && (
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-shimmer" />
            )}
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center items-center gap-1">
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Multiplier</p>
                <p className="text-white font-black italic">35:1 MAX</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center items-center gap-1">
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Wagers</p>
                <p className="text-neon-cyan font-black italic">VIRTUAL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
