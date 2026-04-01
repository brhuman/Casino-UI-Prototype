import { Assets, Texture } from 'pixi.js';

const SYMBOL_TEXTURE_PATHS = [
  '/slots/wild.png',
  '/slots/seven.png',
  '/slots/bar.png',
  '/slots/watermelon.png',
  '/slots/bell.png',
  '/slots/cherry.png',
] as const;

const symbolTextures: Texture[] = [];

export const loadAssets = async (onProgress: (progress: number) => void) => {
  if (symbolTextures.length === SYMBOL_TEXTURE_PATHS.length) {
    onProgress(1);
    return;
  }

  onProgress(0);

  for (let index = 0; index < SYMBOL_TEXTURE_PATHS.length; index += 1) {
    const texture = await Assets.load<Texture>(SYMBOL_TEXTURE_PATHS[index]);
    symbolTextures[index] = texture;
    onProgress((index + 1) / SYMBOL_TEXTURE_PATHS.length);
  }
};

export const getSymbolTexture = (symbolId: number) => {
  const texture = symbolTextures[symbolId];

  if (!texture) {
    throw new Error(`Symbol texture ${symbolId} was requested before assets finished loading.`);
  }

  return texture;
};
