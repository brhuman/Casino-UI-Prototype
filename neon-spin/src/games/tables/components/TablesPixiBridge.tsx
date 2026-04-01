import React, { useEffect, useRef, useState } from 'react';
import { Application, Container } from 'pixi.js';
import { RouletteWheel } from '../game/RouletteWheel';
import { useTablesStore } from '../store';

export const TablesPixiBridge: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const wheelRef = useRef<RouletteWheel | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const isSpinning = useTablesStore(state => state.isSpinning);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isCurrent = true;
    let localApp: Application | null = null;
    setIsLoaded(false);

    const setup = async () => {
      try {
        localApp = new Application();
        appRef.current = localApp;

        await localApp.init({
          canvas,
          width: 800,
          height: 600,
          backgroundColor: 0x000000,
          backgroundAlpha: 0,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        });

        if (!isCurrent) {
          localApp.destroy(true);
          return;
        }

        const mainContainer = new Container();
        mainContainer.x = 400;
        mainContainer.y = 300;
        localApp.stage.addChild(mainContainer);

        wheelRef.current = new RouletteWheel(localApp, mainContainer);
        if (isCurrent) setIsLoaded(true);
      } catch (err) {
        if (isCurrent) console.error('[TablesPixiBridge] init error:', err);
      }
    };

    setup();

    return () => {
      isCurrent = false;
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
      wheelRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isSpinning && wheelRef.current) {
      const result = Math.floor(Math.random() * 37);
      wheelRef.current.spin(result).then(() => {
        useTablesStore.getState().actions.setResult(result);
      });
    }
  }, [isSpinning]);

  return (
    <div className="relative w-full aspect-video max-w-3xl mx-auto bg-gray-900/40 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-950/80 z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
            <span className="text-neon-cyan font-black italic tracking-widest uppercase text-xs">Loading Wheel...</span>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
