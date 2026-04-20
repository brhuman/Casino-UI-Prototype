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
  selectedAvatar: string | null;
  customAvatars: string[];
  isVip: boolean;
  level: number;
  xp: number;
  maxXp: number;
  achievements: string[];
  balanceHistory: { time: string; amount: number }[];
  actions: {
    login: (token: string, userId: string, username: string, balance: number) => void;
    logout: () => void;
    updateBalance: (amount: number) => void;
    setAvatar: (url: string) => void;
    addCustomAvatar: (url: string) => void;
    setVip: (status: boolean) => void;
    setUsername: (name: string) => void;
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
      selectedAvatar: null,
      customAvatars: [],
      isVip: false,
      level: 1,
      xp: 250,
      maxXp: 1000,
      achievements: [],
      balanceHistory: [{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), amount: 10000 }],
      actions: {
        login: (token: string, userId: string, username: string, balance: number) => set({ token, userId, username, balance }),
        logout: () => set({ token: null, userId: null, username: 'Guest' }),

        updateBalance: (amount) => set((state) => {
          let newTotalWinAmount = state.totalWinAmount;
          let newTotalBets = state.totalBets;
          const newBalance = state.balance + amount;
          let newBiggestWin = state.biggestWin;

          if (amount < 0) {
            newTotalBets = state.totalBets + Math.abs(amount);
          } else if (amount > 0) {
            newTotalWinAmount = state.totalWinAmount + amount;
            if (amount > state.biggestWin) {
              newBiggestWin = amount;
            }
          }

          // Calculate Level and Next XP Threshold (1-2-5 pattern)
          // 1k, 2k, 5k, 10k, 20k, 50k, 100k...
          let lvl = 1;
          let currentMax = 1000;
          const multipliers = [1, 2, 5];
          
          while (newTotalWinAmount >= currentMax) {
            const mIdx = lvl % multipliers.length;
            const p = Math.floor(lvl / multipliers.length) + 3;
            currentMax = multipliers[mIdx] * Math.pow(10, p);
            lvl++;
          }

          // Achievement: High Roller (bet > 1000)
          const newAchievements = [...state.achievements];
          if (amount < -1000 && !newAchievements.includes('HIGH_ROLLER')) {
            newAchievements.push('HIGH_ROLLER');
          }
          
          // Achievement: Bonus Collector (simulated by total recharge/balance increase not from wins if we had more state, but for now let's use a threshold)
          if (newBalance > 20000 && !newAchievements.includes('BONUS_COLLECTOR')) {
            newAchievements.push('BONUS_COLLECTOR');
          }
          
          // Achievement: Ultimate Whale (Career payout)
          if (newTotalWinAmount >= 50000 && !newAchievements.includes('ULTIMATE_WHALE')) {
            newAchievements.push('ULTIMATE_WHALE');
          }

          // Update Balance History (Keep last 20 points)
          const newHistory = [
            ...state.balanceHistory,
            { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), amount: newBalance }
          ].slice(-20);

          return { 
            balance: newBalance,
            totalBets: newTotalBets,
            totalWinAmount: newTotalWinAmount,
            biggestWin: newBiggestWin,
            level: lvl,
            xp: newTotalWinAmount,
            maxXp: currentMax,
            achievements: newAchievements,
            balanceHistory: newHistory
          };
        }),

        setAvatar: (url: string) => set({ selectedAvatar: url }),
        addCustomAvatar: (url: string) => set((state) => ({ 
          customAvatars: [url, ...state.customAvatars].slice(0, 5), // Keep last 5 custom avatars
          selectedAvatar: url 
        })),
        setVip: (status: boolean) => set((state) => {
          const newAchievements = [...state.achievements];
          if (status && !newAchievements.includes('VIP_ELITE')) {
            newAchievements.push('VIP_ELITE');
          }
          return { isVip: status, achievements: newAchievements };
        }),
        setUsername: (username: string) => set({ username }),
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
        selectedAvatar: state.selectedAvatar,
        customAvatars: state.customAvatars,
        isVip: state.isVip,
        level: state.level,
        xp: state.xp,
        maxXp: state.maxXp,
        achievements: state.achievements,
        balanceHistory: state.balanceHistory
      }),
    }
  )
);
