import { create } from 'zustand';
import { DUMMY_NICKNAMES, PRESET_AVATARS } from '../constants/dummyData';

export interface Win {
  id: number;
  player: string;
  game: string;
  amount: string;
  multiplier?: string;
  avatar?: string;
  isPremium?: boolean;
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
  wins: Array.from({ length: 6 }, (_, i) => {
    const hasAvatar = Math.random() > 0.4;
    const isPremium = Math.random() > 0.7;
    return {
      id: i,
      player: DUMMY_NICKNAMES[Math.floor(Math.random() * DUMMY_NICKNAMES.length)],
      game: ['Neon Spin', 'Mines', 'Roulette'][Math.floor(Math.random() * 3)],
      amount: (Math.random() * 500 + 10).toFixed(2),
      multiplier: `${(Math.random() * 10 + 1.1).toFixed(1)}x`,
      avatar: hasAvatar ? PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)] : undefined,
      isPremium,
      time: 'JUST NOW'
    };
  }),
  registrations: Array.from({ length: 6 }, (_, i) => ({
    id: i + 100,
    player: DUMMY_NICKNAMES[Math.floor(Math.random() * DUMMY_NICKNAMES.length)],
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
