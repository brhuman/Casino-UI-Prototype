import { create } from 'zustand';

export interface Win {
  id: number;
  player: string;
  game: string;
  amount: string;
  time: string;
}

interface LiveWinsState {
  wins: Win[];
  actions: {
    addWin: (win: Win) => void;
  };
}

export const useLiveWinsStore = create<LiveWinsState>((set) => ({
  wins: Array.from({ length: 5 }, (_, i) => ({
    id: i,
    player: `Player_${Math.floor(Math.random() * 9000 + 1000)}`,
    game: ['Neon Spin', 'Neon Mines', 'Roulette'][Math.floor(Math.random() * 3)],
    amount: (Math.random() * 500 + 10).toFixed(2),
    time: 'Just now'
  })),
  actions: {
    addWin: (win) => set((state) => ({
      wins: [win, ...state.wins.slice(0, 4)]
    })),
  }
}));
