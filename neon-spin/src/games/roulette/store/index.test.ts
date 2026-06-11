import { beforeEach, describe, expect, it } from 'vitest';
import { useRouletteStore } from '@/games/roulette/store';
import { useUserStore } from '@/store/useUserStore';

describe('useRouletteStore', () => {
  beforeEach(() => {
    useUserStore.setState({
      balance: 10000,
      totalBets: 0,
      totalWinAmount: 0,
      biggestWin: 0,
      xp: 0,
      level: 1,
      maxXp: 1000,
    });
    useRouletteStore.setState({
      isSpinning: false,
      lastResult: null,
      lastWin: 0,
      currentBet: 100,
      selectedBet: 'red',
    });
  });

  it('charges the stake exactly once', () => {
    expect(useRouletteStore.getState().actions.startSpin()).toBe(true);
    expect(useRouletteStore.getState().actions.startSpin()).toBe(false);
    expect(useUserStore.getState().balance).toBe(9900);
    expect(useUserStore.getState().totalBets).toBe(100);
  });

  it('credits a winning result and closes the round', () => {
    useRouletteStore.getState().actions.startSpin();
    useRouletteStore.getState().actions.settleSpin(1);
    expect(useUserStore.getState().balance).toBe(10100);
    expect(useRouletteStore.getState().lastWin).toBe(200);
    expect(useRouletteStore.getState().isSpinning).toBe(false);
  });

  it('does not credit a losing result', () => {
    useRouletteStore.getState().actions.startSpin();
    useRouletteStore.getState().actions.settleSpin(2);
    expect(useUserStore.getState().balance).toBe(9900);
    expect(useRouletteStore.getState().lastWin).toBe(0);
  });
});
