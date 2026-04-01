import { Application, Container, Graphics, Sprite } from 'pixi.js';
import { getSymbolTexture, loadAssets } from './loader';
import { useGameStore } from '../../store/useGameStore';
import { spinReel } from '../animations/spin';
import { generateResultMatrix, calculateWin, REELS_COUNT, ROWS_COUNT } from '../math/rng';
import { soundManager } from '../audio/SoundManager';
import gsap from 'gsap';

export const SLOT_SYMBOL_SIZE = 118;
export const SLOT_REEL_SPACING = 14;
export const SLOT_STAGE_PADDING = 8;
export const SLOT_REEL_WIDTH =
  REELS_COUNT * SLOT_SYMBOL_SIZE + (REELS_COUNT - 1) * SLOT_REEL_SPACING;
export const SLOT_REEL_HEIGHT = ROWS_COUNT * SLOT_SYMBOL_SIZE;
export const SLOT_STAGE_WIDTH = SLOT_REEL_WIDTH + (SLOT_STAGE_PADDING * 2);
export const SLOT_STAGE_HEIGHT = SLOT_REEL_HEIGHT + (SLOT_STAGE_PADDING * 2);

export const initGameConfig = async (app: Application, onProgress: (p: number) => void) => {
  console.log('[PIXI] initGameConfig starting...');
  try {
    await loadAssets(onProgress);
    console.log('[PIXI] Assets loaded.');
    
    const mainContainer = new Container();
    mainContainer.label = 'MainContainer';
    // Force event activation on stage and main container
    app.stage.eventMode = 'static';
    mainContainer.eventMode = 'passive';

    console.log(`[PIXI] Screen size: ${app.screen.width}x${app.screen.height}`);
    app.stage.addChild(mainContainer);
    console.log('[PIXI] Main container added to stage.');

    // Add ticker log to verify it's running
    let tickerFrames = 0;
    app.ticker.add(() => {
      tickerFrames++;
      if (tickerFrames === 60) {
        console.log('[PIXI] Ticker is running (60 frames).');
      }
    });

    const game = new SlotGame(app, mainContainer);
    console.log('[PIXI] SlotGame instance created.');
  
    const unsubscribeStore = useGameStore.subscribe((state, prevState) => {
      if (state.isSpinning && !prevState.isSpinning) {
        console.log('[PIXI] Triggering spin from store update.');
        game.startSpin(state.currentBet);
      }
    });

    console.log('[PIXI] initGameConfig finished successfully.');
    return () => {
      unsubscribeStore();
      game.destroy();
    };
  } catch (error) {
    console.error('[PIXI] Error in initGameConfig:', error);
    throw error;
  }
};

class SlotGame {
  public container: Container;
  reelsContainer: Container;
  reels: Container[] = [];
  symbolSize = SLOT_SYMBOL_SIZE;
  reelSpacing = SLOT_REEL_SPACING;
  app: Application;
  private readonly reelBufferRows = 1;
  private readonly reelVisibleWidth = SLOT_REEL_WIDTH;
  private readonly reelVisibleHeight = SLOT_REEL_HEIGHT;

  constructor(app: Application, parent: Container) {
    this.app = app;
    this.container = new Container();

    this.container.x = SLOT_STAGE_PADDING;
    this.container.y = SLOT_STAGE_PADDING;
    parent.addChild(this.container);

    this.reelsContainer = new Container();
    this.container.addChild(this.reelsContainer);

    this.buildReels();
  }

  private buildReels() {
    for (let i = 0; i < REELS_COUNT; i++) {
      const reelContainer = new Container();
      reelContainer.x = i * (this.symbolSize + this.reelSpacing);
      this.renderReel(reelContainer, this.makeSpinFrame());
      
      this.reels.push(reelContainer);
      this.reelsContainer.addChild(reelContainer);
    }
    

    const mask = new Graphics();
    mask.rect(0, 0, this.reelVisibleWidth, this.reelVisibleHeight);
    mask.fill(0xffffff);
    this.reelsContainer.addChild(mask);
    this.reelsContainer.mask = mask;
  }

  private renderReel(reelContainer: Container, symbolIds: number[]) {
    reelContainer.removeChildren();

    symbolIds.forEach((id, index) => {
      const symbol = this.createSymbol(id);
      symbol.y = (index - this.reelBufferRows) * this.symbolSize;
      reelContainer.addChild(symbol);
    });
  }

  private makeSpinFrame() {
    return Array.from({ length: ROWS_COUNT + (this.reelBufferRows * 2) }, () =>
      Math.floor(Math.random() * 6)
    );
  }

  private makeFinalFrame(resultColumn: number[]) {
    return [
      Math.floor(Math.random() * 6),
      ...resultColumn,
      Math.floor(Math.random() * 6),
    ];
  }

  private createSymbol(id: number) {
    const cont = new Container();
    const bg = new Graphics();
    const panelInsetX = 12;
    const panelInsetY = 14;
    const panelWidth = this.symbolSize - (panelInsetX * 2);
    const panelHeight = this.symbolSize - (panelInsetY * 2);
    
    const colors = [0xff00ff, 0xff3333, 0x00ffff, 0x00ff00, 0xffff00, 0xffaa00];
    
    bg.roundRect(panelInsetX, panelInsetY, panelWidth, panelHeight, 18);
    bg.fill({ color: colors[id % colors.length], alpha: 0.22 });
    bg.stroke({ width: 2, color: colors[id % colors.length], alpha: 0.92 });

    const icon = Sprite.from(getSymbolTexture(id));
    icon.anchor.set(0.5);
    icon.x = this.symbolSize / 2;
    icon.y = this.symbolSize / 2;

    const maxIconWidth = panelWidth * 0.82;
    const maxIconHeight = panelHeight * 0.82;
    const iconScale = Math.min(maxIconWidth / icon.width, maxIconHeight / icon.height);
    icon.scale.set(iconScale);
    
    cont.addChild(bg, icon);
    return cont;
  }

  public highlightWin(winningLine: {c: number, r: number}[]) {
    for (let c = 0; c < REELS_COUNT; c++) {
      for (let r = 0; r < ROWS_COUNT; r++) {
         const symbolIndex = r + this.reelBufferRows;
         const symbol = this.reels[c].children[symbolIndex] as Container;
         if (symbol) {
           symbol.alpha = 0.25; 
         }
      }
    }
    
    winningLine.forEach(({c, r}) => {
       const symbolIndex = r + this.reelBufferRows;
       const symbol = this.reels[c].children[symbolIndex] as Container;
       if (symbol) {
         symbol.alpha = 1.0;
         gsap.to(symbol.scale, {
           x: 1.15,
           y: 1.15,
           duration: 0.35,
           yoyo: true,
           repeat: 3,
           ease: 'power1.inOut'
         });
       }
    });
  }

  public async startSpin(currentBet: number) {
    // Reset symbols alpha and scale before spinning
    for (let c = 0; c < REELS_COUNT; c++) {
      for (let r = 0; r < ROWS_COUNT; r++) {
         const symbolIndex = r + this.reelBufferRows;
         const symbol = this.reels[c].children[symbolIndex] as Container;
         if (symbol) {
           symbol.alpha = 1.0;
           gsap.killTweensOf(symbol.scale);
           symbol.scale.set(1.0);
         }
      }
    }

    const resultMatrix = generateResultMatrix();
    const { winAmount, winningLine } = calculateWin(resultMatrix, currentBet);

    soundManager.playSpin();
    soundManager.startRolling();

    const promises = this.reels.map((reel, index) => {
      return new Promise<void>((resolve) => {
         spinReel(
           reel,
           index,
           resultMatrix[index],
           this.symbolSize,
           () => this.renderReel(reel, this.makeSpinFrame()),
           () => this.renderReel(reel, this.makeFinalFrame(resultMatrix[index])),
           () => resolve()
         );
      });
    });

    await Promise.all(promises);
    soundManager.stopRolling();

    if (winAmount > 0) {
      soundManager.playWin();
      this.highlightWin(winningLine);
    }

    useGameStore.getState().actions.setResult(resultMatrix, winAmount, winningLine);
  }

  public destroy() {
    this.reels = [];
  }
}
