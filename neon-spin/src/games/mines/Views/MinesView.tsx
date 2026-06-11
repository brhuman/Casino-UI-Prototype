import { useRef, useCallback } from 'react';
import { Application } from 'pixi.js';
import { MinesEngine } from '@/games/mines/Engine/MinesEngine';
import { useMinesStore } from '@/games/mines/store';
import { useUserStore } from '@/store/useUserStore';
import { minesSocket } from '@/games/mines/services/FakeMinesSocket';
import { useMinesAudio } from '@/games/mines/hooks/useMinesAudio';
import { GameButton } from '@/components/ui/GameButton';
import { Play } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { usePixiApplication } from '@/hooks/usePixiApplication';
import { PageMeta } from '@/components/ui/PageMeta';

export const MinesView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<MinesEngine | null>(null);
  const highQualityFx = useSettingsStore((state) => state.highQualityFx);
  const neonGlow = useSettingsStore((state) => state.neonGlow);
  const balance = useUserStore((state) => state.balance);

  const isActive = useMinesStore(state => state.isActive);
  const phase = useMinesStore(state => state.phase);
  const currentBet = useMinesStore(state => state.currentBet);
  const minesCount = useMinesStore(state => state.minesCount);
  const multiplier = useMinesStore(state => state.multiplier);
  const setMinesCount = useMinesStore(state => state.actions.setMinesCount);
  const increaseBet = useMinesStore(state => state.actions.increaseBet);
  const decreaseBet = useMinesStore(state => state.actions.decreaseBet);

  useMinesAudio();

  const getOptions = useCallback((canvas: HTMLCanvasElement) => ({
    canvas,
    width: containerRef.current?.clientWidth || 800,
    height: containerRef.current?.clientHeight || 800,
    preference: 'webgl' as const,
    backgroundAlpha: 0,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    resizeTo: containerRef.current ?? undefined,
  }), []);

  const initialize = useCallback(async (app: Application) => {
    const engine = new MinesEngine(minesSocket);
    engineRef.current = engine;
    await engine.init(app);
    return () => {
      engine.destroy();
      if (engineRef.current === engine) engineRef.current = null;
      minesSocket.resetMinesGame();
      useMinesStore.getState().actions.abortGame();
    };
  }, []);

  const { isLoaded, error, retry } = usePixiApplication({
    canvasRef,
    getOptions,
    initialize,
  });


  const potentialWin = (currentBet * multiplier).toFixed(2);

  return (
    <div className="relative flex-1 flex w-full flex-col items-center justify-center p-4 sm:p-12">
      <PageMeta
        title="Cyber Mines | High-Stakes Logic Game"
        description="Can you navigate the grid without hitting a mine? Multiply your balance in this high-tension logic game for the bold."
        image="/assets/mines_thumb.png"
      />
      {/* Background Graphic */}
      {highQualityFx && (
        <div className="pointer-events-none fixed inset-0 z-0 opacity-45 mix-blend-screen bg-[url('/assets/neon_mines_background.png')] bg-cover bg-center bg-no-repeat"
        />
      )}

      <div className={`relative z-10 w-full max-w-[1000px] flex flex-col flex-1 max-h-[1000px] min-h-[700px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,16,24,0.95),rgba(5,6,10,0.98))] p-6 ${neonGlow ? 'shadow-[0_30px_100px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)]' : 'shadow-2xl'} gap-6`}>
        
        {/* Game Canvas Container - flex-1 fills all remaining space */}
        <div className="relative z-10 flex flex-1 min-h-0 w-full shrink flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-emerald-500/30 bg-[#02040a] shadow-[inset_0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(16,185,129,0.15)]">
         
         {!isLoaded && !error && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-8 text-center overscroll-none">
              <div className="w-1/2 max-w-sm h-1 bg-white/10 rounded-full overflow-hidden mb-8 border border-white/10">
                <div className="h-full bg-gradient-to-r from-neon-blue via-neon-pink to-neon-purple animate-pulse w-full"></div>
              </div>
              <h2 className="text-white font-bold text-2xl tracking-tighter uppercase mb-1">Mines Engine</h2>
              <p className="text-neon-pink font-mono animate-pulse text-[10px] uppercase tracking-widest">Initializing visual systems</p>
            </div>
         )}

         {error && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/98 p-8 text-center overflow-y-auto">
               <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/40 animate-pulse">
                  <span className="text-red-500 text-4xl font-bold">!</span>
               </div>
               <h3 className="text-red-500 text-2xl font-bold mb-2 uppercase tracking-tighter">Initialization Failed</h3>
               <p className="text-white/80 mb-8 font-mono text-sm max-w-xl mx-auto">{error}</p>
               
                <div className="flex gap-4">
                   <button onClick={retry} className="px-10 py-4 bg-neon-blue hover:bg-neon-blue/80 text-black font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(0,255,255,0.4)] uppercase tracking-widest text-sm">
                     Manual Retry
                   </button>
                </div>
            </div>
         )}

         <div ref={containerRef} className={`w-full h-full flex items-center justify-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <ErrorBoundary fallbackMessage="Mines grid rendering failure.">
              <canvas ref={canvasRef} className="mx-auto block max-w-full max-h-full drop-shadow-[0_0_30px_rgba(0,255,255,0.1)]" style={{ objectFit: 'contain' }} />
            </ErrorBoundary>
         </div>
        </div>

        {/* Controls Container */}
        <div className="relative z-20 flex flex-col shrink-0 w-full rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,30,0.95),rgba(10,10,15,1))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] gap-4">
          
          {/* Top Row: Main Action */}
          <div className="flex justify-center">
            {isActive ? (
              <GameButton
                onClick={() => engineRef.current?.cashout()}
                label={`CASHOUT $${potentialWin}`}
                disabled={phase === 'settling'}
                isLoading={phase === 'settling'}
                icon={Play}
                className="w-full max-w-md"
              />
            ) : (
              <GameButton
                onClick={() => engineRef.current?.startRound(currentBet, { minesCount })}
                disabled={balance < currentBet || phase !== 'idle'}
                label={phase === 'starting' ? 'STARTING...' : 'START'}
                icon={Play}
                className="w-full max-w-md"
              />
            )}
          </div>

          {/* Bottom Row: Settings & Stats */}
          <div className="flex items-center justify-between px-4">
            {/* Left: Mines Slider */}
            <div className="flex w-48 flex-col justify-center gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neon-fuchsia/90 leading-none">Mines: {minesCount}</span>
              </div>
              <input disabled={phase !== 'idle'} type="range" min="1" max="24" value={minesCount} onChange={(e) => setMinesCount(Number(e.target.value))} className="w-full h-1.5 accent-neon-fuchsia" />
            </div>

            {/* Middle: Multiplier */}
            <div className="flex flex-col items-center justify-center px-4 border-x border-white/5">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neon-purple/90 mb-1">Multiplier</span>
              <span className="text-xl font-black font-mono text-neon-cyan leading-none">{multiplier.toFixed(2)}x</span>
            </div>

            {/* Right: Bet Adjust */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-[9px] font-bold uppercase tracking-widest text-white/70">Bet:</span>
              <div className="flex items-center gap-2 bg-black/40 p-1 rounded-2xl border border-white/5">
                <button
                  type="button"
                  className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 text-lg text-white/90 hover:text-white hover:bg-white/10 transition-all font-black"
                  disabled={phase !== 'idle' || currentBet <= 100}
                  onClick={decreaseBet}
                >
                  -
                </button>
                <div className="min-w-[70px] text-center">
                  <span className="font-mono text-lg font-bold text-white">${currentBet}</span>
                </div>
                <button
                  type="button"
                  className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 text-lg text-white/90 hover:text-white hover:bg-white/10 transition-all font-black"
                  disabled={phase !== 'idle' || currentBet >= 5000}
                  onClick={increaseBet}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
