import { Container, Graphics } from 'pixi.js';
import gsap from 'gsap';

export class Cell extends Container {
  private baseBg: Graphics;
  private content: Graphics;
  public gridIndex: number;
  public isRevealed = false;

  private onClick: (idx: number) => void;

  constructor(index: number, size: number, onClick: (idx: number) => void) {
    super();
    this.gridIndex = index;
    this.onClick = onClick;
    
    // Interactive
    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.baseBg = new Graphics();
    this.baseBg.roundRect(0, 0, size, size, 12);
    this.baseBg.fill({ color: 0x1f1f2e, alpha: 0.9 });
    this.baseBg.stroke({ width: 2, color: 0xff00ff, alpha: 0.3 });
    this.addChild(this.baseBg);
    
    this.content = new Graphics();
    this.content.x = size / 2;
    this.content.y = size / 2;
    this.addChild(this.content);

    // Hover effects
    this.on('pointerover', () => {
       if (!this.isRevealed) gsap.to(this.scale, { x: 1.05, y: 1.05, duration: 0.2 });
    });
    this.on('pointerout', () => {
       if (!this.isRevealed) gsap.to(this.scale, { x: 1, y: 1, duration: 0.2 });
    });
    this.on('pointerdown', () => {
      if (!this.isRevealed) this.onClick(this.gridIndex);
    });
  }

  reveal(type: 'SAFE' | 'BOMB') {
    if (this.isRevealed) return;
    this.isRevealed = true;
    this.cursor = 'default';
    
    gsap.to(this.scale, { x: 1, y: 1, duration: 0.2 });

    // Flip animation
    gsap.to(this.scale, {
      x: 0, duration: 0.15, onComplete: () => {
        if (type === 'SAFE') {
          this.baseBg.fill({ color: 0x002211, alpha: 0.9 });
          this.baseBg.stroke({ width: 2, color: 0x00ff00, alpha: 0.8 });
          // Draw Crystal
          this.content.moveTo(0, -20);
          this.content.lineTo(15, 0);
          this.content.lineTo(0, 20);
          this.content.lineTo(-15, 0);
          this.content.fill({ color: 0x00ffff });
        } else {
          this.baseBg.fill({ color: 0x330000, alpha: 0.9 });
          this.baseBg.stroke({ width: 2, color: 0xff0000, alpha: 0.8 });
          // Draw Bomb
          this.content.circle(0, 0, 15);
          this.content.fill({ color: 0xff3333 });
        }
        gsap.to(this.scale, { x: 1, duration: 0.15, ease: 'back.out(2)' });
      }
    });
  }
}
