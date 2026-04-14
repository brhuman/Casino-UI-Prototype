import { describe, it, expect, beforeEach } from 'vitest';
import { useMinesStore } from '@/games/mines/store';

describe('useMinesStore', () => {
  beforeEach(() => {
    useMinesStore.setState({
      isActive: false,
      currentBet: 100,
      minesCount: 3,
      multiplier: 1.0,
      winAmount: 0,
    });
  });

  it('should have default state', () => {
    const state = useMinesStore.getState();
    expect(state.isActive).toBe(false);
    expect(state.currentBet).toBe(100);
    expect(state.minesCount).toBe(3);
    expect(state.multiplier).toBe(1.0);
    expect(state.winAmount).toBe(0);
  });

  it('should set bet', () => {
    useMinesStore.getState().actions.setBet(250);
    expect(useMinesStore.getState().currentBet).toBe(250);
  });

  it('should set mines count', () => {
    useMinesStore.getState().actions.setMinesCount(5);
    expect(useMinesStore.getState().minesCount).toBe(5);
  });

  it('should start game', () => {
    useMinesStore.setState({ multiplier: 2.5, winAmount: 500 });

    useMinesStore.getState().actions.startGame();
    const state = useMinesStore.getState();
    expect(state.isActive).toBe(true);
    expect(state.multiplier).toBe(1.0);
    expect(state.winAmount).toBe(0);
  });

  it('should update progress', () => {
    useMinesStore.getState().actions.updateProgress(1.5);
    expect(useMinesStore.getState().multiplier).toBe(1.5);
  });

  it('should end game', () => {
    useMinesStore.setState({ isActive: true });
    
    useMinesStore.getState().actions.endGame(150);
    const state = useMinesStore.getState();
    expect(state.isActive).toBe(false);
    expect(state.winAmount).toBe(150);
  });

  it('should end game with default winAmount 0', () => {
    useMinesStore.setState({ isActive: true });
    
    useMinesStore.getState().actions.endGame();
    const state = useMinesStore.getState();
    expect(state.isActive).toBe(false);
    expect(state.winAmount).toBe(0);
  });
});
