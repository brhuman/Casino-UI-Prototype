import { useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { useGameStore } from '../store/useGameStore';

export const useAudio = (muted: boolean) => {
  const isSpinning = useGameStore(state => state.isSpinning);
  
  // Stubs for Howler instances. In real MVP we'd point to ./assets/audio.mp3
  const bgMusic = useRef<Howl | null>(null);
  const spinSfx = useRef<Howl | null>(null);
  const winSfx = useRef<Howl | null>(null);

  useEffect(() => {
    // Setup Audio
    bgMusic.current = new Howl({
      src: ['data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYxLjEuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'], // Dummy silent mp3 data
      loop: true,
      volume: 0.3
    });
    
    spinSfx.current = new Howl({
      src: ['data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYxLjEuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'],
      loop: true,
      volume: 0.5
    });

    winSfx.current = new Howl({
      src: ['data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYxLjEuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'],
      volume: 0.8
    });

    if (!muted) {
      bgMusic.current.play();
    }

    return () => {
      bgMusic.current?.unload();
      spinSfx.current?.unload();
      winSfx.current?.unload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Howler.mute(muted);
  }, [muted]);

  useEffect(() => {
    if (isSpinning) {
      spinSfx.current?.play();
    } else {
      spinSfx.current?.stop();
      // If we stopped and result matrix > 0 win, play win sound
      const winAmount = useGameStore.getState().lastWinAmount;
      if (winAmount > 0) {
        winSfx.current?.play();
      }
    }
  }, [isSpinning]);

};
