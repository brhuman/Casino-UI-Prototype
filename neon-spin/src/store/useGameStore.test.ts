import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './useGameStore';

describe('useGameStore', () => {
  beforeEach(() => {
    // Reset state before each test
    useGameStore.setState({
      balance: 10000,
      currentBet: 100,
      isSpinning: false,
      lastWinAmount: 0,
      matrix: [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
      ]
    });
  });

  it('should initialize with default values', () => {
    const state = useGameStore.getState();
    expect(state.balance).toBe(10000);
    expect(state.currentBet).toBe(100);
    expect(state.isSpinning).toBe(false);
  });

  it('should place bet and update balance', () => {
    useGameStore.getState().actions.placeBet();
    const state = useGameStore.getState();
    expect(state.balance).toBe(9900);
    expect(state.isSpinning).toBe(true);
  });

  it('should not place bet if balance is insufficient', () => {
    useGameStore.setState({ balance: 50 });
    useGameStore.getState().actions.placeBet();
    const state = useGameStore.getState();
    expect(state.balance).toBe(50);
    expect(state.isSpinning).toBe(false);
  });

  it('should set result and update balance with win', () => {
    useGameStore.getState().actions.placeBet(); // balance 9900, isSpinning true
    
    // Win 500
    const mockMatrix = [[1],[1],[1],[1],[1]];
    useGameStore.getState().actions.setResult(mockMatrix, 500);

    const state = useGameStore.getState();
    expect(state.isSpinning).toBe(false);
    expect(state.balance).toBe(10400);
    expect(state.lastWinAmount).toBe(500);
    expect(state.matrix).toEqual(mockMatrix);
  });
});
