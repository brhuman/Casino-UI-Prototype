import { create } from 'zustand';
import { useQuestsStore } from '@/store/useQuestsStore';

interface MinesState {
  phase: 'idle' | 'starting' | 'active' | 'settling';
  isActive: boolean;
  currentBet: number;
  minesCount: number;
  multiplier: number;
  winAmount: number;
  actions: {
    setBet: (val: number) => void;
    setMinesCount: (val: number) => void;
    requestStart: () => boolean;
    startGame: () => void;
    updateProgress: (multiplier: number) => void;
    requestCashout: () => boolean;
    endGame: (winAmount?: number) => void;
    abortGame: () => void;
    increaseBet: () => void;
    decreaseBet: () => void;
    playSound: (sound: 'click' | 'reveal' | 'bust' | 'cashout' | 'start') => void;
  };
  lastSound: { type: string; timestamp: number } | null;
}

export const useMinesStore = create<MinesState>((set, get) => ({
  phase: 'idle',
  isActive: false,
  currentBet: 100,
  minesCount: 3,
  multiplier: 1.0,
  winAmount: 0,
  actions: {
    setBet: (val) => {
      if (get().phase !== 'idle') return;
      set({ currentBet: Math.min(Math.max(Math.trunc(val), 100), 5000) });
    },
    setMinesCount: (val) => {
      if (get().phase !== 'idle') return;
      set({ minesCount: Math.min(Math.max(Math.trunc(val), 1), 24) });
    },
    requestStart: () => {
      if (get().phase !== 'idle') return false;
      set({ phase: 'starting', winAmount: 0, multiplier: 1 });
      return true;
    },
    startGame: () => {
      useQuestsStore.getState().actions.progressQuest('play_mines', 1);
      set({ phase: 'active', isActive: true, multiplier: 1.0, winAmount: 0 });
    },
    updateProgress: (multiplier) => set({ multiplier }),
    requestCashout: () => {
      if (get().phase !== 'active') return false;
      set({ phase: 'settling' });
      return true;
    },
    endGame: (winAmount = 0) => set({ phase: 'idle', isActive: false, winAmount }),
    abortGame: () => set({ phase: 'idle', isActive: false, multiplier: 1, winAmount: 0 }),
    increaseBet: () => {
      const { currentBet, phase } = get();
      if (phase !== 'idle') return;
      set({ currentBet: Math.min(currentBet + 100, 5000) });
    },
    decreaseBet: () => {
      const { currentBet, phase } = get();
      if (phase !== 'idle') return;
      set({ currentBet: Math.max(currentBet - 100, 100) });
    },
    playSound: (type) => set({ lastSound: { type, timestamp: Date.now() } })
  },
  lastSound: null
}));
