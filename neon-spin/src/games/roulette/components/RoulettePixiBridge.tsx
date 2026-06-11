import React, { useEffect, useRef, useCallback } from 'react';
import { Application, Container } from 'pixi.js';
import { RouletteWheel } from '@/games/roulette/game/RouletteWheel';
import { useRouletteStore } from '@/games/roulette/store';
import { usePixiApplication } from '@/hooks/usePixiApplication';

export const RoulettePixiBridge: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<RouletteWheel | null>(null);
  const mainContainerRef = useRef<Container | null>(null);
  const isSpinning = useRouletteStore(state => state.isSpinning);

  const getOptions = useCallback((canvas: HTMLCanvasElement) => {
    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 600;
    return {
      canvas,
      width,
      height,
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    };
  }, []);

  const initialize = useCallback(async (app: Application) => {
    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 600;
    const mainContainer = new Container();
    mainContainer.x = width / 2;
    mainContainer.y = height / 2;
    mainContainer.scale.set(Math.min(1, Math.min(width, height) / 600));
    app.stage.addChild(mainContainer);
    mainContainerRef.current = mainContainer;

    const wheel = new RouletteWheel(app, mainContainer);
    wheelRef.current = wheel;
    await wheel.init();
    return () => {
      wheel.destroy();
      wheelRef.current = null;
      mainContainerRef.current = null;
    };
  }, []);

  const { appRef, isLoaded, error, retry } = usePixiApplication({
    canvasRef,
    getOptions,
    initialize,
    timeoutMs: 30000,
  });

  const handleResize = useCallback(() => {
    if (!appRef.current || !containerRef.current || !mainContainerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    appRef.current.renderer.resize(clientWidth, clientHeight);
    mainContainerRef.current.x = clientWidth / 2;
    mainContainerRef.current.y = clientHeight / 2;
    mainContainerRef.current.scale.set(Math.min(1, Math.min(clientWidth, clientHeight) / 600));
  }, [appRef]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [handleResize]);

  useEffect(() => {
    if (isSpinning && wheelRef.current && isLoaded) {
      const result = Math.floor(Math.random() * 37);
      let wasResolved = false;
      
      const timeoutId = setTimeout(() => {
        if (wasResolved) return;
        wasResolved = true;
        useRouletteStore.getState().actions.settleSpin(result);
      }, 12000);

      wheelRef.current.spin(result)
        .then(() => {
          if (wasResolved) return;
          wasResolved = true;
          useRouletteStore.getState().actions.settleSpin(result);
        })
        .catch((err) => {
          if (wasResolved) return;
          wasResolved = true;
          if (import.meta.env.DEV) console.error('[Roulette] Animation error:', err);
          useRouletteStore.getState().actions.settleSpin(result);
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
                  onClick={retry}
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
