import { describe, it, expect, beforeEach } from 'vitest';
import { useMinesStore } from './store';

describe('Mines Terminal Logic Test', () => {
  beforeEach(() => {

    useMinesStore.setState({
      isActive: false,
      currentBet: 100,
      minesCount: 3,
      multiplier: 1.0,
      winAmount: 0
    });
  });

  it('should allow setting bet and mines count', () => {
    const store = useMinesStore.getState();
    store.actions.setBet(500);
    store.actions.setMinesCount(5);
    
    expect(useMinesStore.getState().currentBet).toBe(500);
    expect(useMinesStore.getState().minesCount).toBe(5);
  });

  it('should start game and update active state', () => {
    useMinesStore.getState().actions.startGame();
    expect(useMinesStore.getState().isActive).toBe(true);
    expect(useMinesStore.getState().multiplier).toBe(1.0);
  });

  it('should update progress on safe pick', () => {
    useMinesStore.getState().actions.startGame();
    useMinesStore.getState().actions.updateProgress(1.45);
    expect(useMinesStore.getState().multiplier).toBe(1.45);
  });

  it('should end game on bust or cashout', () => {
    useMinesStore.getState().actions.startGame();
    useMinesStore.getState().actions.endGame(250);
    expect(useMinesStore.getState().isActive).toBe(false);
    expect(useMinesStore.getState().winAmount).toBe(250);
  });
});
