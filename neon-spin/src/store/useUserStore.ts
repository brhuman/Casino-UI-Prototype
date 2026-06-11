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
    placeBet: (amount: number) => boolean;
    creditWin: (amount: number) => void;
    creditBonus: (amount: number) => void;
    claimQuestReward: (cash: number, xp: number) => void;
    setAvatar: (url: string) => void;
    addCustomAvatar: (url: string) => void;
    setVip: (status: boolean) => void;
    setUsername: (name: string) => void;
  };
}

const getLevelProgress = (xp: number) => {
  const thresholds = [1000, 2000, 5000];
  let level = 1;
  let maxXp = thresholds[0];

  while (xp >= maxXp) {
    level += 1;
    const thresholdIndex = level - 1;
    const magnitude = Math.floor(thresholdIndex / thresholds.length);
    maxXp = thresholds[thresholdIndex % thresholds.length] * Math.pow(10, magnitude);
  }

  return { level, maxXp };
};

const appendBalanceHistory = (history: UserState['balanceHistory'], amount: number) => [
  ...history,
  {
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    amount,
  },
].slice(-20);

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

        placeBet: (amount) => {
          if (!Number.isFinite(amount) || amount <= 0) return false;

          let accepted = false;
          set((state) => {
            if (state.balance < amount) return state;

            accepted = true;
            const balance = state.balance - amount;
            const achievements = [...state.achievements];
            if (amount > 1000 && !achievements.includes('HIGH_ROLLER')) {
              achievements.push('HIGH_ROLLER');
            }

            return {
              balance,
              totalBets: state.totalBets + amount,
              achievements,
              balanceHistory: appendBalanceHistory(state.balanceHistory, balance),
            };
          });
          return accepted;
        },
        creditWin: (amount) => {
          if (!Number.isFinite(amount) || amount <= 0) return;

          set((state) => {
            const balance = state.balance + amount;
            const totalWinAmount = state.totalWinAmount + amount;
            const xp = state.xp + amount;
            const achievements = [...state.achievements];
            if (totalWinAmount >= 50000 && !achievements.includes('ULTIMATE_WHALE')) {
              achievements.push('ULTIMATE_WHALE');
            }

            return {
              balance,
              totalWinAmount,
              biggestWin: Math.max(state.biggestWin, amount),
              xp,
              ...getLevelProgress(xp),
              achievements,
              balanceHistory: appendBalanceHistory(state.balanceHistory, balance),
            };
          });
        },
        creditBonus: (amount) => {
          if (!Number.isFinite(amount) || amount <= 0) return;

          set((state) => {
            const balance = state.balance + amount;
            const achievements = [...state.achievements];
            if (balance > 20000 && !achievements.includes('BONUS_COLLECTOR')) {
              achievements.push('BONUS_COLLECTOR');
            }

            return {
              balance,
              achievements,
              balanceHistory: appendBalanceHistory(state.balanceHistory, balance),
            };
          });
        },
        claimQuestReward: (cash, rewardXp) => {
          if (cash < 0 || rewardXp < 0) return;

          set((state) => {
            const balance = state.balance + cash;
            const xp = state.xp + rewardXp;
            return {
              balance,
              xp,
              ...getLevelProgress(xp),
              balanceHistory: appendBalanceHistory(state.balanceHistory, balance),
            };
          });
        },

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
