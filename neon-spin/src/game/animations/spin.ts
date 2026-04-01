import gsap from 'gsap';
import { Container } from 'pixi.js';

export const spinReel = (
  reelContainer: Container,
  reelIndex: number,
  _resultColumn: number[],
  symbolSize: number,
  renderSpinFrame: () => void,
  renderFinalFrame: () => void,
  onComplete: () => void
) => {
  const motionState = { phase: 0 };
  let previousStep = -1;
  const spinSteps = 14 + (reelIndex * 3);

  gsap.killTweensOf(reelContainer);
  gsap.killTweensOf(motionState);

  gsap.to(reelContainer, {
    y: -24,
    duration: 0.16,
    ease: 'back.in(1)',
    delay: reelIndex * 0.1,
    onComplete: () => {
      renderSpinFrame();

      gsap.to(motionState, {
        phase: spinSteps,
        duration: 0.95 + reelIndex * 0.16,
        ease: 'none',
        onUpdate: () => {
          const currentStep = Math.floor(motionState.phase);
          if (currentStep !== previousStep) {
            previousStep = currentStep;
            renderSpinFrame();
          }

          const intraStep = motionState.phase - currentStep;
          reelContainer.y = -symbolSize + (intraStep * symbolSize);
        },
        onComplete: () => {
          reelContainer.y = -symbolSize;
          renderFinalFrame();

          gsap.to(reelContainer, {
            y: 0,
            duration: 0.36,
            ease: 'back.out(1.4)',
            onComplete,
          });
        },
      });
    },
  });
};
