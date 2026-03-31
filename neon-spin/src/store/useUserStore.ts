import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  token: string | null;
  userId: string | null;
  username: string;
  balance: number;
  actions: {
    login: (token: string, userId: string, username: string, balance: number) => void;
    logout: () => void;
    updateBalance: (amount: number) => void;
  };
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: null,
      userId: null,
      username: 'Guest',
      balance: 10000,
      actions: {
        login: (token, userId, username, balance) => set({ token, userId, username, balance }),
        logout: () => set({ token: null, userId: null, username: 'Guest' }),

        updateBalance: (amount) => set({ balance: get().balance + amount }),
      },
    }),
    {
      name: 'casino-user-session',
      partialize: (state) => ({ 
        token: state.token, 
        userId: state.userId,
        username: state.username
      }),
    }
  )
);
