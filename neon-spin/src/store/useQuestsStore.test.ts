import { describe, it, expect, beforeEach } from 'vitest';
import { useQuestsStore } from '@/store/useQuestsStore';

describe('useQuestsStore', () => {
  beforeEach(() => {
    useQuestsStore.setState({
      quests: [
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
      ],
      lastResetDate: new Date().toDateString(),
    });
  });

  it('should progress quest and mark completed when target reached', () => {
    const store = useQuestsStore.getState();
    store.actions.progressQuest('play_slots', 10);
    const quest = useQuestsStore.getState().quests.find(q => q.id === 'daily_slots');
    expect(quest?.progress).toBe(10);
    expect(quest?.completed).toBe(true);
  });

  it('should not progress already completed quest', () => {
    const store = useQuestsStore.getState();
    store.actions.progressQuest('play_slots', 10);
    store.actions.progressQuest('play_slots', 5);
    const quest = useQuestsStore.getState().quests.find(q => q.id === 'daily_slots');
    expect(quest?.progress).toBe(10);
  });

  it('should claim reward only if completed and not claimed', () => {
    const store = useQuestsStore.getState();
    store.actions.progressQuest('play_mines', 5);
    const reward = store.actions.claimReward('daily_mines');
    expect(reward).toEqual({ xp: 150, cash: 750 });
    const quest = useQuestsStore.getState().quests.find(q => q.id === 'daily_mines');
    expect(quest?.claimed).toBe(true);
  });

  it('should not claim reward if not completed', () => {
    const store = useQuestsStore.getState();
    const reward = store.actions.claimReward('daily_slots');
    expect(reward).toBeNull();
  });

  it('should not claim reward twice', () => {
    const store = useQuestsStore.getState();
    store.actions.progressQuest('play_slots', 10);
    const reward1 = store.actions.claimReward('daily_slots');
    const reward2 = store.actions.claimReward('daily_slots');
    expect(reward1).toEqual({ xp: 100, cash: 500 });
    expect(reward2).toBeNull();
  });

  it('should not reset if date is same', () => {
    const store = useQuestsStore.getState();
    store.actions.progressQuest('play_mines', 3);
    const quest1 = useQuestsStore.getState().quests.find(q => q.id === 'daily_mines');
    store.actions.checkDailyReset();
    const quest2 = useQuestsStore.getState().quests.find(q => q.id === 'daily_mines');
    expect(quest1?.progress).toBe(quest2?.progress);
  });

  it('should reset quests on new day', () => {
    const store = useQuestsStore.getState();
    store.actions.progressQuest('play_slots', 10);
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    useQuestsStore.setState({ lastResetDate: yesterday });
    store.actions.checkDailyReset();
    const quest = useQuestsStore.getState().quests.find(q => q.id === 'daily_slots');
    expect(quest?.progress).toBe(0);
    expect(quest?.claimed).toBe(false);
    expect(quest?.completed).toBe(false);
  });
});
