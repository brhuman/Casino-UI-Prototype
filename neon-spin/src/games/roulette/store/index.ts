import { create } from 'zustand';
import { useQuestsStore } from '@/store/useQuestsStore';
import { useUserStore } from '@/store/useUserStore';
import { calculateRoulettePayout, type RouletteBet } from '@/games/roulette/logic';

interface RouletteState {
  isSpinning: boolean;
  lastResult: number | null;
  lastWin: number;
  currentBet: number;
  selectedBet: RouletteBet;
  
  actions: {
    startSpin: () => boolean;
    settleSpin: (result: number) => void;
    setBet: (amount: number) => void;
    setSelectedBet: (bet: RouletteBet) => void;
  };
}

export const useRouletteStore = create<RouletteState>((set) => ({
  isSpinning: false,
  lastResult: null,
  lastWin: 0,
  currentBet: 100,
  selectedBet: 'red',
  
  actions: {
    startSpin: () => {
      const state = useRouletteStore.getState();
      if (state.isSpinning) return false;
      if (!useUserStore.getState().actions.placeBet(state.currentBet)) return false;

      useQuestsStore.getState().actions.progressQuest('play_roulette', 1);
      set({ isSpinning: true, lastWin: 0 });
      return true;
    },
    settleSpin: (result) => {
      const { currentBet, selectedBet, isSpinning } = useRouletteStore.getState();
      if (!isSpinning) return;

      const payout = calculateRoulettePayout(selectedBet, currentBet, result);
      if (payout > 0) useUserStore.getState().actions.creditWin(payout);
      set({ lastResult: result, lastWin: payout, isSpinning: false });
    },
    setBet: (amount) => {
      if (useRouletteStore.getState().isSpinning) return;
      set({ currentBet: Math.min(Math.max(Math.trunc(amount), 10), 1000) });
    },
    setSelectedBet: (selectedBet) => {
      if (useRouletteStore.getState().isSpinning) return;
      set({ selectedBet });
    },
  },
}));
