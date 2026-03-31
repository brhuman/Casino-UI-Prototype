import gsap from 'gsap';
import { Container } from 'pixi.js';

export const spinReel = (
  reelContainer: Container, 
  reelIndex: number, 
  _resultColumn: number[], // In full app, used to set final textures
  symbolSize: number,
  onComplete: () => void
) => {
  const originalY = reelContainer.y;

  // 1. Anticipation: Pull back slightly before spin
  gsap.to(reelContainer, {
    y: originalY - 40,
    duration: 0.2,
    ease: "back.in(1)",
    delay: reelIndex * 0.1, // Stagger reels starting
    onComplete: () => {
      // 2. Fast Spin (simulate by moving Y way down)
      const spinDuration = 0.8 + reelIndex * 0.2;
      
      gsap.to(reelContainer, {
        y: originalY + (symbolSize * 15), // Overshoot target downwards
        duration: spinDuration,
        ease: "none",
        onComplete: () => {
          // Reset Y above screen for drop-in effect
          reelContainer.y = originalY - symbolSize;
          
          // 3. Elastic Back: Snap into place with bounce
          gsap.to(reelContainer, {
            y: originalY,
            duration: 0.4,
            ease: "back.out(1.5)",
            onComplete: onComplete
          });
        }
      });
    }
  });
};
