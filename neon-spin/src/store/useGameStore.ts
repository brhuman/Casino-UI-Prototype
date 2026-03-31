import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useUserStore } from './useUserStore';

interface GameState {
  currentBet: number;
  isSpinning: boolean;
  lastWinAmount: number;
  matrix: number[][];
  actions: {
    placeBet: () => void;
    setResult: (matrix: number[][], winAmount: number) => void;
    increaseBet: () => void;
    decreaseBet: () => void;
  };
}

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
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
        const { currentBet, isSpinning } = get();
        const userBalance = useUserStore.getState().balance;
        
        if (isSpinning || userBalance < currentBet) return;
        
        useUserStore.getState().actions.updateBalance(-currentBet);
        set({ isSpinning: true, lastWinAmount: 0 });
      },
      setResult: (matrix, winAmount) => {
        if (winAmount > 0) {
          useUserStore.getState().actions.updateBalance(winAmount);
        }
        set({ isSpinning: false, matrix, lastWinAmount: winAmount });
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
  }))
);
