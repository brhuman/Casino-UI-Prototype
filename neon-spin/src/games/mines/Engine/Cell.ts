import { Container, Graphics, Sprite } from 'pixi.js';
import gsap from 'gsap';

export class Cell extends Container {
  private baseBg: Graphics;
  private content: Container;
  public gridIndex: number;
  public isRevealed = false;

  private onClick: (idx: number) => void;

  constructor(index: number, size: number, onClick: (idx: number) => void) {
    super();
    this.gridIndex = index;
    this.onClick = onClick;
    

    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.baseBg = new Graphics();
    this.baseBg.roundRect(0, 0, size, size, 12);
    this.baseBg.fill({ color: 0x0a0a0a, alpha: 0.9 });
    this.baseBg.stroke({ width: 2, color: 0x9333ea, alpha: 0.3 });
    this.addChild(this.baseBg);
    
    this.content = new Container();
    this.content.x = size / 2;
    this.content.y = size / 2;
    this.addChild(this.content);


    this.on('pointerover', () => {
       if (!this.isRevealed) {
         gsap.to(this.scale, { x: 1.05, y: 1.05, duration: 0.2 });
         this.baseBg.stroke({ color: 0x9333ea, alpha: 0.8 });
       }
    });
    this.on('pointerout', () => {
       if (!this.isRevealed) {
         gsap.to(this.scale, { x: 1, y: 1, duration: 0.2 });
         this.baseBg.stroke({ color: 0x9333ea, alpha: 0.3 });
       }
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


    gsap.to(this.scale, {
      x: 0, duration: 0.15, onComplete: () => {
        if (type === 'SAFE') {
          this.baseBg.fill({ color: 0x051a24, alpha: 0.9 });
          this.baseBg.stroke({ width: 2, color: 0x00ffff, alpha: 0.8 });

          const sprite = Sprite.from('/assets/gem_sprite.png');
          sprite.anchor.set(0.5);
          sprite.width = this.baseBg.width * 0.8;
          sprite.height = this.baseBg.height * 0.8;
          sprite.blendMode = 'screen';
          this.content.addChild(sprite);
        } else {
          this.baseBg.fill({ color: 0x220a1f, alpha: 0.9 });
          this.baseBg.stroke({ width: 2, color: 0xd946ef, alpha: 0.8 });

          const sprite = Sprite.from('/assets/mine_sprite.png');
          sprite.anchor.set(0.5);
          sprite.width = this.baseBg.width * 0.8;
          sprite.height = this.baseBg.height * 0.8;
          sprite.blendMode = 'screen';
          this.content.addChild(sprite);
        }
        gsap.to(this.scale, { x: 1, duration: 0.15, ease: 'back.out(2)' });
      }
    });
  }
}
