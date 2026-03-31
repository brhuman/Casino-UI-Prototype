import { useEffect, useRef, useState } from 'react';
import { Application } from 'pixi.js';
import { initGameConfig } from '../../game/core/init';
import { useGameStore } from '../../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';

export const PixiBridge = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let isInterrupted = false;
    let localApp: Application | null = null;
    let unsubscribe: (() => void) | null = null;

    const setup = async () => {
      try {
        // Guard: ensure canvas is still attached to the DOM before Pixi init.
        // React StrictMode double-invokes effects; a stale canvas causes
        // Pixi v8's ResizePlugin to crash with "_cancelResize is not a function".
        if (!canvas.isConnected) return;

        localApp = new Application();
        appRef.current = localApp;

        await localApp.init({
          canvas,
          width: 1920,
          height: 1080,
          preference: 'webgl',
          backgroundColor: 0x0a0a0c,
          autoDensity: true,
          resolution: window.devicePixelRatio || 1,
        });

        if (isInterrupted) return; // cleanup already ran; localApp was destroyed by cleanup

        // Initialize Game Engine and pass store & progress callback
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
          // Pixi v8 may throw during destroy if canvas was already detached — ignore.
        }
      }
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden relative rounded-2xl border border-gray-800 shadow-[0_0_30px_rgba(255,0,255,0.05)]">
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
        className={`max-w-full max-h-full object-contain transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
      />

      {/* React UI Game Controls Overlay */}
      {isLoaded && (
        <div className="absolute bottom-4 sm:bottom-8 inset-x-0 w-full flex justify-center z-10">
          <GameControls />
        </div>
      )}
    </div>
  );
};

const GameControls = () => {
  const { isSpinning, currentBet, balance } = useGameStore(state => state);
  const placeBet = useGameStore(state => state.actions.placeBet);
  const { increaseBet, decreaseBet } = useGameStore(state => state.actions);

  return (
    <div className="flex items-center gap-6 px-8 py-4 bg-gray-950/80 backdrop-blur-lg rounded-full border border-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
      <div className="flex flex-col items-center border-r border-gray-800 pr-6">
        <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">Bet</span>
        <div className="flex items-center gap-3">
          <button 
            onClick={decreaseBet} 
            disabled={isSpinning}
            className="w-6 h-6 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-30"
          >
            -
          </button>
          <span className="text-white font-mono font-bold min-w-[3ch] text-center">${currentBet}</span>
          <button 
            onClick={increaseBet} 
            disabled={isSpinning}
            className="w-6 h-6 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>
      
      <button 
        onClick={placeBet}
        disabled={isSpinning || balance < currentBet}
        className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 transition-transform ${
          isSpinning || balance < currentBet 
            ? 'opacity-50 cursor-not-allowed grayscale' 
            : 'hover:scale-105 active:scale-95 bg-gradient-to-br from-neon-pink to-neon-purple shadow-[0_0_20px_#ff00ff80] cursor-pointer'
        }`}
      >
        <span className="font-bold tracking-widest uppercase text-white drop-shadow-md">
           {isSpinning ? '...' : 'Spin'}
        </span>
      </button>

      <div className="flex flex-col items-center border-l border-gray-800 pl-6">
        <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">Win</span>
        <span className="text-neon-blue font-mono font-bold">${useGameStore.getState().lastWinAmount}</span>
      </div>
    </div>
  );
};
