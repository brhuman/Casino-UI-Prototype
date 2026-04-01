import { useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { useGameStore } from '../store/useGameStore';
import { useUiStore } from '../store/useUiStore';

export const useAudio = () => {
  const isMuted = useUiStore(state => state.isMuted);
  const isSpinning = useGameStore(state => state.isSpinning);
  

  const bgMusic = useRef<Howl | null>(null);
  const spinSfx = useRef<Howl | null>(null);
  const winSfx = useRef<Howl | null>(null);

  useEffect(() => {

    bgMusic.current = new Howl({
      src: ['data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYxLjEuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'],
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

    if (!isMuted) {
      bgMusic.current.play();
    }

    return () => {
      bgMusic.current?.unload();
      spinSfx.current?.unload();
      winSfx.current?.unload();
    };

  }, []);

  useEffect(() => {
    Howler.mute(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (isSpinning) {
      spinSfx.current?.play();
    } else {
      spinSfx.current?.stop();

      const winAmount = useGameStore.getState().lastWinAmount;
      if (winAmount > 0) {
        winSfx.current?.play();
      }
    }
  }, [isSpinning]);

};
