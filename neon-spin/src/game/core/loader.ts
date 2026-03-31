export const loadAssets = async (onProgress: (progress: number) => void) => {


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
