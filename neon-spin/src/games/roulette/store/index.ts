import { create } from 'zustand';

interface RouletteState {
  isSpinning: boolean;
  lastResult: number | null;
  currentBet: number;
  
  actions: {
    setSpinning: (spinning: boolean) => void;
    setResult: (result: number) => void;
    setBet: (amount: number) => void;
  };
}

export const useRouletteStore = create<RouletteState>((set) => ({
  isSpinning: false,
  lastResult: null,
  currentBet: 100,
  
  actions: {
    setSpinning: (spinning) => set({ isSpinning: spinning }),
    setResult: (result) => set({ lastResult: result, isSpinning: false }),
    setBet: (amount) => set({ currentBet: amount }),
  },
}));
