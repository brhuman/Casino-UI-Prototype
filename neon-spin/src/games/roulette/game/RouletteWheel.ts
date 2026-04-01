import { Application, Container, Graphics, Text, TextStyle, Sprite } from 'pixi.js';
import gsap from 'gsap';

export class RouletteWheel {
  private app: Application;
  private container: Container;
  private wheel: Container;
  private wheelSprite: Sprite | null = null;
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
    this.addPointer();
  }

  private async drawWheel() {
    const angleStep = (Math.PI * 2) / this.segments;
    const startTime = performance.now();
    console.log('[RouletteWheel] Starting high-performance pre-render...');
    
    // Create a temporary container for drawing the source
    const tempContainer = new Container();
    
    // Outer Border
    const border = new Graphics();
    border.circle(0, 0, this.radius + 15);
    border.stroke({ width: 4, color: 0x00ffff, alpha: 0.5 });
    border.circle(0, 0, this.radius + 20);
    border.stroke({ width: 1, color: 0x00ffff, alpha: 0.2 });
    tempContainer.addChild(border);

    // Slices
    const slices = new Graphics();
    tempContainer.addChild(slices);

    const style = new TextStyle({
      fontFamily: "'Inter', Arial, sans-serif",
      fontSize: 16,
      fontWeight: '900',
      fill: '#ffffff',
      dropShadow: { color: '#000000', blur: 4, distance: 1 }
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
      slices.fill({ color, alpha: 0.95 });
      slices.stroke({ width: 1, color: 0xffffff, alpha: 0.05 });

      // Add Text
      const text = new Text({ text: i.toString(), style });
      const textAngle = startAngle + (angleStep / 2);
      text.anchor.set(0.5);
      text.x = Math.cos(textAngle) * (this.radius - 35);
      text.y = Math.sin(textAngle) * (this.radius - 35);
      text.rotation = textAngle + Math.PI / 2;
      tempContainer.addChild(text);

      // Yield every 5 segments to keep UI responsive during drawing
      if (i % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
        await new Promise(resolve => requestAnimationFrame(resolve));
      }
    }
    
    // Inner Circle Neon Glow
    const inner = new Graphics();
    inner.circle(0, 0, this.radius * 0.5);
    inner.fill({ color: 0x09090b, alpha: 1 });
    inner.stroke({ width: 8, color: 0x00ffff, alpha: 0.4 });
    inner.circle(0, 0, this.radius * 0.45);
    inner.stroke({ width: 2, color: 0xffffff, alpha: 0.1 });
    tempContainer.addChild(inner);

    // Decorative Center Cap
    const cap = new Graphics();
    cap.circle(0, 0, 40);
    cap.fill({ color: 0x18181b });
    cap.stroke({ width: 4, color: 0x00ffff, alpha: 0.8 });
    tempContainer.addChild(cap);

    // Convert the complex drawing into a single optimized texture
    console.log('[RouletteWheel] Generating RenderTexture...');
    const texture = this.app.renderer.generateTexture(tempContainer);
    
    // Create a sprite from the texture and add it to the wheel container
    this.wheelSprite = new Sprite(texture);
    this.wheelSprite.anchor.set(0.5);
    this.wheel.addChild(this.wheelSprite);

    // Cleanup the temporary container and its individual children
    tempContainer.destroy({ children: true });
    
    console.log(`[RouletteWheel] Pre-render completed in ${performance.now() - startTime}ms`);
  }

  private addPointer() {
    const pointer = new Graphics();
    pointer.moveTo(0, -this.radius - 20);
    pointer.lineTo(15, -this.radius - 45);
    pointer.lineTo(-15, -this.radius - 45);
    pointer.closePath();
    pointer.fill({ color: 0x00ffff });
    pointer.stroke({ width: 2, color: 0xffffff });
    this.container.addChild(pointer);
  }

  public async spin(targetIndex: number) {
    if (this.isDestroyed || !this.wheelSprite) return;
    const angleStep = (Math.PI * 2) / this.segments;
    const targetRotation = -(targetIndex * angleStep + angleStep / 2) - (Math.PI / 2);
    const extraSpins = Math.PI * 2 * 5; // 5 full rotations
    
    return new Promise<void>((resolve) => {
      const safetyTimeout = setTimeout(() => {
        if (this.isDestroyed || !this.wheelSprite) {
          resolve();
          return;
        }
        console.warn('RouletteWheel: Animation took too long, forcing resolve');
        this.wheelSprite.rotation = targetRotation;
        resolve();
      }, 10000);

      gsap.to(this.wheelSprite, {
        rotation: targetRotation + extraSpins,
        duration: 4,
        ease: 'power4.out',
        onComplete: () => {
          clearTimeout(safetyTimeout);
          if (this.isDestroyed || !this.wheelSprite) {
            resolve();
            return;
          }
          // Normalize rotation
          this.wheelSprite.rotation = targetRotation % (Math.PI * 2);
          resolve();
        }
      });
    });
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.wheelSprite) {
      gsap.killTweensOf(this.wheelSprite);
      if (this.wheelSprite.texture) {
        this.wheelSprite.texture.destroy(true);
      }
    }
    this.container.destroy({ children: true });
  }
}
