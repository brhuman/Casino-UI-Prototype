import { useEffect, useRef, useState } from 'react';
import { Application } from 'pixi.js';
import { initGameConfig, SLOT_STAGE_HEIGHT, SLOT_STAGE_WIDTH } from '../../game/core/init';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { useUserStore } from '../../store/useUserStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Button } from '../ui/Button';
import { GameButton } from '../ui/GameButton';
import { soundManager } from '../../game/audio/SoundManager';
import { Play, RotateCcw } from 'lucide-react';

export const PixiBridge = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const balance = useUserStore((state) => state.balance);
  const currentBet = useGameStore((state) => state.currentBet);
  const isSpinning = useGameStore((state) => state.isSpinning);
  const lastWinAmount = useGameStore((state) => state.lastWinAmount);
  const placeBet = useGameStore((state) => state.actions.placeBet);
  const increaseBet = useGameStore((state) => state.actions.increaseBet);
  const decreaseBet = useGameStore((state) => state.actions.decreaseBet);
  const { highQualityFx, neonGlow } = useSettingsStore();
  const canSpin = isLoaded && !isSpinning && balance >= currentBet;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isCurrent = true;
    let localApp: Application | null = null;
    let unsubscribe: (() => void) | null = null;

    const setup = async () => {
      try {
        if (!canvas.isConnected) return;

        localApp = new Application();
        if (!isCurrent) {
          localApp.destroy(true);
          return;
        }
        appRef.current = localApp;

        await localApp.init({
          canvas,
          width: SLOT_STAGE_WIDTH,
          height: SLOT_STAGE_HEIGHT,
          preference: 'webgl',
          backgroundColor: 0x02040a,
          backgroundAlpha: 1,
          autoDensity: true,
          resolution: 1,
        });

        if (!isCurrent) return;

        soundManager.init();
        unsubscribe = await initGameConfig(localApp, (p: number) => {
          if (isCurrent) setProgress(p);
        });

        if (!isCurrent) return;
        
        // Small delay to ensure PIXI has rendered at least once before showing
        setTimeout(() => {
          if (isCurrent) setIsLoaded(true);
        }, 150);
      } catch (err: unknown) {
        if (isCurrent) {
          setError((err as Error).message || 'Failed to load game assets.');
          console.error('[PixiBridge] init error:', err);
        }
      }
    };

    setup();

    return () => {
      isCurrent = false;
      setIsLoaded(false);
      setProgress(0);
      if (unsubscribe) unsubscribe();
      
      if (appRef.current) {
        const app = appRef.current;
        appRef.current = null;
        try {
          app.destroy(true, { children: true, texture: true });
        } catch (e) {
          console.warn('[PixiBridge] Destroy error:', e);
        }
      }
    };
  }, [canvasRef]);

  return (
    <>
      {/* Game Canvas Container */}
      <div 
        className={`relative z-10 flex w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-cyan-500/30 bg-[#02040a] ${neonGlow ? 'shadow-[inset_0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(34,211,238,0.15)]' : 'shadow-none'}`}
        style={{ 
          aspectRatio: `${SLOT_STAGE_WIDTH} / ${SLOT_STAGE_HEIGHT}`,
          width: '100%',
          maxHeight: 'min(50vh, 428px)'
        }}
      >
        <canvas
          ref={canvasRef}
          className={`relative z-10 block transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            width: '100%', 
            height: 'auto', 
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />

        <AnimatePresence>
          {lastWinAmount > 0 && !isSpinning && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            >
              <div className={`text-4xl sm:text-6xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 ${neonGlow ? 'drop-shadow-[0_0_25px_rgba(245,158,11,0.8)]' : ''} [text-shadow:0_4px_10px_rgba(0,0,0,0.5)]`}>
                WINNER!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(!isLoaded || error) && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#02040a] backdrop-blur-sm transition-all duration-500 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              {!error ? (
                <>
                  <div className="mb-4 h-2 w-64 overflow-hidden rounded-full border border-gray-700 bg-gray-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-200"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <p className="animate-pulse font-mono flex items-center gap-2 text-cyan-400">LOADING <span className="text-white">{Math.round(progress * 100)}%</span></p>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="mb-6 text-red-500 font-bold uppercase tracking-widest">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white">Retry Connection</Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Container */}
      <div className="relative z-20 flex flex-col shrink-0 w-full rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,30,0.95),rgba(10,10,15,1))] p-3 sm:p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] gap-2 sm:gap-4">
        
        {/* Top Row: Spin Action */}
        <div className="flex justify-center">
          <GameButton
            onClick={placeBet}
            disabled={!canSpin}
            isLoading={isSpinning}
            loadingIcon={RotateCcw}
            icon={Play}
            label={isSpinning ? 'SPINNING...' : 'SPIN'}
            className="w-full max-w-md"
          />
        </div>

        {/* Bottom Row: Stats & Bet */}
        <div className="flex items-center justify-between px-4">
          {/* Left: Balance & Win */}
          <div className="flex gap-6 sm:gap-10">
            <div className="flex flex-col justify-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300/60 leading-none mb-1">Balance</span>
              <span className="font-mono text-lg font-semibold text-white leading-none">${balance.toLocaleString()}</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-200/60 leading-none mb-1">Win</span>
              <span className="font-mono text-lg font-semibold text-amber-50 leading-none">${lastWinAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Right: Bet Adjust */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-white/40">Total Bet:</span>
            <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
              <Button
                type="button"
                variant="outline"
                className="h-8 w-8 rounded-md border-white/10 bg-white/5 p-0 text-lg text-white/70 hover:text-white hover:bg-white/10"
                disabled={isSpinning || currentBet <= 100}
                onClick={decreaseBet}
              >
                -
              </Button>
              <div className="min-w-[70px] text-center">
                <span className="font-mono text-lg font-bold text-white">${currentBet}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-8 w-8 rounded-md border-white/10 bg-white/5 p-0 text-lg text-white/70 hover:text-white hover:bg-white/10"
                disabled={isSpinning || currentBet >= 5000}
                onClick={increaseBet}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
