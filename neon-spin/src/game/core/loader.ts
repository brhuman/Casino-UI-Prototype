export const loadAssets = async (onProgress: (progress: number) => void) => {
  // Implemented fake loader for MVP without external assets to ensure it runs out of the box.
  // In production, we use PIXI.Assets.load() with SpriteSheets.
  return new Promise<void>((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.05 + Math.random() * 0.1;
      if (progress > 1) progress = 1;
      onProgress(progress);
      if (progress >= 1) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
};
