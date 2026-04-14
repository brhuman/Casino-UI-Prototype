import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/useGameStore';
import { useUserStore } from '@/store/useUserStore';

describe('useGameStore', () => {
  beforeEach(() => {
    useUserStore.setState({ balance: 10000 });
    useGameStore.setState({
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
    const userBalance = useUserStore.getState().balance;
    expect(userBalance).toBe(10000);
    expect(state.currentBet).toBe(100);
    expect(state.isSpinning).toBe(false);
  });

  it('should place bet and update balance', () => {
    useGameStore.getState().actions.placeBet();
    const userBalance = useUserStore.getState().balance;
    expect(userBalance).toBe(9900);
    expect(useGameStore.getState().isSpinning).toBe(true);
  });

  it('should not place bet if balance is insufficient', () => {
    useUserStore.setState({ balance: 50 });
    useGameStore.getState().actions.placeBet();
    expect(useUserStore.getState().balance).toBe(50);
    expect(useGameStore.getState().isSpinning).toBe(false);
  });

  it('should set result and update balance with win', () => {
    useGameStore.getState().actions.placeBet();
    
    const mockMatrix = [[1],[1],[1],[1],[1]];
    useGameStore.getState().actions.setResult(mockMatrix, 500, []);

    const state = useGameStore.getState();
    const userBalance = useUserStore.getState().balance;
    expect(state.isSpinning).toBe(false);
    expect(userBalance).toBe(10400);
    expect(state.lastWinAmount).toBe(500);
    expect(state.matrix).toEqual(mockMatrix);
  });
});
