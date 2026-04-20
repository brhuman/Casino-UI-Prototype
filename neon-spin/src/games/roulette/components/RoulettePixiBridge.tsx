import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Application, Container } from 'pixi.js';
import { RouletteWheel } from '@/games/roulette/game/RouletteWheel';
import { useRouletteStore } from '@/games/roulette/store';

export const RoulettePixiBridge: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const wheelRef = useRef<RouletteWheel | null>(null);
  const mainContainerRef = useRef<Container | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSpinning = useRouletteStore(state => state.isSpinning);

  const handleResize = useCallback(() => {
    if (!appRef.current || !containerRef.current || !mainContainerRef.current) return;
    
    const { clientWidth, clientHeight } = containerRef.current;
    console.log(`[Roulette] Resizing to ${clientWidth}x${clientHeight}`);
    
    appRef.current.renderer.resize(clientWidth, clientHeight);
    mainContainerRef.current.x = clientWidth / 2;
    mainContainerRef.current.y = clientHeight / 2;
    
    // Scale the main container if it gets too small
    const minDim = Math.min(clientWidth, clientHeight);
    const targetScale = Math.min(1, minDim / 600);
    mainContainerRef.current.scale.set(targetScale);
  }, []);

  const setup = useCallback(async (isCurrentRef: { current: boolean }, canvas: HTMLCanvasElement) => {
    if (!isCurrentRef.current || !containerRef.current) return;
    
    setIsLoaded(false);
    setError(null);
    const startTime = performance.now();
    console.group('%c[Roulette] initialization', 'color: #00ffff; font-weight: bold;');
    
    const { clientWidth, clientHeight } = containerRef.current;
    console.log(`[0ms] Setup started. Dimensions: ${clientWidth}x${clientHeight}`);
    
    let localApp: Application | null = null;
    
    try {
      const setupPromise = (async () => {
        localApp = new Application();
        appRef.current = localApp;

        console.log(`[${Math.round(performance.now() - startTime)}ms] Invoking app.init()...`);
        
        await Promise.race([
          localApp.init({
            canvas,
            width: clientWidth,
            height: clientHeight,
            backgroundColor: 0x000000,
            backgroundAlpha: 0,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('PIXI App Init Timeout (15s)')), 15000))
        ]);
        
        if (!isCurrentRef.current) {
          localApp.destroy(true, { children: true, texture: true });
          return;
        }

        const mainContainer = new Container();
        mainContainer.x = clientWidth / 2;
        mainContainer.y = clientHeight / 2;
        localApp.stage.addChild(mainContainer);
        mainContainerRef.current = mainContainer;

        // Apply initial scaling
        const minDim = Math.min(clientWidth, clientHeight);
        mainContainer.scale.set(Math.min(1, minDim / 600));

        console.log(`[${Math.round(performance.now() - startTime)}ms] Drawing Wheel...`);
        const wheel = new RouletteWheel(localApp, mainContainer);
        wheelRef.current = wheel;
        
        await wheel.init();
        
        if (isCurrentRef.current) {
          setIsLoaded(true);
          console.log(`[${Math.round(performance.now() - startTime)}ms] ROULETTE ENGINE FULLY LOADED`);
          handleResize(); // Final sync
        }
      })();

      await Promise.race([
        setupPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Total Load Timeout (30s)')), 30000))
      ]);

      console.groupEnd();
    } catch (err: unknown) {
      if (isCurrentRef.current) {
        console.error(`[${Math.round(performance.now() - startTime)}ms] FATAL ERROR:`, err);
        setError(err instanceof Error ? err.message : 'Unknown initialization error');
      }
      console.groupEnd();
      if (localApp) {
        try {
          (localApp as Application).destroy(true, { children: true, texture: true });
        } catch {
          /* destroy during failed init */
        }
        appRef.current = null;
      }
    }
  }, [handleResize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const isCurrentRef = { current: true };
    const timer = setTimeout(() => setup(isCurrentRef, canvas), 50);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      isCurrentRef.current = false;
      clearTimeout(timer);
      resizeObserver.disconnect();
      if (appRef.current) {
        const app = appRef.current;
        appRef.current = null;
        try {
          app.destroy(true, { children: true, texture: true });
        } catch {
          /* teardown */
        }
      }
      if (wheelRef.current) {
        try {
          wheelRef.current.destroy();
        } catch {
          /* wheel teardown */
        }
        wheelRef.current = null;
      }
      mainContainerRef.current = null;
    };
  }, [setup, handleResize]);

  useEffect(() => {
    if (isSpinning && wheelRef.current && isLoaded) {
      console.log('[Roulette] Spin trigged');
      const result = Math.floor(Math.random() * 37);
      let wasResolved = false;
      
      const timeoutId = setTimeout(() => {
        if (wasResolved) return;
        wasResolved = true;
        console.warn('[Roulette] Spin timed out');
        useRouletteStore.getState().actions.setSpinning(false);
      }, 12000);

      wheelRef.current.spin(result)
        .then(() => {
          if (wasResolved) return;
          wasResolved = true;
          useRouletteStore.getState().actions.setResult(result);
        })
        .catch((err) => {
          if (wasResolved) return;
          wasResolved = true;
          console.error('[Roulette] Animation error:', err);
          useRouletteStore.getState().actions.setSpinning(false);
        })
        .finally(() => {
          clearTimeout(timeoutId);
        });
    }
  }, [isSpinning, isLoaded]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gray-950/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      {(!isLoaded || error) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-950/90 z-10 backdrop-blur-md">
          <div className="flex flex-col items-center gap-8 p-8 text-center max-w-sm">
            {error ? (
              <>
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30 animate-pulse">
                  <span className="text-red-500 text-4xl font-black">!</span>
                </div>
                <div>
                  <h3 className="text-white font-black uppercase tracking-tighter text-2xl">Initialization Failed</h3>
                  <p className="text-gray-500 text-sm mt-3 font-medium leading-relaxed">{error}</p>
                </div>
                <button 
                  onClick={() => canvasRef.current && setup({ current: true }, canvasRef.current)}
                  className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neon-cyan transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  Force Reconnect
                </button>
              </>
            ) : (
              <>
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-neon-cyan font-black italic tracking-[0.2em] uppercase text-sm">Synchronizing</span>
                  <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest animate-pulse">Initializing Engine...</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
