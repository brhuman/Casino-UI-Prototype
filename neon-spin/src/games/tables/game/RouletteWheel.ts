import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import gsap from 'gsap';

export class RouletteWheel {
  private container: Container;
  private wheel: Container;
  private segments = 37; // European Roulette
  private radius = 220;
  
  constructor(_app: Application, parent: Container) {
    this.container = new Container();
    this.wheel = new Container();
    
    this.container.addChild(this.wheel);
    parent.addChild(this.container);
    
    this.drawWheel();
    this.addPointer();
  }

  private drawWheel() {
    const angleStep = (Math.PI * 2) / this.segments;
    
    // Outer Border
    const border = new Graphics();
    border.circle(0, 0, this.radius + 15);
    border.stroke({ width: 4, color: 0x00ffff, alpha: 0.5 });
    border.circle(0, 0, this.radius + 20);
    border.stroke({ width: 1, color: 0x00ffff, alpha: 0.2 });
    this.wheel.addChild(border);

    for (let i = 0; i < this.segments; i++) {
      const g = new Graphics();
      const startAngle = i * angleStep;
      const endAngle = (i + 1) * angleStep;
      
      const color = i === 0 ? 0x10b981 : (i % 2 === 0 ? 0xe11d48 : 0x18181b);
      
      g.moveTo(0, 0);
      g.arc(0, 0, this.radius, startAngle, endAngle);
      g.fill({ color, alpha: 0.95 });
      g.stroke({ width: 1, color: 0xffffff, alpha: 0.05 });
      
      this.wheel.addChild(g);

      // Add Text with better styling
      const style = new TextStyle({
        fontFamily: "'Inter', sans-serif",
        fontSize: 16,
        fontWeight: '900',
        fill: '#ffffff',
        dropShadow: { color: '#000000', blur: 4, distance: 1 }
      });
      
      const text = new Text({ text: i.toString(), style });
      const textAngle = startAngle + (angleStep / 2);
      text.anchor.set(0.5);
      text.x = Math.cos(textAngle) * (this.radius - 35);
      text.y = Math.sin(textAngle) * (this.radius - 35);
      text.rotation = textAngle + Math.PI / 2;
      
      this.wheel.addChild(text);
    }
    
    // Inner Circle Neon Glow
    const inner = new Graphics();
    inner.circle(0, 0, this.radius * 0.5);
    inner.fill({ color: 0x09090b, alpha: 1 });
    inner.stroke({ width: 8, color: 0x00ffff, alpha: 0.4 });
    inner.circle(0, 0, this.radius * 0.45);
    inner.stroke({ width: 2, color: 0xffffff, alpha: 0.1 });
    this.wheel.addChild(inner);

    // Decorative Center Cap
    const cap = new Graphics();
    cap.circle(0, 0, 40);
    cap.fill({ color: 0x18181b });
    cap.stroke({ width: 4, color: 0x00ffff, alpha: 0.8 });
    this.wheel.addChild(cap);
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
    const angleStep = (Math.PI * 2) / this.segments;
    const targetRotation = -(targetIndex * angleStep + angleStep / 2) - (Math.PI / 2);
    const extraSpins = Math.PI * 2 * 5; // 5 full rotations
    
    return new Promise<void>((resolve) => {
      gsap.to(this.wheel, {
        rotation: targetRotation + extraSpins,
        duration: 4,
        ease: 'power4.out',
        onComplete: () => {
          // Normalize rotation to keep it clean
          this.wheel.rotation = targetRotation;
          resolve();
        }
      });
    });
  }

  public destroy() {
    this.container.destroy({ children: true });
  }
}
