import { useEffect, useRef, useState, useCallback } from 'react';
import { Application } from 'pixi.js';
import { MinesEngine } from '../Engine/MinesEngine';
import { useMinesStore } from '../store';
import { useUserStore } from '../../../store/useUserStore';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { useMinesAudio } from '../hooks/useMinesAudio';
import { GameButton } from '../../../components/ui/GameButton';
import { Play } from 'lucide-react';
import { useSettingsStore } from '../../../store/useSettingsStore';

const canvasAppMap = new WeakMap<HTMLCanvasElement, Application>();
const canvasInitPromiseMap = new WeakMap<HTMLCanvasElement, Promise<Application>>();

export const MinesView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<MinesEngine | null>(null);
  const socket = useWebSocket();
  const { highQualityFx, neonGlow } = useSettingsStore();
  const balance = useUserStore((state: any) => state.balance);

  const isActive = useMinesStore(state => state.isActive);
  const currentBet = useMinesStore(state => state.currentBet);
  const minesCount = useMinesStore(state => state.minesCount);
  const multiplier = useMinesStore(state => state.multiplier);
  const actions = useMinesStore(state => state.actions);

  useMinesAudio();

  const [pendingPick, setPendingPick] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorStack, setErrorStack] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showFullLogs, setShowFullLogs] = useState(false);

  const addLog = useCallback((msg: string) => {
    const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
    const logLine = `[${timestamp}] ${msg}`;
    setDebugLogs(prev => [...prev.slice(-99), logLine]);
  }, []);

  const setup = useCallback(async (isInterruptedRef: { current: boolean }) => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      
      if (!container || !canvas) {
        addLog("ABORT: Container or Canvas Ref null");
        return;
      }


      if (canvasAppMap.has(canvas)) {
        const existingApp = canvasAppMap.get(canvas)!;
        addLog("REUSING: Existing PIXI Application found for this canvas.");
        
        if (!engineRef.current) {
          addLog("Creating MinesEngine for existing app...");
          const wrappedSocket = {
            on: socket.on.bind(socket),
            off: socket.off.bind(socket),
            emit: (event: any, payload?: any) => {
              if (event === 'MINES_PICK') setPendingPick(payload.index);
              socket.emit(event, payload);
            }
          };
          engineRef.current = new MinesEngine(wrappedSocket);
        }
        engineRef.current.init(existingApp);
        setIsLoaded(true);
        return;
      }


      if (canvasInitPromiseMap.has(canvas)) {
        addLog("AWAITING: Initialization already in progress by another mount...");
        try {
          const app = await canvasInitPromiseMap.get(canvas)!;
          if (isInterruptedRef.current) return;
          addLog("ASYNC-SUCCESS: Previous init finished, taking over.");
          
          if (!engineRef.current) {
            const wrappedSocket = {
              on: socket.on.bind(socket),
              off: socket.off.bind(socket),
              emit: (event: any, payload?: any) => {
                if (event === 'MINES_PICK') setPendingPick(payload.index);
                socket.emit(event, payload);
              }
            };
            engineRef.current = new MinesEngine(wrappedSocket);
          }
          engineRef.current.init(app);
          setIsLoaded(true);
        } catch (e: any) {
          addLog(`ASYNC-ERROR: Inherited init failed: ${e.message}`);
        }
        return;
      }


      let localApp: Application | null = null;
      let resolveInit: (app: Application) => void;
      let rejectInit: (err: any) => void;
      
      const initPromise = new Promise<Application>((res, rej) => {
        resolveInit = res;
        rejectInit = rej;
      });
      canvasInitPromiseMap.set(canvas, initPromise);

      try {
        addLog(`Environment: resolution=${window.devicePixelRatio}, isConnected=${container.isConnected}`);
        

        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
        if (!gl) {
          addLog("WARNING: WebGL context not directly available on canvas");
        } else {
          addLog(`WebGL Detected: ${gl.getParameter(gl.RENDERER)}`);
        }

        addLog("Creating PIXI Application instance...");
        localApp = new Application();
        
        const containerW = container.clientWidth || 800;
        const containerH = container.clientHeight || 800;

        addLog("Invoking PIXI.init() (20s timeout)...");
        const piInitPromise = localApp.init({
          canvas,
          width: containerW,
          height: containerH,
          preference: 'webgl',
          backgroundAlpha: 0,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
          resizeTo: container,
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("PIXI Initialization Timeout (20 seconds reached)")), 20000)
        );

        await Promise.race([piInitPromise, timeoutPromise]);
        
        addLog("PIXI App Init Success.");
        canvasAppMap.set(canvas, localApp);
        resolveInit!(localApp);

        if (isInterruptedRef.current) {
          addLog("INTERRUPTED: View moved, but app is ready in cache for next mount.");
          return;
        }
        
        addLog("Initializing MinesEngine...");
        if (!engineRef.current) {
          const wrappedSocket = {
            on: socket.on.bind(socket),
            off: socket.off.bind(socket),
            emit: (event: any, payload?: any) => {
              if (event === 'MINES_PICK') setPendingPick(payload.index);
              socket.emit(event, payload);
            }
          };
          engineRef.current = new MinesEngine(wrappedSocket);
        }

        await engineRef.current.init(localApp);
        addLog("Engine ready.");
        setIsLoaded(true);
      } catch (err: any) {
        addLog(`ERROR: ${err.message}`);
        console.error("[MinesView] Engine Init Error:", err);
        setErrorStack(err.stack || "No stack trace available");
        rejectInit!(err);
        if (localApp) {
          try { localApp.destroy(true, { children: true }); } catch (e) {  }
        }
        if (!isInterruptedRef.current) setError(err.message || "Failed to initialize game engine.");
      }
  }, [addLog, socket]);


  useEffect(() => {
    const isInterruptedRef = { current: false };
    setup(isInterruptedRef);

    return () => {
      isInterruptedRef.current = true;
      if (engineRef.current) {

        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [setup]);

  const handleManualRestart = () => {
    setError(null);
    setErrorStack(null);
    setIsLoaded(false);
    setDebugLogs([]);
    setup({ current: false });
  };


  useEffect(() => {
    const handleResult = (data: { status?: string } | unknown) => {
      if (pendingPick !== null && engineRef.current) {
         engineRef.current.revealCellClient(pendingPick, (data as { status: string }).status === 'SAFE');
         setPendingPick(null);
      }
    };
    socket.on('MINES_RESULT', handleResult);
    return () => socket.off('MINES_RESULT', handleResult);
  }, [pendingPick, socket]);

  const potentialWin = (currentBet * multiplier).toFixed(2);

  return (
    <div className="relative flex-1 flex w-full flex-col items-center justify-center p-4 sm:p-12">
      {/* Background Graphic */}
      {highQualityFx && (
        <div className="pointer-events-none fixed inset-0 z-0 opacity-45 mix-blend-screen bg-[url('/assets/neon_mines_background.png')] bg-cover bg-center bg-no-repeat"
        />
      )}

      <div className={`relative z-10 w-full max-w-[1000px] flex flex-col flex-1 max-h-[1000px] min-h-[700px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,16,24,0.95),rgba(5,6,10,0.98))] p-6 ${neonGlow ? 'shadow-[0_30px_100px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)]' : 'shadow-2xl'} gap-6`}>
        
        {/* Game Canvas Container - flex-1 fills all remaining space */}
        <div className="relative z-10 flex flex-1 min-h-0 w-full shrink flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-emerald-500/30 bg-[#02040a] shadow-[inset_0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(16,185,129,0.15)]">
         
         {!isLoaded && !error && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-900/95 backdrop-blur-md p-8 text-center overscroll-none">
              <div className="w-1/2 h-1 bg-gray-800 rounded-full overflow-hidden mb-8 border border-gray-800">
                <div className="h-full bg-gradient-to-r from-neon-blue via-neon-pink to-neon-purple animate-pulse w-full"></div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-white font-bold text-2xl tracking-tighter uppercase mb-1">Mines Engine</h2>
                <p className="text-neon-pink font-mono animate-pulse text-[10px] uppercase tracking-widest">Initializing Visual Systems</p>
              </div>
              
              <div className={`w-full max-w-2xl bg-black/60 border border-gray-800 rounded-2xl p-6 font-mono text-[11px] transition-all duration-500 overflow-hidden relative ${showFullLogs ? 'h-[60vh]' : 'h-48'}`}>
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                   <span className="text-gray-500 uppercase text-[9px] font-bold">System Initialization Log</span>
                   <button onClick={() => setShowFullLogs(!showFullLogs)} className="text-neon-blue hover:underline text-[9px] uppercase font-bold">
                     {showFullLogs ? 'Minimize View' : 'Expand View'}
                   </button>
                </div>
                <div className="overflow-y-auto h-[calc(100%-40px)] scrollbar-hide flex flex-col-reverse text-left">
                  {[...debugLogs].reverse().map((log, i) => (
                    <div key={i} className={`mb-1 pl-3 border-l-2 ${log.includes('ERROR') ? 'border-red-500 text-red-400' : 'border-neon-blue/30 text-gray-400'}`}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="mt-8 text-gray-600 font-mono text-[9px] uppercase tracking-widest">If stuck for more than 20 seconds, please click RELOAD</p>
            </div>
         )}

         {error && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/98 p-8 text-center overflow-y-auto">
               <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/40 animate-pulse">
                  <span className="text-red-500 text-4xl font-bold">!</span>
               </div>
               <h3 className="text-red-500 text-2xl font-bold mb-2 uppercase tracking-tighter">Initialization Failed</h3>
               <p className="text-gray-400 mb-8 font-mono text-sm max-w-xl mx-auto">{error}</p>
               
               {errorStack && (
                 <div className="w-full max-w-2xl bg-red-950/20 border border-red-900/40 rounded-xl p-6 mb-10 text-left relative group">
                    <p className="text-red-400/60 text-[10px] mb-2 uppercase font-bold tracking-widest">Error Stack (Please Copy-Paste):</p>
                    <pre className="text-red-400/80 text-[10px] font-mono whitespace-pre-wrap break-all max-h-60 overflow-y-auto pr-4 scrollbar-hide">
                       {errorStack}
                    </pre>
                 </div>
               )}

                <div className="flex gap-4">
                   <button onClick={() => window.location.reload()} className="px-10 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all border border-gray-700 uppercase tracking-widest text-sm">
                     Full Reload
                   </button>
                   <button onClick={handleManualRestart} className="px-10 py-4 bg-neon-blue hover:bg-neon-blue/80 text-black font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(0,255,255,0.4)] uppercase tracking-widest text-sm">
                     Manual Retry
                   </button>
                </div>
            </div>
         )}

         <div ref={containerRef} className={`w-full h-full flex items-center justify-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <canvas ref={canvasRef} className="mx-auto block max-w-full max-h-full drop-shadow-[0_0_30px_rgba(0,255,255,0.1)]" style={{ objectFit: 'contain' }} />
         </div>
        </div>

        {/* Controls Container */}
        <div className="relative z-20 flex flex-col shrink-0 w-full rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,30,0.95),rgba(10,10,15,1))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] gap-4">
          
          {/* Top Row: Main Action */}
          <div className="flex justify-center">
            {isActive ? (
              <GameButton
                onClick={() => engineRef.current?.cashout()}
                label={`CASHOUT $${potentialWin}`}
                icon={Play}
                className="w-full max-w-md"
              />
            ) : (
              <GameButton
                onClick={() => engineRef.current?.startRound(currentBet, { minesCount })}
                disabled={balance < currentBet}
                label="START"
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
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neon-fuchsia/60 leading-none">Mines: {minesCount}</span>
              </div>
              <input disabled={isActive} type="range" min="1" max="24" value={minesCount} onChange={(e) => actions.setMinesCount(Number(e.target.value))} className="w-full h-1.5 accent-neon-fuchsia" />
            </div>

            {/* Middle: Multiplier */}
            <div className="flex flex-col items-center justify-center px-4 border-x border-white/5">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neon-purple/60 mb-1">Multiplier</span>
              <span className="text-xl font-black font-mono text-neon-cyan leading-none">{multiplier.toFixed(2)}x</span>
            </div>

            {/* Right: Bet Adjust */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-[9px] font-bold uppercase tracking-widest text-white/40">Bet:</span>
              <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
                <button
                  type="button"
                  className="h-8 w-8 rounded-md border border-white/10 bg-white/5 text-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  disabled={isActive || currentBet <= 100}
                  onClick={actions.decreaseBet}
                >
                  -
                </button>
                <div className="min-w-[70px] text-center">
                  <span className="font-mono text-lg font-bold text-white">${currentBet}</span>
                </div>
                <button
                  type="button"
                  className="h-8 w-8 rounded-md border border-white/10 bg-white/5 text-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  disabled={isActive || currentBet >= 5000}
                  onClick={actions.increaseBet}
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
