import { Application, Container, Text, TextStyle, Assets } from 'pixi.js';
import type { IGameEngine } from '@/types/game';
import { Cell } from '@/games/mines/Engine/Cell';
import { useMinesStore } from '@/games/mines/store';
import gsap from 'gsap';

export class MinesEngine implements IGameEngine {
  public app!: Application;
  private container: Container;
  private gridContainer: Container;
  private cells: Cell[] = [];
  private isDestroyed = false;
  private pendingTimeouts: Set<any> = new Set();
  

  private socket: any;

  constructor(socket: any) {
    this.container = new Container();
    this.gridContainer = new Container();
    this.socket = socket;
    

    this.onServerResult = this.onServerResult.bind(this);
    this.onGameStarted = this.onGameStarted.bind(this);
    this.onCashoutResult = this.onCashoutResult.bind(this);
    
    this.socket.on('MINES_STARTED', this.onGameStarted);
    this.socket.on('MINES_RESULT', this.onServerResult);
    this.socket.on('MINES_CASHOUT_RESULT', this.onCashoutResult);
  }

  public async init(app: Application) {
    this.app = app;
    
    // Preload sprites for the game
    await Assets.load([
      '/assets/gem_sprite.png',
      '/assets/mine_sprite.png'
    ]);

    this.app.stage.addChild(this.container);
    this.container.x = app.screen.width / 2;
    this.container.y = app.screen.height / 2;
    this.container.addChild(this.gridContainer);

    this.drawGrid();

    // Re-center when canvas resizes
    this.app.renderer.on('resize', (w: number, h: number) => {
      this.container.x = w / 2;
      this.container.y = h / 2;
    });
  }

   private drawGrid() {
    this.gridContainer.removeChildren();
    this.cells = [];
    
    // Calculate cell size based on available space to minimize empty areas
    const padding = 60;
    const availableSize = Math.min(this.app.screen.width, this.app.screen.height) - padding;
    const gap = 15;
    const cellSize = Math.floor((availableSize - (gap * 4)) / 5);
    
    // Total width/height of the 5x5 grid including gaps
    const totalGridSize = (cellSize * 5) + (gap * 4);
    // Offset from the center to the top-left of the first cell
    const offset = totalGridSize / 2;

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

    this.drawGrid();
    useMinesStore.getState().actions.playSound('start');
    this.socket.emit('MINES_START', { bet, minesCount: payload.minesCount });
  }

  private handlePick(index: number) {
    if (this.isDestroyed || !useMinesStore.getState().isActive) return;
    useMinesStore.getState().actions.playSound('click');
    this.socket.emit('MINES_PICK', { index });
  }

  public cashout() {
    if (!useMinesStore.getState().isActive) return;
    useMinesStore.getState().actions.playSound('cashout');
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
      useMinesStore.getState().actions.playSound('reveal');
    } else if (data.status === 'BUST' && data.grid) {
      this.revealAll(data.grid, true);
      useMinesStore.getState().actions.playSound('bust');
      useMinesStore.getState().actions.endGame();
    }
  }
  

  public revealCellClient(index: number, isSafe: boolean) {
    if (this.isDestroyed || !this.cells[index]) return;
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

         const tid = setTimeout(() => {
           if (this.isDestroyed) return;
           this.cells[idx].reveal(status === 1 ? 'BOMB' : 'SAFE');
           this.pendingTimeouts.delete(tid);
         }, Math.random() * 500);
         this.pendingTimeouts.add(tid);
       }
     });
     
     if (isBust) {

       gsap.to(this.container, { x: this.app.screen.width / 2 + 10, duration: 0.05, yoyo: true, repeat: 5, onComplete: () => { this.container.x = this.app.screen.width / 2; }});
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
    const tid = setTimeout(() => {
      if (this.isDestroyed) return;
      gsap.to(text, { alpha: 0, y: -300, duration: 0.5, onComplete: () => text.destroy() });
      this.pendingTimeouts.delete(tid);
    }, 2000);
    this.pendingTimeouts.add(tid);
  }

  public destroy() {
    this.isDestroyed = true;
    

    this.pendingTimeouts.forEach(tid => clearTimeout(tid as any));
    this.pendingTimeouts.clear();


    gsap.killTweensOf(this.container);
    this.cells.forEach(cell => gsap.killTweensOf(cell.scale));

    this.socket.off('MINES_STARTED', this.onGameStarted);
    this.socket.off('MINES_RESULT', this.onServerResult);
    this.socket.off('MINES_CASHOUT_RESULT', this.onCashoutResult);

    if (this.app) {
      try {
        this.app.ticker?.stop();

        this.app.destroy(true, { children: true, texture: true, baseTexture: true } as any);
      } catch (e) {
        console.warn("[MinesEngine] PIXI destroy ignored:", e);
      }
    }
  }
}
