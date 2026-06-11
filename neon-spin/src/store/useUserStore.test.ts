import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '@/store/useUserStore';

describe('useUserStore Logic', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUserStore.setState({
      balance: 10000,
      totalBets: 0,
      totalWinAmount: 0,
      biggestWin: 0,
      level: 1,
      xp: 250,
      maxXp: 1000,
      achievements: [],
      username: 'Guest'
    });
  });

  it('инициализируется с корректными значениями по умолчанию', () => {
    const state = useUserStore.getState();
    expect(state.balance).toBe(10000);
    expect(state.level).toBe(1);
    expect(state.username).toBe('Guest');
  });

  it('корректно уменьшает баланс и увеличивает общую сумму ставок', () => {
    const { actions } = useUserStore.getState();
    expect(actions.placeBet(500)).toBe(true);
    
    const state = useUserStore.getState();
    expect(state.balance).toBe(9500);
    expect(state.totalBets).toBe(500);
  });

  it('корректно увеличивает баланс и фиксирует самый крупный выигрыш', () => {
    const { actions } = useUserStore.getState();
    actions.creditWin(2500);
    
    const state = useUserStore.getState();
    expect(state.balance).toBe(12500);
    expect(state.biggestWin).toBe(2500);
    expect(state.totalWinAmount).toBe(2500);
  });

  it('автоматически повышает уровень при достижении порога выигрышей', () => {
    const { actions } = useUserStore.getState();
    
    // Стартовый порог 1000. Выигрыш 1500 должен повысить уровень.
    actions.creditWin(1500);
    
    const state = useUserStore.getState();
    expect(state.level).toBe(2);
    expect(state.maxXp).toBe(2000); // Следующий порог по паттерну 1-2-5
  });

  it('открывает достижение "HIGH_ROLLER" при крупной ставке', () => {
    const { actions } = useUserStore.getState();
    actions.placeBet(2000);
    
    const state = useUserStore.getState();
    expect(state.achievements).toContain('HIGH_ROLLER');
  });

  it('открывает достижение "VIP_ELITE" при активации VIP-статуса', () => {
    const { actions } = useUserStore.getState();
    actions.setVip(true);
    
    const state = useUserStore.getState();
    expect(state.isVip).toBe(true);
    expect(state.achievements).toContain('VIP_ELITE');
  });

  it('не позволяет баланс упасть ниже нуля', () => {
    const { actions } = useUserStore.getState();
    useUserStore.setState({ balance: 1000 });
    expect(actions.placeBet(1500)).toBe(false);
    const state = useUserStore.getState();
    expect(state.balance).toBe(1000);
  });

  it('увеличивает XP и остается на уровне при недостатке XP', () => {
    const { actions } = useUserStore.getState();
    actions.creditWin(100);
    const state = useUserStore.getState();
    expect(state.level).toBe(1);
  });

  it('позволяет менять юзернейм', () => {
    const { actions } = useUserStore.getState();
    actions.setUsername('TestPlayer');
    const state = useUserStore.getState();
    expect(state.username).toBe('TestPlayer');
  });

  it('сохраняет биг вин при последовательных выигрышах', () => {
    const { actions } = useUserStore.getState();
    actions.creditWin(500);
    expect(useUserStore.getState().biggestWin).toBe(500);
    actions.creditWin(200);
    expect(useUserStore.getState().biggestWin).toBe(500);
    actions.creditWin(800);
    expect(useUserStore.getState().biggestWin).toBe(800);
  });

  it('не считает бонус выигрышем', () => {
    useUserStore.getState().actions.creditBonus(5000);
    const state = useUserStore.getState();
    expect(state.balance).toBe(15000);
    expect(state.totalWinAmount).toBe(0);
    expect(state.biggestWin).toBe(0);
  });

  it('начисляет награду миссии отдельно от статистики выигрышей', () => {
    useUserStore.getState().actions.claimQuestReward(500, 100);
    const state = useUserStore.getState();
    expect(state.balance).toBe(10500);
    expect(state.xp).toBe(350);
    expect(state.totalWinAmount).toBe(0);
  });
});
