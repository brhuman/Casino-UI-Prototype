import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Play, RotateCcw } from 'lucide-react';
import { GameButton } from '@/components/ui/GameButton';
import { useGameStore } from '@/store/useGameStore';
import { useUserStore } from '@/store/useUserStore';

/**
 * Minimal UI harness mirroring slot spin controls (same stores as PixiBridge, no PIXI).
 * Validates user click → Zustand updates across game + user stores.
 */
function SlotSpinHarness() {
  const balance = useUserStore((s) => s.balance);
  const currentBet = useGameStore((s) => s.currentBet);
  const isSpinning = useGameStore((s) => s.isSpinning);
  const placeBet = useGameStore((s) => s.actions.placeBet);
  const canSpin = !isSpinning && balance >= currentBet;

  return (
    <>
      <span data-testid="balance">{balance}</span>
      <GameButton
        onClick={placeBet}
        disabled={!canSpin}
        isLoading={isSpinning}
        loadingIcon={RotateCcw}
        icon={Play}
        label={isSpinning ? 'SPINNING...' : 'SPIN'}
      />
    </>
  );
}

describe('Slot spin flow (integration)', () => {
  beforeEach(() => {
    useUserStore.setState({
      balance: 10000,
      totalBets: 0,
      totalWinAmount: 0,
      biggestWin: 0,
      level: 1,
      xp: 250,
      maxXp: 1000,
      achievements: [],
      username: 'Guest',
    });
    useGameStore.setState({
      currentBet: 100,
      isSpinning: false,
      lastWinAmount: 0,
      winningLine: [],
      matrix: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],
    });
  });

  it('deducts the bet from balance and disables the spin control while spinning', async () => {
    const user = userEvent.setup();
    render(<SlotSpinHarness />);

    expect(screen.getByTestId('balance')).toHaveTextContent('10000');
    await user.click(screen.getByRole('button', { name: /spin/i }));

    expect(screen.getByTestId('balance')).toHaveTextContent('9900');
    expect(useGameStore.getState().isSpinning).toBe(true);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
