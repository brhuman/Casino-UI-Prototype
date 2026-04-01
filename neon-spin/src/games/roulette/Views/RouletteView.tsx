import React from 'react';
import { RoulettePixiBridge } from '../components/RoulettePixiBridge';
import { useRouletteStore } from '../store';
import { useUserStore } from '../../../store/useUserStore';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import { GameButton } from '../../../components/ui/GameButton';
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
    <div className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-12">
      {/* Background Graphic */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40 bg-[url('/assets/neon_roulette_background.png')] bg-cover bg-center bg-no-repeat" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col flex-1 max-h-[1000px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,16,24,0.95),rgba(5,6,10,0.98))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] gap-6">
        
        {/* Game Area */}
        <div className="flex-1 flex items-center justify-center relative bg-black/60 rounded-[1.5rem] border border-white/5 shadow-inner overflow-hidden p-4 sm:p-8">
        
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
                <div className="bg-gray-900/90 backdrop-blur-2xl border-2 border-neon-cyan/50 p-12 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,255,255,0.3)] flex flex-col items-center gap-6">
                  <div className="w-24 h-24 bg-neon-cyan/10 rounded-full flex items-center justify-center border border-neon-cyan/20">
                      <Trophy className="text-neon-cyan w-12 h-12 drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]" />
                  </div>
                  <div className="text-center">
                      <h3 className="text-7xl font-black italic text-white uppercase tracking-tighter mb-1">{lastResult}</h3>
                      <p className="text-neon-cyan font-black tracking-[0.4em] uppercase text-[10px]">Winning Number</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Control Panel */}
        <div className="relative z-20 flex flex-col shrink-0 w-full rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,30,0.95),rgba(10,10,15,1))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] gap-4">
          
          {/* Top Row: Main Action */}
          <div className="flex justify-center">
            <GameButton
              onClick={handleSpin}
              disabled={isSpinning || balance < currentBet}
              isLoading={isSpinning}
              loadingIcon={RotateCcw}
              icon={Play}
              label="Spin"
              className="w-full max-w-md"
            />
          </div>

          {/* Bottom Row: Info & Stakes */}
          <div className="flex items-center justify-between px-6">
            {/* Left: Info */}
            <div className="flex gap-8">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Balance</span>
                <span className="font-mono text-lg font-bold text-white tracking-tight leading-none">${Math.floor(balance).toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-neon-cyan/60 uppercase tracking-widest mb-1">Last Win</span>
                <span className="font-mono text-lg font-bold text-neon-cyan leading-none">{lastResult !== null ? lastResult : '--'}</span>
              </div>
            </div>

            {/* Right: Stakes */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-[9px] font-bold uppercase tracking-widest text-white/40 mr-2">Stake:</span>
              <div className="flex gap-1.5">
                {[10, 100, 500, 1000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBet(amount)}
                    disabled={isSpinning}
                    className={`h-9 px-4 rounded-lg border font-mono font-bold text-[11px] transition-all ${
                      currentBet === amount 
                        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                        : 'bg-black/40 border-white/5 text-white/40 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    ${amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
