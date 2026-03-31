import gsap from 'gsap';
import { Container } from 'pixi.js';

export const spinReel = (
  reelContainer: Container, 
  reelIndex: number, 
  _resultColumn: number[],
  symbolSize: number,
  onComplete: () => void
) => {
  const originalY = reelContainer.y;


  gsap.to(reelContainer, {
    y: originalY - 40,
    duration: 0.2,
    ease: "back.in(1)",
    delay: reelIndex * 0.1,
    onComplete: () => {

      const spinDuration = 0.8 + reelIndex * 0.2;
      
      gsap.to(reelContainer, {
        y: originalY + (symbolSize * 15),
        duration: spinDuration,
        ease: "none",
        onComplete: () => {

          reelContainer.y = originalY - symbolSize;
          

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
