import { create } from 'zustand';

interface GameState {
  balance: number;
  currentBet: number;
  isSpinning: boolean;
  lastWinAmount: number;
  matrix: number[][]; // 3x5 result matrix
  actions: {
    placeBet: () => void;
    setResult: (matrix: number[][], winAmount: number) => void;
    increaseBet: () => void;
    decreaseBet: () => void;
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  balance: 10000,
  currentBet: 100,
  isSpinning: false,
  lastWinAmount: 0,
  matrix: [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ],
  actions: {
    placeBet: () => {
      const { balance, currentBet, isSpinning } = get();
      if (isSpinning || balance < currentBet) return;
      set({ balance: balance - currentBet, isSpinning: true, lastWinAmount: 0 });
    },
    setResult: (matrix, winAmount) => {
      set({ isSpinning: false, matrix, balance: get().balance + winAmount, lastWinAmount: winAmount });
    },
    increaseBet: () => {
      const { currentBet, isSpinning } = get();
      if (isSpinning) return;
      set({ currentBet: Math.min(currentBet + 100, 5000) });
    },
    decreaseBet: () => {
      const { currentBet, isSpinning } = get();
      if (isSpinning) return;
      set({ currentBet: Math.max(currentBet - 100, 100) });
    }
  }
}));
