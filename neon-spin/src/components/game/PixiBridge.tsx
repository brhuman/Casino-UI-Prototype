import { useEffect, useRef, useState } from 'react';
import { Application } from 'pixi.js';
import { initGameConfig, SLOT_STAGE_HEIGHT, SLOT_STAGE_WIDTH } from '../../game/core/init';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { useUserStore } from '../../store/useUserStore';
import { Button } from '../ui/Button';
import { soundManager } from '../../game/audio/SoundManager';

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
  const canSpin = isLoaded && !isSpinning && balance >= currentBet;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isInterrupted = false;
    let localApp: Application | null = null;
    let unsubscribe: (() => void) | null = null;

    const setup = async () => {
      try {
        if (!canvas.isConnected) return;

        localApp = new Application();
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

        if (isInterrupted) return;

        soundManager.init();
        unsubscribe = await initGameConfig(localApp, (p: number) => setProgress(p));

        if (isInterrupted) return;
        setIsLoaded(true);
      } catch (err: unknown) {
        if (!isInterrupted) setError((err as Error).message || 'Failed to load game assets.');
        console.error('[PixiBridge] init error:', err);
      }
    };

    setup();

    return () => {
      isInterrupted = true;
      const app = appRef.current;
      appRef.current = null;

      if (app) {
        try {
          app.destroy(true, { children: true, texture: true });
        } catch (_) {
          // no-op during teardown
        }
      }

      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <>
      {/* Game Canvas Container */}
      <div className="relative z-10 flex h-[428px] w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-cyan-500/30 bg-[#02040a] shadow-[inset_0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(34,211,238,0.15)]">
        <canvas
          ref={canvasRef}
          className={`relative z-10 block h-full w-auto max-w-full rounded-[1.5rem] transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ aspectRatio: `${SLOT_STAGE_WIDTH} / ${SLOT_STAGE_HEIGHT}` }}
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
              <div className="text-4xl sm:text-6xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 drop-shadow-[0_0_25px_rgba(245,158,11,0.8)] [text-shadow:0_4px_10px_rgba(0,0,0,0.5)]">
                WINNER!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isLoaded && !error && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#02040a]/90 backdrop-blur-sm"
            >
              <div className="mb-4 h-2 w-64 overflow-hidden rounded-full border border-gray-700 bg-gray-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-200"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="animate-pulse font-mono flex items-center gap-2 text-cyan-400">LOADING <span className="text-white">{Math.round(progress * 100)}%</span></p>
            </motion.div>
          )}

          {error && (
            <motion.div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#02040a]">
              <p className="mb-4 text-red-500">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Container */}
      <div className="relative z-20 flex h-[100px] shrink-0 w-full items-center justify-between rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,30,0.95),rgba(10,10,15,1))] px-8 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)]">
        
        {/* Left: Balance & Win */}
        <div className="flex gap-8">
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.36em] text-emerald-300/60">Balance</span>
            <span className="mt-1 font-mono text-xl font-semibold text-white">${balance.toLocaleString()}</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.36em] text-amber-200/60">Win</span>
            <span className="mt-1 font-mono text-xl font-semibold text-amber-50">${lastWinAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Right: Bet & Spin */}
        <div className="flex items-center gap-8">
          {/* Bet Adjust */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="min-h-12 min-w-12 rounded-xl border-white/10 bg-[linear-gradient(180deg,rgba(36,37,46,0.96),rgba(10,11,18,0.98))] px-0 text-xl text-cyan-50 shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:border-cyan-300/40 hover:bg-cyan-400/10"
              disabled={isSpinning || currentBet <= 100}
              onClick={decreaseBet}
            >
              -
            </Button>
            <div className="min-w-[90px] text-center">
              <span className="font-mono text-2xl font-bold tracking-[0.08em] text-white">${currentBet}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="min-h-12 min-w-12 rounded-xl border-white/10 bg-[linear-gradient(180deg,rgba(36,37,46,0.96),rgba(10,11,18,0.98))] px-0 text-xl text-cyan-50 shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:border-cyan-300/40 hover:bg-cyan-400/10"
              disabled={isSpinning || currentBet >= 5000}
              onClick={increaseBet}
            >
              +
            </Button>
          </div>

          {/* Spin Action */}
          <Button
            type="button"
            variant="secondary"
            className="min-h-[64px] min-w-[160px] rounded-xl border border-cyan-300/30 bg-[linear-gradient(180deg,rgba(130,255,255,0.96),rgba(39,211,255,0.88)_56%,rgba(15,160,202,0.92))] px-8 text-lg font-black tracking-[0.2em] text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_20px_rgba(0,0,0,0.3),0_0_30px_rgba(34,211,238,0.2)] hover:scale-[1.02] disabled:shadow-none"
            disabled={!canSpin}
            onClick={placeBet}
          >
            {isSpinning ? 'SPINNING' : 'SPIN'}
          </Button>
        </div>
      </div>
    </>
  );
};
