import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGameStore } from '@/store/useGameStore';
import { useUserStore } from '@/store/useUserStore';

// Mock PIXI and other dependencies
vi.mock('pixi.js', () => ({
  Application: vi.fn().mockImplementation(() => ({
    init: vi.fn(),
    stage: { addChild: vi.fn() },
    screen: { width: 1920, height: 1080 },
    destroy: vi.fn()
  })),
  Container: vi.fn().mockImplementation(() => ({
    addChild: vi.fn(),
    addChildAt: vi.fn(),
    removeChild: vi.fn(),
    mask: null
  })),
  Graphics: vi.fn().mockImplementation(() => ({
    roundRect: vi.fn().mockReturnThis(),
    fill: vi.fn().mockReturnThis(),
    stroke: vi.fn().mockReturnThis(),
    rect: vi.fn().mockReturnThis(),
    circle: vi.fn().mockReturnThis(),
    addChild: vi.fn()
  })),
  Text: vi.fn(),
  TextStyle: vi.fn(),
  Rectangle: vi.fn()
}));

// Mock GSAP to execute onComplete immediately
vi.mock('gsap', () => ({
  default: {
    to: (_obj: any, params: any) => {
      if (params.onComplete) params.onComplete();
      return { kill: vi.fn() };
    }
  }
}));

describe('SlotMachine Deep Logic', () => {
  beforeEach(() => {
    useUserStore.setState({ balance: 10000 });
    useGameStore.setState({
      currentBet: 100,
      isSpinning: false,
      lastWinAmount: 0
    });
  });

  it('should correctly handle a full spin cycle', async () => {
    const { actions } = useGameStore.getState();
    
    // 1. Place Bet
    actions.placeBet();
    expect(useUserStore.getState().balance).toBe(9900);
    expect(useGameStore.getState().isSpinning).toBe(true);

    // 2. Simulate Result (Wait for animation would be here in real app)
    const mockMatrix = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
    const winAmount = 500;
    
    actions.setResult(mockMatrix, winAmount, []);
    
    // 3. Verify Final State
    expect(useGameStore.getState().isSpinning).toBe(false);
    expect(useUserStore.getState().balance).toBe(10400); // 9900 + 500
    expect(useGameStore.getState().lastWinAmount).toBe(500);
  });

  it('should prevent multiple spins simultaneously', () => {
    const { actions } = useGameStore.getState();
    
    actions.placeBet();
    const balanceAfterFirst = useUserStore.getState().balance;
    
    // Try to place another bet while spinning
    actions.placeBet();
    expect(useUserStore.getState().balance).toBe(balanceAfterFirst);
    expect(useGameStore.getState().isSpinning).toBe(true);
  });

  it('should prevent spin if balance is too low', () => {
    useUserStore.setState({ balance: 50 });
    useGameStore.setState({ currentBet: 100 });
    
    const { actions } = useGameStore.getState();
    actions.placeBet();
    
    expect(useUserStore.getState().balance).toBe(50);
    expect(useGameStore.getState().isSpinning).toBe(false);
  });
});
