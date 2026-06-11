import React from 'react';
import { RoulettePixiBridge } from '@/games/roulette/components/RoulettePixiBridge';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useRouletteStore } from '@/games/roulette/store';
import { useUserStore } from '@/store/useUserStore';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import { GameButton } from '@/components/ui/GameButton';
import { AnimatePresence, motion } from 'framer-motion';
import { useSettingsStore } from '@/store/useSettingsStore';
import { getRouletteColor, type RouletteBet } from '@/games/roulette/logic';
import { PageMeta } from '@/components/ui/PageMeta';

const BET_OPTIONS: { value: RouletteBet; label: string }[] = [
  { value: 'red', label: 'Red 2x' },
  { value: 'black', label: 'Black 2x' },
  { value: 'green', label: 'Zero 36x' },
  { value: 'even', label: 'Even 2x' },
  { value: 'odd', label: 'Odd 2x' },
];

export const RouletteView: React.FC = () => {
  const highQualityFx = useSettingsStore((state) => state.highQualityFx);
  const neonGlow = useSettingsStore((state) => state.neonGlow);
  const isSpinning = useRouletteStore((state) => state.isSpinning);
  const lastResult = useRouletteStore((state) => state.lastResult);
  const lastWin = useRouletteStore((state) => state.lastWin);
  const currentBet = useRouletteStore((state) => state.currentBet);
  const selectedBet = useRouletteStore((state) => state.selectedBet);
  const startSpin = useRouletteStore((state) => state.actions.startSpin);
  const setBet = useRouletteStore((state) => state.actions.setBet);
  const setSelectedBet = useRouletteStore((state) => state.actions.setSelectedBet);
  
  const balance = useUserStore((state) => state.balance);

  return (
    <div className="relative flex-1 flex w-full flex-col items-center justify-center p-4 sm:p-12">
      <PageMeta
        title="Neon Roulette | The Wheel of Fortune"
        description="Place your bets on the glowing wheel. A classic casino experience reimagined for the neon future. Spin and win."
        image="/assets/roulette_thumb.png"
      />
       {/* Background Graphic */}
       {highQualityFx && (
         <div className="pointer-events-none fixed inset-0 z-0 opacity-20 mix-blend-screen bg-[url('/assets/neon_roulette_background.png')] bg-cover bg-center bg-no-repeat"
         />
       )}
       
       <div className={`relative z-10 w-full max-w-5xl flex flex-col flex-1 max-h-[1000px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,16,24,0.95),rgba(5,6,10,0.98))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] gap-6 ${neonGlow ? 'shadow-[0_0_50px_rgba(0,255,255,0.1)]' : ''}`}>
        
        {/* Game Area */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden p-4 sm:p-8">
        
        <div className="w-full h-full flex items-center justify-center relative">
          <ErrorBoundary fallbackMessage="Roulette wheel engine fault.">
            <RoulettePixiBridge />
          </ErrorBoundary>
        </div>
        
          <AnimatePresence>
            {lastResult !== null && !isSpinning && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, x: 20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.8, opacity: 0, x: 20 }}
                className="absolute top-4 right-4 z-20 pointer-events-none"
              >
                  <div className={`bg-gray-900/60 backdrop-blur-3xl p-4 sm:p-6 rounded-2xl shadow-[0_0_40px_rgba(0,255,255,0.2)] flex flex-col items-center gap-2 sm:gap-3 min-w-[80px] sm:min-w-[120px] border ${getRouletteColor(lastResult) === 'red' ? 'border-red-500/60' : getRouletteColor(lastResult) === 'green' ? 'border-emerald-500/60' : 'border-white/30'}`}>
                  <Trophy className="text-neon-cyan w-6 h-6 sm:w-8 sm:h-8 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]" />
                  <div className="text-center">
                    <h3 className="text-3xl sm:text-5xl font-black italic text-white uppercase tracking-tighter leading-none mb-1">{lastResult}</h3>
                    <p className="text-neon-cyan/70 font-black tracking-widest uppercase text-[7px] sm:text-[9px]">Winning No.</p>
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
              onClick={startSpin}
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
                <span className="text-[9px] font-bold text-white/80 uppercase tracking-widest mb-1">Balance</span>
                <span className="font-mono text-lg font-bold text-white tracking-tight leading-none">${Math.floor(balance).toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-neon-cyan/60 uppercase tracking-widest mb-1">Last Win</span>
                <span className="font-mono text-lg font-bold text-neon-cyan leading-none">${lastWin.toLocaleString()}</span>
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

          <div className="grid grid-cols-5 gap-2 px-2 sm:px-6">
            {BET_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={isSpinning}
                onClick={() => setSelectedBet(option.value)}
                className={`rounded-xl border px-2 py-3 text-[9px] font-black uppercase tracking-wider transition-all ${selectedBet === option.value ? 'border-neon-cyan bg-neon-cyan text-black' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
