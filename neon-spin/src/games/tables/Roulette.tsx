import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Layers } from 'lucide-react';

type BetType = 'red' | 'black' | 'green' | 'even' | 'odd';

interface BetState {
  type: BetType;
  amount: number;
}

const ROULETTE_NUMBERS = [
  { val: 0, color: 'green' }, { val: 32, color: 'red' }, { val: 15, color: 'black' },
  { val: 19, color: 'red' }, { val: 4, color: 'black' }, { val: 21, color: 'red' },
  { val: 2, color: 'black' }, { val: 25, color: 'red' }, { val: 17, color: 'black' },
  { val: 34, color: 'red' }, { val: 6, color: 'black' }, { val: 27, color: 'red' },
  { val: 13, color: 'black' }, { val: 36, color: 'red' }, { val: 11, color: 'black' },
  { val: 30, color: 'red' }, { val: 8, color: 'black' }, { val: 23, color: 'red' },
  { val: 10, color: 'black' }, { val: 5, color: 'red' }, { val: 24, color: 'black' },
  { val: 16, color: 'red' }, { val: 33, color: 'black' }, { val: 1, color: 'red' },
  { val: 20, color: 'black' }, { val: 14, color: 'red' }, { val: 31, color: 'black' },
  { val: 9, color: 'red' }, { val: 22, color: 'black' }, { val: 18, color: 'red' },
  { val: 29, color: 'black' }, { val: 7, color: 'red' }, { val: 28, color: 'black' },
  { val: 12, color: 'red' }, { val: 35, color: 'black' }, { val: 3, color: 'red' },
  { val: 26, color: 'black' }
];

export const Roulette = () => {
  const [bets, setBets] = useState<BetState[]>([]);
  const [chipSize, setChipSize] = useState<number>(10);
  const balance = useGameStore((state: { balance: number }) => state.balance);
  const setResult = useGameStore((state: { actions: { setResult: (matrix: number[][], winAmount: number) => void } }) => state.actions.setResult);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResultNum] = useState<{ val: number; color: string } | null>(null);
  const [lastResults, setLastResults] = useState<{ val: number; color: string }[]>([]);

  const placeBet = (type: BetType) => {
    if (isSpinning || balance < chipSize) return;
    
    // Deduct balance manually or we can sync with GameStore. 
    // For MVP, just track logically and apply as a win/loss at end.
    setBets(prev => {
      const existing = prev.find(b => b.type === type);
      if (existing) {
        return prev.map(b => b.type === type ? { ...b, amount: b.amount + chipSize } : b);
      }
      return [...prev, { type, amount: chipSize }];
    });
  };

  const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);

  const calculateWin = (betted: BetState[], res: { val: number; color: string }) => {
    let winAmount = 0;
    betted.forEach(bet => {
      if (bet.type === 'red' && res.color === 'red') winAmount += bet.amount * 2;
      if (bet.type === 'black' && res.color === 'black') winAmount += bet.amount * 2;
      if (bet.type === 'green' && res.color === 'green') winAmount += bet.amount * 14;
      if (bet.type === 'even' && res.val !== 0 && res.val % 2 === 0) winAmount += bet.amount * 2;
      if (bet.type === 'odd' && res.val !== 0 && res.val % 2 !== 0) winAmount += bet.amount * 2;
    });
    return winAmount;
  };

  const spin = () => {
    if (isSpinning || totalBet === 0 || balance < totalBet) return;
    
    setIsSpinning(true);
    setResultNum(null);
    
    // Deduct total bet
    setResult([[]], -totalBet);

    // Fake spin wait
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * ROULETTE_NUMBERS.length);
      const res = ROULETTE_NUMBERS[randomIdx];
      
      const win = calculateWin(bets, res);
      
      setResultNum(res);
      setLastResults(prev => [res, ...prev].slice(0, 10));
      setIsSpinning(false);
      
      if (win > 0) {
        setResult([[]], win); // add win
      }
      setBets([]); // clear bets
    }, 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-full flex flex-col gap-6">
      <div className="flex items-center gap-4 bg-gray-900/60 p-4 rounded-xl border border-gray-800">
        <Layers className="text-neon-blue" size={32} />
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Neon Roulette</h2>
        
        <div className="ml-auto flex gap-2">
          {lastResults.map((r, i) => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md border border-gray-700
              ${r.color === 'red' ? 'bg-red-600' : r.color === 'black' ? 'bg-gray-900' : 'bg-green-600'} text-white`}
            >
              {r.val}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Betting Area */}
        <div className="flex-1 bg-gray-900/40 p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
           <div className="flex justify-center mb-10 mt-10">
              <div className="relative w-64 h-64 border-4 border-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 bg-[repeating-conic-gradient(#ff0000_0_10deg,#111_10deg_20deg)] opacity-20"></div>
                 {isSpinning && (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-t-4 border-neon-blue rounded-full"
                    />
                 )}
                 <AnimatePresence>
                   {!isSpinning && result && (
                     <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={`z-10 w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] border-2 border-white
                        ${result.color === 'red' ? 'bg-red-600 text-white' : result.color === 'black' ? 'bg-gray-900 text-white' : 'bg-green-500 text-black'}`}
                     >
                        {result.val}
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
           </div>

           <div className="grid grid-cols-5 gap-4">
              {[
                { type: 'red', label: 'RED 2x', color: 'bg-red-900/50 hover:bg-red-600 text-red-500 border-red-900' },
                { type: 'black', label: 'BLK 2x', color: 'bg-gray-800/50 hover:bg-gray-700 text-gray-400 border-gray-700' },
                { type: 'green', label: 'GRN 14x', color: 'bg-green-900/50 hover:bg-green-600 text-green-500 border-green-900' },
                { type: 'even', label: 'EVEN 2x', color: 'bg-blue-900/30 hover:bg-blue-800 text-blue-400 border-blue-900' },
                { type: 'odd', label: 'ODD 2x', color: 'bg-blue-900/30 hover:bg-blue-800 text-blue-400 border-blue-900' },
              ].map(bt => {
                const betAmt = bets.find(b => b.type === bt.type)?.amount || 0;
                return (
                  <button 
                    key={bt.type}
                    onClick={() => placeBet(bt.type as BetType)}
                    className={`relative p-4 rounded-xl border-2 transition-colors font-bold tracking-wider ${bt.color}`}
                  >
                    {bt.label}
                    {betAmt > 0 && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-neon-blue text-black font-bold flex items-center justify-center text-xs shadow-[0_0_10px_#00ffff]">
                        ${betAmt}
                      </div>
                    )}
                  </button>
                )
              })}
           </div>
        </div>

        {/* Controls */}
        <div className="w-full lg:w-80 bg-gray-900/60 p-6 rounded-2xl border border-gray-800 flex flex-col gap-6">
           <div>
              <label className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2 block">Chip Size</label>
              <div className="flex gap-2">
                 {[10, 50, 100, 500].map(size => (
                   <button 
                     key={size}
                     onClick={() => setChipSize(size)}
                     className={`flex-1 py-3 rounded-lg font-bold border ${chipSize === size ? 'bg-neon-pink text-white border-neon-pink shadow-[0_0_10px_rgba(255,0,255,0.4)]' : 'bg-gray-800 text-gray-400 border-gray-700'}`}
                   >
                     ${size}
                   </button>
                 ))}
              </div>
           </div>

           <div className="mt-auto">
              <div className="flex justify-between text-gray-400 mb-2 uppercase tracking-wide text-sm font-bold">
                 <span>Total Bet</span>
                 <span className="text-white">${totalBet}</span>
              </div>
              <button 
                onClick={spin}
                disabled={isSpinning || totalBet === 0 || balance < totalBet}
                className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase transition-transform ${isSpinning || totalBet === 0 || balance < totalBet ? 'bg-gray-800 text-gray-600' : 'bg-gradient-to-r from-neon-blue to-teal-400 text-black hover:scale-105 shadow-[0_0_20px_rgba(0,255,255,0.4)]'}`}
              >
                {isSpinning ? 'Rolling...' : 'Spin'}
              </button>
              
              <button 
                onClick={() => setBets([])}
                disabled={isSpinning || bets.length === 0}
                className="w-full mt-4 py-3 rounded-xl font-bold tracking-widest uppercase transition-all bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              >
                Clear Bets
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
