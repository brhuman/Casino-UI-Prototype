import { useUserStore } from '@/store/useUserStore';
import type { MinesClientSocket } from '@/games/mines/Engine/minesSocket';

type MinesEvent = 'MINES_START' | 'MINES_PICK' | 'MINES_CASHOUT';

interface MinesGameSession {
  mines: number;
  bet: number;
  multiplier: number;
  grid: number[];
  picked: Set<number>;
}

class FakeMinesSocket implements MinesClientSocket {
  private listeners = new Map<string, Set<(data: unknown) => void>>();
  private pendingTimers = new Set<ReturnType<typeof setTimeout>>();
  private game: MinesGameSession | null = null;

  on(event: string, callback: (data: unknown) => void) {
    const callbacks = this.listeners.get(event) ?? new Set();
    callbacks.add(callback);
    this.listeners.set(event, callbacks);
  }

  off(event: string, callback?: (data: unknown) => void) {
    if (!callback) {
      this.listeners.delete(event);
      return;
    }
    const callbacks = this.listeners.get(event);
    callbacks?.delete(callback);
    if (callbacks?.size === 0) this.listeners.delete(event);
  }

  emit(event: string, payload?: unknown) {
    if (!this.isMinesEvent(event)) return;
    const timer = setTimeout(() => {
      this.pendingTimers.delete(timer);
      this.respond(event, payload);
    }, 250);
    this.pendingTimers.add(timer);
  }

  cancelPending() {
    this.pendingTimers.forEach(clearTimeout);
    this.pendingTimers.clear();
  }

  resetMinesGame() {
    this.cancelPending();
    this.game = null;
  }

  private isMinesEvent(event: string): event is MinesEvent {
    return event === 'MINES_START' || event === 'MINES_PICK' || event === 'MINES_CASHOUT';
  }

  private respond(event: MinesEvent, payload: unknown) {
    const user = useUserStore.getState();

    if (event === 'MINES_START') {
      const { bet, minesCount } = payload as { bet: number; minesCount: number };
      const normalizedMinesCount = Math.min(Math.max(Math.trunc(minesCount), 1), 24);
      if (!user.actions.placeBet(bet)) {
        this.trigger('MINES_ERROR', { message: 'Insufficient balance' });
        return;
      }

      const grid = Array<number>(25).fill(0);
      const indices = Array.from({ length: 25 }, (_, index) => index);
      for (let index = indices.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [indices[index], indices[swapIndex]] = [indices[swapIndex], indices[index]];
      }
      indices.slice(0, normalizedMinesCount).forEach((index) => {
        grid[index] = 1;
      });

      this.game = {
        mines: normalizedMinesCount,
        bet,
        multiplier: 1,
        grid,
        picked: new Set(),
      };
      this.trigger('MINES_STARTED', { success: true, balance: useUserStore.getState().balance });
      return;
    }

    if (!this.game) {
      this.trigger('MINES_ERROR', { message: 'No active round' });
      return;
    }

    if (event === 'MINES_PICK') {
      const { index } = payload as { index: number };
      if (!Number.isInteger(index) || index < 0 || index >= this.game.grid.length) return;
      if (this.game.picked.has(index)) {
        this.trigger('MINES_ERROR', { message: 'Cell already revealed' });
        return;
      }

      this.game.picked.add(index);
      if (this.game.grid[index] === 1) {
        this.trigger('MINES_RESULT', { status: 'BUST', index, grid: this.game.grid });
        this.game = null;
        return;
      }

      const baseRisk = this.game.mines / 25;
      this.game.multiplier += baseRisk * (1 + this.game.picked.size * 0.1);
      this.trigger('MINES_RESULT', {
        status: 'SAFE',
        index,
        newMultiplier: Number(this.game.multiplier.toFixed(2)),
      });
      return;
    }

    const winAmount = Number((this.game.bet * this.game.multiplier).toFixed(2));
    user.actions.creditWin(winAmount);
    this.trigger('MINES_CASHOUT_RESULT', {
      winAmount,
      grid: this.game.grid,
      balance: useUserStore.getState().balance,
    });
    this.game = null;
  }

  private trigger(event: string, data: unknown) {
    this.listeners.get(event)?.forEach((callback) => callback(data));
  }
}

export const minesSocket = new FakeMinesSocket();
