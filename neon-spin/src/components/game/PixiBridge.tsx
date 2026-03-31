import { useEffect, useRef, useState } from 'react';
import { Application } from 'pixi.js';
import { initGameConfig } from '../../game/core/init';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { useUserStore } from '../../store/useUserStore';
import { Button } from '../ui/Button';

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
          width: 1920,
          height: 1080,
          preference: 'webgl',
          backgroundColor: 0x000000,
          autoDensity: true,
          resolution: window.devicePixelRatio || 1,
        });

        if (isInterrupted) return;


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

        }
      }
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden relative rounded-2xl border border-black shadow-[0_0_30px_rgba(255,0,255,0.05)]">
      <div className="absolute inset-x-4 bottom-4 z-40 pointer-events-none">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 rounded-2xl border border-white/10 bg-black/70 p-3 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.35)] pointer-events-auto">
          <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.24em] text-gray-400">
            <span>Slot Controls</span>
            <span className="text-neon-blue">Balance: ${balance.toLocaleString()}</span>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="min-w-14 px-4"
                disabled={isSpinning || currentBet <= 100}
                onClick={decreaseBet}
              >
                -
              </Button>

              <div className="min-w-36 rounded-xl border border-gray-700 bg-gray-900/80 px-4 py-3 text-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-500">Bet</div>
                <div className="font-mono text-xl font-semibold text-white">${currentBet}</div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="min-w-14 px-4"
                disabled={isSpinning || currentBet >= 5000}
                onClick={increaseBet}
              >
                +
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-cyan-900/70 bg-cyan-950/30 px-4 py-3 text-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-500">Last Win</div>
                <div className="font-mono text-lg font-semibold text-cyan-300">${lastWinAmount.toFixed(2)}</div>
              </div>

              <Button
                type="button"
                variant="secondary"
                className="min-w-40"
                disabled={!isLoaded || isSpinning || balance < currentBet}
                onClick={placeBet}
              >
                {isSpinning ? 'Spinning...' : 'Spin'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!isLoaded && !error && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-md"
          >
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4 border border-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-neon-blue to-neon-pink transition-all duration-200"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="text-neon-pink font-mono animate-pulse">Loading Assets... {Math.round(progress * 100)}%</p>
          </motion.div>
        )}

        {error && (
          <motion.div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black">
             <p className="text-red-500 mb-4">{error}</p>
             <button onClick={() => window.location.reload()} className="px-6 py-2 bg-gray-800 text-white rounded cursor-pointer hover:bg-gray-700">
               Retry
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas 
        ref={canvasRef} 
        className={`max-w-full max-h-full object-contain bg-black transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
      />
    </div>
  );
};
