import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  token: string | null;
  userId: string | null;
  username: string;
  balance: number;
  totalBets: number;
  totalWinAmount: number;
  biggestWin: number;
  globalVolume: number;
  selectedAvatar: string | null;
  actions: {
    login: (token: string, userId: string, username: string, balance: number) => void;
    logout: () => void;
    updateBalance: (amount: number) => void;
    setGlobalVolume: (volume: number) => void;
    setAvatar: (url: string) => void;
  };
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      username: 'Guest',
      balance: 10000,
      totalBets: 0,
      totalWinAmount: 0,
      biggestWin: 0,
      globalVolume: 0.3,
      selectedAvatar: null,
      actions: {
        login: (token, userId, username, balance) => set({ token, userId, username, balance }),
        logout: () => set({ token: null, userId: null, username: 'Guest' }),

        updateBalance: (amount) => set((state) => {
          const updates: Partial<UserState> = { balance: state.balance + amount };
          if (amount < 0) {
            updates.totalBets = state.totalBets + Math.abs(amount);
          } else if (amount > 0) {
            updates.totalWinAmount = state.totalWinAmount + amount;
            if (amount > state.biggestWin) {
              updates.biggestWin = amount;
            }
          }
          return updates;
        }),

        setGlobalVolume: (volume) => set({ globalVolume: volume }),
        setAvatar: (url) => set({ selectedAvatar: url }),
      },
    }),
    {
      name: 'casino-user-session',
      partialize: (state) => ({ 
        token: state.token, 
        userId: state.userId,
        username: state.username,
        balance: state.balance,
        totalBets: state.totalBets,
        totalWinAmount: state.totalWinAmount,
        biggestWin: state.biggestWin,
        globalVolume: state.globalVolume,
        selectedAvatar: state.selectedAvatar
      }),
    }
  )
);
