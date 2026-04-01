import { create } from 'zustand';

export interface Win {
  id: number;
  player: string;
  game: string;
  amount: string;
  multiplier?: string;
  time: string;
}

export interface Registration {
  id: number;
  player: string;
  avatar?: string;
  time: string;
}

interface LiveWinsState {
  wins: Win[];
  registrations: Registration[];
  actions: {
    addWin: (win: Win) => void;
    addRegistration: (reg: Registration) => void;
  };
}

export const useLiveWinsStore = create<LiveWinsState>((set) => ({
  wins: Array.from({ length: 6 }, (_, i) => ({
    id: i,
    player: `PLAYER_${Math.floor(Math.random() * 9000 + 1000)}`,
    game: ['Neon Spin', 'Mines', 'Roulette'][Math.floor(Math.random() * 3)],
    amount: (Math.random() * 500 + 10).toFixed(2),
    multiplier: `${(Math.random() * 10 + 1.1).toFixed(1)}x`,
    time: 'JUST NOW'
  })),
  registrations: Array.from({ length: 6 }, (_, i) => ({
    id: i + 100,
    player: `NEW_USER_${Math.floor(Math.random() * 9000 + 1000)}`,
    time: 'MOMENTS AGO'
  })),
  actions: {
    addWin: (win) => set((state) => ({
      wins: [win, ...state.wins.slice(0, 5)]
    })),
    addRegistration: (reg) => set((state) => ({
      registrations: [reg, ...state.registrations.slice(0, 5)]
    })),
  }
}));
