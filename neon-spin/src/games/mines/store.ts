import { create } from 'zustand';

interface MinesState {
  isActive: boolean;
  currentBet: number;
  minesCount: number;
  multiplier: number;
  winAmount: number;
  actions: {
    setBet: (val: number) => void;
    setMinesCount: (val: number) => void;
    startGame: () => void;
    updateProgress: (multiplier: number) => void;
    endGame: (winAmount?: number) => void;
    increaseBet: () => void;
    decreaseBet: () => void;
    playSound: (sound: 'click' | 'reveal' | 'bust' | 'cashout' | 'start') => void;
  };
  lastSound: { type: string; timestamp: number } | null;
}

export const useMinesStore = create<MinesState>((set, get) => ({
  isActive: false,
  currentBet: 100,
  minesCount: 3,
  multiplier: 1.0,
  winAmount: 0,
  actions: {
    setBet: (val) => set({ currentBet: val }),
    setMinesCount: (val) => set({ minesCount: val }),
    startGame: () => set({ isActive: true, multiplier: 1.0, winAmount: 0 }),
    updateProgress: (multiplier) => set({ multiplier }),
    endGame: (winAmount = 0) => set({ isActive: false, winAmount }),
    increaseBet: () => {
      const { currentBet, isActive } = get();
      if (isActive) return;
      set({ currentBet: Math.min(currentBet + 100, 5000) });
    },
    decreaseBet: () => {
      const { currentBet, isActive } = get();
      if (isActive) return;
      set({ currentBet: Math.max(currentBet - 100, 100) });
    },
    playSound: (type) => set({ lastSound: { type, timestamp: Date.now() } })
  },
  lastSound: null
}));
