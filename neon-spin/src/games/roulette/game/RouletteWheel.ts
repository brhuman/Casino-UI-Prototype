import { Application, Container, Graphics, Text, TextStyle, Sprite } from 'pixi.js';
import gsap from 'gsap';

export class RouletteWheel {
  private app: Application;
  private container: Container;
  private wheel: Container;
  private wheelSprite: Sprite | null = null;
  private ball: Sprite | null = null;
  private highlightGraphics: Graphics | null = null;
  private segments = 37; // European Roulette
  private radius = 220;
  private isDestroyed = false;
  
  constructor(app: Application, parent: Container) {
    this.app = app;
    this.container = new Container();
    this.wheel = new Container();
    
    this.container.addChild(this.wheel);
    parent.addChild(this.container);
  }

  public async init() {
    await this.drawWheel();
    this.addBall();
    
    // Add a re-usable highlight graphic for the winning slot
    this.highlightGraphics = new Graphics();
    this.highlightGraphics.visible = false;
    this.container.addChild(this.highlightGraphics);
  }

  private async drawWheel() {
    const angleStep = (Math.PI * 2) / this.segments;
    const startTime = performance.now();
    console.log('[RouletteWheel] Starting 3D Neon Overhaul...');
    
    const tempContainer = new Container();
    
    // 1. OUTER RIM (The Beveled Base)
    const rim = new Graphics();
    rim.circle(0, 0, this.radius + 35);
    rim.fill({ color: 0x0c0c0e, alpha: 1 });
    rim.circle(0, 0, this.radius + 35);
    rim.stroke({ width: 4, color: 0x1f2937, alpha: 0.8 });
    
    const neonColors = [0x00ffff, 0x00ffff, 0x00ffff];
    const neonWidths = [40, 20, 8];
    const neonAlphas = [0.05, 0.1, 0.3];
    
    neonColors.forEach((color, i) => {
      rim.circle(0, 0, this.radius + 35);
      rim.stroke({ width: neonWidths[i], color, alpha: neonAlphas[i] });
    });
    
    rim.circle(0, 0, this.radius + 15);
    rim.stroke({ width: 2, color: 0xffffff, alpha: 0.15 });
    tempContainer.addChild(rim);

    // 2. SLICES
    const slices = new Graphics();
    tempContainer.addChild(slices);

    const style = new TextStyle({
      fontFamily: "'Inter', Arial, sans-serif",
      fontSize: 18,
      fontWeight: '900',
      fill: '#ffffff',
      dropShadow: { color: '#000000', alpha: 0.5, blur: 4, distance: 2 }
    });

    for (let i = 0; i < this.segments; i++) {
      if (this.isDestroyed) {
        tempContainer.destroy({ children: true });
        return;
      }

      const startAngle = i * angleStep;
      const endAngle = (i + 1) * angleStep;
      const color = i === 0 ? 0x10b981 : (i % 2 === 0 ? 0xe11d48 : 0x18181b);
      
      slices.moveTo(0, 0);
      slices.arc(0, 0, this.radius, startAngle, endAngle);
      slices.fill({ color, alpha: 1 });
      
      slices.moveTo(0, 0);
      slices.arc(0, 0, this.radius, startAngle, endAngle);
      slices.fill({ color: 0x000000, alpha: 0.05 });
      
      slices.moveTo(0, 0);
      slices.arc(0, 0, this.radius, startAngle, endAngle);
      slices.stroke({ width: 0.5, color: 0xffffff, alpha: 0.1 });

      const text = new Text({ text: i.toString(), style });
      const textAngle = startAngle + (angleStep / 2);
      text.anchor.set(0.5);
      const textDistance = this.radius * 0.82;
      text.x = Math.cos(textAngle) * textDistance;
      text.y = Math.sin(textAngle) * textDistance;
      text.rotation = textAngle + Math.PI / 2;
      tempContainer.addChild(text);

      if (i % 8 === 0) {
        await new Promise(resolve => requestAnimationFrame(resolve));
      }
    }
    
    // 3. INNER HUB
    const hub = new Graphics();
    hub.circle(0, 0, this.radius * 0.55);
    hub.fill({ color: 0x09090b, alpha: 1 });
    hub.stroke({ width: 10, color: 0x00ffff, alpha: 0.3 });
    hub.circle(0, 0, this.radius * 0.4);
    hub.fill({ color: 0x111827 });
    hub.stroke({ width: 2, color: 0x1f2937 });
    hub.circle(0, 0, 65);
    hub.stroke({ width: 6, color: 0x374151 });
    hub.circle(0, 0, 45);
    hub.fill({ color: 0x1f2937 });
    hub.stroke({ width: 4, color: 0x00ffff, alpha: 0.7 });
    tempContainer.addChild(hub);

    const texture = this.app.renderer.generateTexture(tempContainer);
    this.wheelSprite = new Sprite(texture);
    this.wheelSprite.anchor.set(0.5);
    this.wheel.addChild(this.wheelSprite);

    tempContainer.destroy({ children: true });
    console.log(`[RouletteWheel] 3D Overhaul completed in ${performance.now() - startTime}ms`);
  }

  private addBall() {
    const ballGraphics = new Graphics();
    ballGraphics.circle(0, 0, 8);
    ballGraphics.fill({ color: 0xffffff });
    ballGraphics.circle(0, 0, 8);
    ballGraphics.fill({ color: 0x000000, alpha: 0.2 });
    ballGraphics.circle(-2, -2, 3);
    ballGraphics.fill({ color: 0x00ffff, alpha: 0.6 });
    
    const texture = this.app.renderer.generateTexture(ballGraphics);
    this.ball = new Sprite(texture);
    this.ball.anchor.set(0.5);
    this.ball.visible = false;
    this.container.addChild(this.ball);
    ballGraphics.destroy();
  }

  private showResultHighlight(angle: number) {
    if (!this.highlightGraphics) return;
    this.highlightGraphics.clear();
    this.highlightGraphics.circle(0, 0, this.radius + 35);
    this.highlightGraphics.stroke({ width: 6, color: 0x00ffff, alpha: 0.4 });
    this.highlightGraphics.circle(0, 0, this.radius + 40);
    this.highlightGraphics.stroke({ width: 12, color: 0x00ffff, alpha: 0.1 });
    
    // Position ball slightly better in the pocket
    if (this.ball) {
      this.ball.x = Math.cos(angle) * (this.radius - 10);
      this.ball.y = Math.sin(angle) * (this.radius - 10);
    }
    
    this.highlightGraphics.visible = true;
    gsap.fromTo(this.highlightGraphics, { alpha: 0 }, { alpha: 1, duration: 0.3, yoyo: true, repeat: 3 });
  }

  public async spin(targetIndex: number) {
    if (this.isDestroyed || !this.wheelSprite || !this.ball) return;
    
    const angleStep = (Math.PI * 2) / this.segments;
    
    // Choose a random landing angle in the container's space
    const landAngle = (Math.random() * Math.PI * 2) - Math.PI; 
    
    // Calculate the target rotation of the wheel
    // We want local angle (targetIndex * angleStep + angleStep/2) to end up at landAngle
    const targetSegmentAngle = targetIndex * angleStep + angleStep / 2;
    const finalWheelRotation = landAngle - targetSegmentAngle;
    
    const wheelExtraSpins = Math.PI * 2 * 6;
    const ballExtraSpins = Math.PI * 2 * 9;
    
    this.ball.visible = true;
    this.ball.alpha = 1;
    if (this.highlightGraphics) this.highlightGraphics.visible = false;
    
    return new Promise<void>((resolve) => {
      // 1. Wheel Animation
      gsap.to(this.wheelSprite, {
        rotation: finalWheelRotation + wheelExtraSpins,
        duration: 5,
        ease: 'power4.out',
        onComplete: () => {
          if (this.isDestroyed || !this.wheelSprite) return resolve();
          this.wheelSprite.rotation = finalWheelRotation % (Math.PI * 2);
          this.showResultHighlight(landAngle);
          resolve();
        }
      });

      // 2. Ball Animation
      const ballAnim = { angle: Math.random() * Math.PI * 2 };
      gsap.to(ballAnim, {
        angle: landAngle - ballExtraSpins,
        duration: 4.5,
        ease: 'power3.out',
        onUpdate: () => {
          if (this.isDestroyed || !this.ball) return;
          const r = this.radius - 12;
          this.ball.x = Math.cos(ballAnim.angle) * r;
          this.ball.y = Math.sin(ballAnim.angle) * r;
        },
        onComplete: () => {
          if (this.isDestroyed || !this.ball) return;
          // Snap to exact landing spot
          this.ball.x = Math.cos(landAngle) * (this.radius - 10);
          this.ball.y = Math.sin(landAngle) * (this.radius - 10);
          gsap.to(this.ball.scale, { x: 0.8, y: 0.8, duration: 0.2, yoyo: true, repeat: 1 });
        }
      });
    });
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.wheelSprite) {
      gsap.killTweensOf(this.wheelSprite);
      if (this.wheelSprite.texture) this.wheelSprite.texture.destroy(true);
    }
    if (this.ball) {
      gsap.killTweensOf(this.ball);
      if (this.ball.texture) this.ball.texture.destroy(true);
    }
    this.container.destroy({ children: true });
  }
}
