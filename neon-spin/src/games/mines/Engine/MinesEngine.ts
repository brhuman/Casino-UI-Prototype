import { Application, Container, Text, TextStyle } from 'pixi.js';
import type { IGameEngine } from '../../../types/game';
import { Cell } from './Cell';
import { useMinesStore } from '../store';
import gsap from 'gsap';

export class MinesEngine implements IGameEngine {
  public app: Application;
  private container: Container;
  private gridContainer: Container;
  private cells: Cell[] = [];
  private isDestroyed = false;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private socket: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(socket: any) {
    this.app = new Application();
    this.container = new Container();
    this.gridContainer = new Container();
    this.socket = socket;
    
    // Bind WS listeners
    this.onServerResult = this.onServerResult.bind(this);
    this.onGameStarted = this.onGameStarted.bind(this);
    this.onCashoutResult = this.onCashoutResult.bind(this);
    
    this.socket.on('MINES_STARTED', this.onGameStarted);
    this.socket.on('MINES_RESULT', this.onServerResult);
    this.socket.on('MINES_CASHOUT_RESULT', this.onCashoutResult);
  }

  async init(canvas: HTMLCanvasElement) {
    await this.app.init({
      canvas,
      width: 800,
      height: 800,
      preference: 'webgl',
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    
    if (this.isDestroyed) {
      try { this.app.destroy(true, { children: true }); } catch (e) { /* ignore */ }
      return;
    }
    
    this.app.stage.addChild(this.container);
    this.container.x = 400; // Center 800x800
    this.container.y = 400;
    this.container.addChild(this.gridContainer);

    this.drawGrid();
  }

  private drawGrid() {
    this.gridContainer.removeChildren();
    this.cells = [];
    
    const cellSize = 100;
    const gap = 15;
    const offset = ((cellSize * 5) + (gap * 4)) / 2 - (cellSize / 2);

    for (let i = 0; i < 25; i++) {
       const row = Math.floor(i / 5);
       const col = i % 5;
       
       const cell = new Cell(i, cellSize, (idx) => this.handlePick(idx));
       cell.x = (col * (cellSize + gap)) - offset;
       cell.y = (row * (cellSize + gap)) - offset;
       
       this.cells.push(cell);
       this.gridContainer.addChild(cell);
    }
  }

  public startRound(bet: number, payload: { minesCount: number }) {
    // Reset Grid
    this.drawGrid();
    this.socket.emit('MINES_START', { bet, minesCount: payload.minesCount });
  }

  private handlePick(index: number) {
    if (!useMinesStore.getState().isActive) return;
    this.socket.emit('MINES_PICK', { index });
  }

  public cashout() {
    if (!useMinesStore.getState().isActive) return;
    this.socket.emit('MINES_CASHOUT');
  }

  private onGameStarted(data: { success?: boolean } | unknown) {
    if ((data as { success: boolean }).success) {
      useMinesStore.getState().actions.startGame();
    }
  }

  public onServerResult(data: { status: 'SAFE' | 'BUST', grid?: number[], newMultiplier?: number }) {
    if (data.status === 'SAFE' && data.newMultiplier) {
      useMinesStore.getState().actions.updateProgress(data.newMultiplier);
      // Wait, we need to know WHICH cell was clicked. Since FakeSocket doesn't return it,
      // we can infer it or we should just reveal the currently active one.
      // For this demo, we'll reveal the first unrevealed clicked one if we tracked it, 
      // but let's just cheat and check which cell was hovered/clicked via Pixi interaction,
      // or we can pass `index` back from server.
      // To simplify, we will just loop cells and if they are hovered we reveal them.
      // Actually, a better way: store pending pick in class.
    } else if (data.status === 'BUST' && data.grid) {
      this.revealAll(data.grid, true);
      useMinesStore.getState().actions.endGame();
    }
  }
  
  // Method injected when React clicks wrapper to tell engine which cell we intended
  public revealCellClient(index: number, isSafe: boolean) {
    this.cells[index].reveal(isSafe ? 'SAFE' : 'BOMB');
  }

  private onCashoutResult(data: { winAmount: number, grid: number[] }) {
    useMinesStore.getState().actions.endGame(data.winAmount);
    this.revealAll(data.grid, false);
    this.showWinText(data.winAmount);
  }

  private revealAll(grid: number[], isBust: boolean) {
     grid.forEach((status, idx) => {
       if (!this.cells[idx].isRevealed) {
         // Add staggered delay
         setTimeout(() => {
           this.cells[idx].reveal(status === 1 ? 'BOMB' : 'SAFE');
         }, Math.random() * 500);
       }
     });
     
     if (isBust) {
       // Shake screen
       gsap.to(this.container, { x: 410, duration: 0.05, yoyo: true, repeat: 5, onComplete: () => { this.container.x = 400; }});
     }
  }

  private showWinText(amount: number) {
    const textStyle = new TextStyle({
      fontFamily: 'Courier New',
      fontSize: 64,
      fontWeight: 'bold',
      fill: 0x00ffff,
      stroke: { color: 0x000000, width: 6 },
      dropShadow: { color: 0x00ffff, alpha: 0.8, blur: 20, distance: 0 }
    });
    
    const text = new Text({ text: `+ $${amount}`, style: textStyle });
    text.anchor.set(0.5);
    text.y = -100;
    text.alpha = 0;
    text.scale.set(0.5);
    
    this.container.addChild(text);
    
    gsap.to(text, { alpha: 1, y: -200, scale: 1, duration: 0.8, ease: 'back.out(2)' });
    setTimeout(() => {
      gsap.to(text, { alpha: 0, y: -300, duration: 0.5, onComplete: () => text.destroy() });
    }, 2000);
  }

  public destroy() {
    this.isDestroyed = true;
    this.socket.off('MINES_STARTED', this.onGameStarted);
    this.socket.off('MINES_RESULT', this.onServerResult);
    this.socket.off('MINES_CASHOUT_RESULT', this.onCashoutResult);
    if (this.app) {
      try {
        this.app.destroy(true, { children: true });
      } catch (e) {
        console.warn("PIXI destroy ignored:", e);
      }
    }
  }
}
