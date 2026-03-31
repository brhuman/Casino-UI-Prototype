import { useUserStore } from '../store/useUserStore';

export type WsEvent = 'MINES_START' | 'MINES_PICK' | 'MINES_CASHOUT' | 'SLOT_SPIN';

class FakeSocket {
  private listeners: Record<string, ((data: unknown) => void)[]> = {};

  on(event: string, callback: (data: unknown) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event: string, callback?: (data: unknown) => void) {
    if (!this.listeners[event]) return;
    if (callback) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    } else {
      this.listeners[event] = [];
    }
  }

  emit(event: WsEvent, payload?: unknown) {
    console.log(`[WS UP] ${event}`, payload);
    // Fake latency wrapper
    setTimeout(() => this.simulateServerResponse(event, payload), 250);
  }

  // --- Fake Server-side State ---
  private currentMinesGame: {
     mines: number;
     bet: number;
     multiplier: number;
     grid: number[]; // 0 = safe, 1 = mine
     picked: number;
  } | null = null;

  private simulateServerResponse(event: WsEvent, payload: unknown) {
    const userStore = useUserStore.getState();

    switch (event) {
      case 'MINES_START': {
        const { bet, minesCount } = payload as { bet: number, minesCount: number };
        if (userStore.balance < bet) {
           return this.trigger('ERROR', { message: 'Insufficient balance' });
        }
        
        userStore.actions.updateBalance(-bet);

        // Generate 5x5 grid
        const grid = Array(25).fill(0);
        const maxMines = Math.min(minesCount, 24); // Can't have 25 mines in a 25-slot board otherwise you auto-lose
        
        const indices = Array.from({ length: 25 }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        for (let i = 0; i < maxMines; i++) {
          grid[indices[i]] = 1;
        }
        
        this.currentMinesGame = {
          mines: minesCount,
          bet,
          multiplier: 1.0,
          grid,
          picked: 0
        };

        this.trigger('MINES_STARTED', { success: true, balance: userStore.balance });
        break;
      }
      
      case 'MINES_PICK': {
        if (!this.currentMinesGame) return;
        const { index } = payload as { index: number };
        const isMine = this.currentMinesGame.grid[index] === 1;
        
        if (isMine) {
          this.trigger('MINES_RESULT', { 
            status: 'BUST', 
            grid: this.currentMinesGame.grid 
          });
          this.currentMinesGame = null;
        } else {
          this.currentMinesGame.picked++;
          // Base multiplier logic
          const baseRisk = this.currentMinesGame.mines / 25;
          this.currentMinesGame.multiplier += baseRisk * (1 + (this.currentMinesGame.picked * 0.1));
          
          this.trigger('MINES_RESULT', {
            status: 'SAFE',
            newMultiplier: parseFloat(this.currentMinesGame.multiplier.toFixed(2))
          });
        }
        break;
      }

      case 'MINES_CASHOUT': {
        if (!this.currentMinesGame) return;
        const winAmount = this.currentMinesGame.bet * this.currentMinesGame.multiplier;
        
        userStore.actions.updateBalance(winAmount);
        
        this.trigger('MINES_CASHOUT_RESULT', {
          winAmount: parseFloat(winAmount.toFixed(2)),
          grid: this.currentMinesGame.grid,
          balance: userStore.balance
        });
        this.currentMinesGame = null;
        break;
      }
    }
  }

  private trigger(event: string, data: unknown) {
    console.log(`[WS DOWN] ${event}`, data);
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

const socketInstance = new FakeSocket();

export const useWebSocket = () => {
  return socketInstance;
};
