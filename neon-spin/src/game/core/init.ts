import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { loadAssets } from './loader';
import { useGameStore } from '../../store/useGameStore';
import { spinReel } from '../animations/spin';
import { generateResultMatrix, calculateWin, REELS_COUNT, ROWS_COUNT } from '../math/rng';

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
    mainContainer.x = app.screen.width / 2;
    mainContainer.y = app.screen.height / 2;
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
  symbolSize = 180;
  reelSpacing = 25;
  app: Application;

  constructor(app: Application, parent: Container) {
    this.app = app;
    this.container = new Container();
    

    const totalWidth = (REELS_COUNT * this.symbolSize) + ((REELS_COUNT - 1) * this.reelSpacing);
    const totalHeight = ROWS_COUNT * this.symbolSize;
    
    this.container.x = -totalWidth / 2;
    this.container.y = -totalHeight / 2;
    parent.addChild(this.container);

    this.buildBg(totalWidth, totalHeight);

    this.reelsContainer = new Container();
    this.container.addChild(this.reelsContainer);

    this.buildReels();
  }

  private buildBg(w: number, h: number) {
     const bg = new Graphics();
     const innerPanel = new Graphics();

     bg.roundRect(-20, -20, w + 40, h + 40, 20);
     bg.fill({ color: 0x000000, alpha: 0.92 });
     bg.stroke({ width: 2, color: 0xff00ff, alpha: 0.45 });
     this.container.addChild(bg);

     innerPanel.roundRect(0, 0, w, h, 16);
     innerPanel.fill({ color: 0x050505, alpha: 0.98 });
     innerPanel.stroke({ width: 1, color: 0x1a1a1a, alpha: 0.9 });
     this.container.addChild(innerPanel);
  }

  private buildReels() {
    for (let i = 0; i < REELS_COUNT; i++) {
      const reelContainer = new Container();
      reelContainer.x = i * (this.symbolSize + this.reelSpacing);
      

      for (let j = -1; j < ROWS_COUNT + 1; j++) {
        const symbol = this.createMockSymbol(Math.floor(Math.random() * 6));
        symbol.y = j * this.symbolSize;
        reelContainer.addChild(symbol);
      }
      
      this.reels.push(reelContainer);
      this.reelsContainer.addChild(reelContainer);
    }
    

    const mask = new Graphics();
    mask.rect(0, 0, (REELS_COUNT * (this.symbolSize + this.reelSpacing)), ROWS_COUNT * this.symbolSize);
    mask.fill(0xffffff);
    this.reelsContainer.addChild(mask);
    this.reelsContainer.mask = mask;
  }

  private createMockSymbol(id: number) {
    const cont = new Container();
    const bg = new Graphics();
    bg.roundRect(5, 5, this.symbolSize - 10, this.symbolSize - 10, 15);
    
    const colors = [0xff00ff, 0xff3333, 0x00ffff, 0x00ff00, 0xffff00, 0xffaa00];
    const texts = ["W", "7", "BAR", "MEL", "BEL", "CHE"];
    
    bg.fill({ color: colors[id % colors.length], alpha: 0.72 });
    bg.stroke({ width: 3, color: colors[id % colors.length], alpha: 0.95 });
    
    const textStyle = new TextStyle({
      fontFamily: 'Arial Black',
      fontSize: 42,
      fontWeight: 'bold',
      fill: colors[id % colors.length] === 0xffff00 ? 0x111111 : 0xffffff,
      dropShadow: {
        color: colors[id % colors.length],
        blur: 15,
        distance: 0,
        alpha: 1
      }
    });
    
    const text = new Text({ text: texts[id % texts.length], style: textStyle });
    text.anchor.set(0.5);
    text.x = this.symbolSize / 2;
    text.y = this.symbolSize / 2;
    
    cont.addChild(bg, text);
    return cont;
  }

  public async startSpin(currentBet: number) {
    const resultMatrix = generateResultMatrix();
    const winAmount = calculateWin(resultMatrix, currentBet);
    

    const promises = this.reels.map((reel, index) => {
      return new Promise<void>((resolve) => {

         spinReel(reel, index, resultMatrix[index], this.symbolSize, () => resolve());
      });
    });

    await Promise.all(promises);


    useGameStore.getState().actions.setResult(resultMatrix, winAmount);
  }

  public destroy() {
    this.reels = [];
  }
}
