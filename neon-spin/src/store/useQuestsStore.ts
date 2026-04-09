import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type QuestType = 'play_slots' | 'play_mines' | 'play_roulette' | 'win_any';

export interface Quest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  target: number;
  progress: number;
  rewardXP: number;
  rewardCash: number;
  completed: boolean;
  claimed: boolean;
}

const DAILY_QUESTS: Quest[] = [
  {
    id: 'daily_slots',
    type: 'play_slots',
    title: 'Slot Machine Enthusiast',
    description: 'Spin the slots 10 times',
    target: 10,
    progress: 0,
    rewardXP: 100,
    rewardCash: 500,
    completed: false,
    claimed: false,
  },
  {
    id: 'daily_mines',
    type: 'play_mines',
    title: 'Mine Sweeper',
    description: 'Play 5 rounds of Cyber Mines',
    target: 5,
    progress: 0,
    rewardXP: 150,
    rewardCash: 750,
    completed: false,
    claimed: false,
  },
  {
    id: 'daily_roulette',
    type: 'play_roulette',
    title: 'High Roller',
    description: 'Spin the neon roulette 5 times',
    target: 5,
    progress: 0,
    rewardXP: 200,
    rewardCash: 1000,
    completed: false,
    claimed: false,
  }
];

interface QuestsState {
  quests: Quest[];
  lastResetDate: string;
  actions: {
    progressQuest: (type: QuestType, amount?: number) => void;
    claimReward: (questId: string) => { xp: number; cash: number } | null;
    checkDailyReset: () => void;
  };
}

export const useQuestsStore = create<QuestsState>()(
  persist(
    (set, get) => ({
      quests: [...DAILY_QUESTS],
      lastResetDate: new Date().toDateString(),
      actions: {
        progressQuest: (type, amount = 1) => {
          set((state) => {
            const newQuests = state.quests.map(quest => {
              if (quest.type === type && !quest.completed) {
                const newProgress = Math.min(quest.progress + amount, quest.target);
                return {
                  ...quest,
                  progress: newProgress,
                  completed: newProgress >= quest.target
                };
              }
              return quest;
            });
            return { quests: newQuests };
          });
        },
        claimReward: (questId) => {
          let reward = null;
          set((state) => {
            const quest = state.quests.find(q => q.id === questId);
            if (quest && quest.completed && !quest.claimed) {
              reward = { xp: quest.rewardXP, cash: quest.rewardCash };
              return {
                quests: state.quests.map(q => 
                  q.id === questId ? { ...q, claimed: true } : q
                )
              };
            }
            return state;
          });
          return reward;
        },
        checkDailyReset: () => {
          const today = new Date().toDateString();
          if (get().lastResetDate !== today) {
            set({ quests: [...DAILY_QUESTS], lastResetDate: today });
          }
        }
      }
    }),
    {
      name: 'neon-spin-quests'
    }
  )
);
