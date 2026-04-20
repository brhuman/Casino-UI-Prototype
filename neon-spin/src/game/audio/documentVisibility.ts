import gsap from 'gsap';
import { Howler } from 'howler';

let installed = false;

/** GSAP exposes useRAF at runtime; bundled typings omit it on Ticker. */
function setGsapTickerUseRaf(useRaf: boolean) {
  const ticker = gsap.ticker as typeof gsap.ticker & { useRAF?: (flag: boolean) => void };
  ticker.useRAF?.(useRaf);
}

/**
 * In background tabs Chrome often pauses rAF; GSAP then never reaches onComplete
 * while Howler loop sounds keep running on the audio thread. Use timeout-driven
 * GSAP ticks while hidden and stop playback when the document is not visible.
 */
export function setupDocumentVisibilityForAnimationsAndAudio() {
  if (installed || typeof document === 'undefined') return;
  installed = true;

  const sync = () => {
    const hidden = document.visibilityState === 'hidden';
    setGsapTickerUseRaf(!hidden);
    if (hidden) {
      Howler.stop();
    }
  };

  document.addEventListener('visibilitychange', sync);
  sync();
}
