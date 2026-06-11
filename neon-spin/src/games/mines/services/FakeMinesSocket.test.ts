import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { minesSocket } from '@/games/mines/services/FakeMinesSocket';
import { useUserStore } from '@/store/useUserStore';

describe('FakeMinesSocket', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    minesSocket.resetMinesGame();
    useUserStore.setState({ balance: 1000, totalBets: 0, totalWinAmount: 0 });
  });

  afterEach(() => {
    minesSocket.resetMinesGame();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('cancels delayed operations', async () => {
    const started = vi.fn();
    minesSocket.on('MINES_STARTED', started);
    minesSocket.emit('MINES_START', { bet: 100, minesCount: 3 });
    minesSocket.cancelPending();
    await vi.runAllTimersAsync();
    expect(started).not.toHaveBeenCalled();
    expect(useUserStore.getState().balance).toBe(1000);
    minesSocket.off('MINES_STARTED', started);
  });

  it('does not reward the same safe cell twice', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const results: unknown[] = [];
    const errors: unknown[] = [];
    const onResult = (data: unknown) => results.push(data);
    const onError = (data: unknown) => errors.push(data);
    minesSocket.on('MINES_RESULT', onResult);
    minesSocket.on('MINES_ERROR', onError);

    minesSocket.emit('MINES_START', { bet: 100, minesCount: 1 });
    await vi.runAllTimersAsync();
    minesSocket.emit('MINES_PICK', { index: 0 });
    await vi.runAllTimersAsync();
    minesSocket.emit('MINES_PICK', { index: 0 });
    await vi.runAllTimersAsync();

    expect(results).toHaveLength(1);
    expect(errors).toHaveLength(1);
    minesSocket.off('MINES_RESULT', onResult);
    minesSocket.off('MINES_ERROR', onError);
  });
});
