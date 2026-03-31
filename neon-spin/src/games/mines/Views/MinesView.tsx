import { useEffect, useRef, useState } from 'react';
import { MinesEngine } from '../Engine/MinesEngine';
import { useMinesStore } from '../store';
import { useUserStore } from '../../../store/useUserStore';
import { useWebSocket } from '../../../hooks/useWebSocket';

export const MinesView = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<MinesEngine | null>(null);
  const socket = useWebSocket();
  const balance = useUserStore((state: { balance: number } | unknown) => (state as { balance: number }).balance);
  const { isActive, currentBet, minesCount, multiplier, actions } = useMinesStore();

  const [pendingPick, setPendingPick] = useState<number | null>(null);

  // Init Engine
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const wrappedSocket = {
      on: socket.on.bind(socket),
      off: socket.off.bind(socket),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      emit: (event: any, payload?: any) => {
        if (event === 'MINES_PICK') setPendingPick(payload.index);
        socket.emit(event, payload);
      }
    };
    const engine = new MinesEngine(wrappedSocket);
    engine.init(canvasRef.current);
    engineRef.current = engine;

    return () => {
      engine.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bridge React -> Pixi for specific cell animation
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

  // Socket overrides handled via wrappedSocket above.
  const potentialWin = (currentBet * multiplier).toFixed(2);

  return (
    <div className="flex flex-col lg:flex-row w-full h-full gap-6">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 bg-gray-900/60 border border-gray-800 rounded-2xl p-6 flex flex-col gap-6 backdrop-blur-md shrink-0">
        <div>
           <label className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2 block">Bet Amount</label>
           <div className="flex items-center bg-black border border-gray-700 rounded-lg overflow-hidden">
             <button 
               disabled={isActive} 
               onClick={actions.decreaseBet}
               className="px-4 py-3 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 border-r border-gray-700"
             >
               -
             </button>
             <span className="pl-4 text-gray-500">$</span>
             <input disabled={isActive} type="number" value={currentBet} onChange={(e) => actions.setBet(Number(e.target.value))} className="w-full bg-transparent px-2 py-3 outline-none font-mono" />
             <button 
               disabled={isActive} 
               onClick={actions.increaseBet}
               className="px-4 py-3 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 border-l border-gray-700"
             >
               +
             </button>
           </div>
        </div>

        <div>
           <label className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2 block">Mines ({minesCount})</label>
           <input disabled={isActive} type="range" min="1" max="24" value={minesCount} onChange={(e) => actions.setMinesCount(Number(e.target.value))} className="w-full accent-neon-pink" />
        </div>

        <div className="mt-auto">
          {isActive ? (
             <button onClick={() => engineRef.current?.cashout()} className="w-full py-4 rounded-xl font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(0,255,255,0.4)] bg-gradient-to-r from-neon-blue to-teal-400 text-black hover:scale-105 transition-transform">
               Cashout<br/>
               <span className="font-mono text-sm block mt-1">${potentialWin}</span>
             </button>
          ) : (
             <button onClick={() => engineRef.current?.startRound(currentBet, { minesCount })} disabled={balance < currentBet} className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase transition-transform ${balance < currentBet ? 'bg-gray-800 text-gray-600' : 'shadow-[0_0_20px_rgba(255,0,255,0.4)] bg-gradient-to-r from-neon-pink to-neon-purple text-white hover:scale-105'}`}>
               Start Game
             </button>
          )}
        </div>
      </div>

      {/* Game Canvas Area */}
      <div className="flex-1 bg-black/60 border border-gray-800 rounded-2xl flex items-center justify-center overflow-hidden relative shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
         <div className="absolute top-6 right-6 z-10 bg-gray-900/80 border border-gray-700 px-4 py-2 rounded-lg flex flex-col items-center">
            <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">Multiplier</span>
            <span className="text-neon-pink font-mono font-bold text-xl">{multiplier.toFixed(2)}x</span>
         </div>
         <canvas ref={canvasRef} className="w-full h-full max-w-2xl max-h-2xl object-contain drop-shadow-[0_0_30px_rgba(0,255,255,0.1)]" />
      </div>
    </div>
  );
};
