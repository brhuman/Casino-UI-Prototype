import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { loadAssets } from './loader';
import { useGameStore } from '../../store/useGameStore';
import { spinReel } from '../animations/spin';
import { generateResultMatrix, calculateWin, REELS_COUNT, ROWS_COUNT } from '../math/rng';

export const initGameConfig = async (app: Application, onProgress: (p: number) => void) => {
  await loadAssets(onProgress);
  
  const mainContainer = new Container();
  // Center the container
  mainContainer.x = app.screen.width / 2;
  mainContainer.y = app.screen.height / 2;
  app.stage.addChild(mainContainer);
 
  const game = new SlotGame(app, mainContainer);
 
  const unsubscribe = useGameStore.subscribe((state, prevState) => {
    if (state.isSpinning && !prevState.isSpinning) {
      game.startSpin(state.currentBet);
    }
  });

  return unsubscribe;
};

class SlotGame {
  public container: Container;
  reels: Container[] = [];
  symbolSize = 150;
  reelSpacing = 20;
  app: Application;

  constructor(app: Application, parent: Container) {
    this.app = app;
    this.container = new Container();
    
    // Offset to center the 5x3 grid
    const totalWidth = (REELS_COUNT * this.symbolSize) + ((REELS_COUNT - 1) * this.reelSpacing);
    const totalHeight = ROWS_COUNT * this.symbolSize;
    
    this.container.x = -totalWidth / 2;
    this.container.y = -totalHeight / 2;
    parent.addChild(this.container);

    this.buildBg(totalWidth, totalHeight);
    this.buildReels();
  }

  private buildBg(w: number, h: number) {
     const bg = new Graphics();
     // Draw modern glassmorphism frame
     bg.roundRect(-20, -20, w + 40, h + 40, 20);
     bg.fill({ color: 0x111118, alpha: 0.8 });
     bg.stroke({ width: 2, color: 0xff00ff, alpha: 0.5 });
     this.container.addChild(bg);
  }

  private buildReels() {
    for (let i = 0; i < REELS_COUNT; i++) {
      const reelContainer = new Container();
      reelContainer.x = i * (this.symbolSize + this.reelSpacing);
      
      // Add fake symbols
      for (let j = -1; j < ROWS_COUNT + 1; j++) {
        const symbol = this.createMockSymbol(Math.floor(Math.random() * 6));
        symbol.y = j * this.symbolSize;
        reelContainer.addChild(symbol);
      }
      
      this.reels.push(reelContainer);
      this.container.addChild(reelContainer);
    }
    
    // Create mask
    const mask = new Graphics();
    mask.rect(0, 0, (REELS_COUNT * (this.symbolSize + this.reelSpacing)), ROWS_COUNT * this.symbolSize);
    mask.fill(0xffffff);
    this.container.addChild(mask);
    this.container.mask = mask;
  }

  private createMockSymbol(id: number) {
    const cont = new Container();
    const bg = new Graphics();
    bg.roundRect(5, 5, this.symbolSize - 10, this.symbolSize - 10, 15);
    
    const colors = [0xff00ff, 0xff3333, 0x00ffff, 0x00ff00, 0xffff00, 0xffaa00];
    const texts = ["W", "7", "BAR", "MEL", "BEL", "CHE"];
    
    bg.fill({ color: colors[id % colors.length], alpha: 0.2 });
    bg.stroke({ width: 2, color: colors[id % colors.length] });
    
    const textStyle = new TextStyle({
      fontFamily: 'Courier New',
      fontSize: 36,
      fontWeight: 'bold',
      fill: colors[id % colors.length],
      dropShadow: {
        color: colors[id % colors.length],
        blur: 10,
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
    
    // Spin all reels
    const promises = this.reels.map((reel, index) => {
      return new Promise<void>((resolve) => {
         // Create animation using GSAP (imported from animations/spin)
         spinReel(reel, index, resultMatrix[index], this.symbolSize, () => resolve());
      });
    });

    await Promise.all(promises);

    // After animations compile, notify React via Zustand
    useGameStore.getState().actions.setResult(resultMatrix, winAmount);
  }
}
