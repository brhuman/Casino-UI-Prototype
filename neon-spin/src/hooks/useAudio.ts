import { useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { useGameStore } from '../store/useGameStore';
import { useUiStore } from '../store/useUiStore';

export const useAudio = () => {
  const isMuted = useUiStore(state => state.isMuted);
  const isSpinning = useGameStore(state => state.isSpinning);
  

  const bgMusic = useRef<Howl | null>(null);
  const spinStartSfx = useRef<Howl | null>(null);
  const spinSfx = useRef<Howl | null>(null);
  const winSfx = useRef<Howl | null>(null);

  useEffect(() => {

    spinStartSfx.current = new Howl({
      src: ['/sounds/slot_start.mp3'],
      volume: 0.6
    });
    
    spinSfx.current = new Howl({
      src: ['/sounds/slot_spin.mp3'],
      loop: true,
      volume: 0.4
    });

    winSfx.current = new Howl({
      src: ['/sounds/slot_win.mp3'],
      volume: 0.8
    });

    if (!isMuted && bgMusic.current) {
      bgMusic.current.play();
    }

    return () => {
      bgMusic.current?.unload();
      spinStartSfx.current?.unload();
      spinSfx.current?.unload();
      winSfx.current?.unload();
    };

  }, []);

  useEffect(() => {
    Howler.mute(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (isSpinning) {
      spinStartSfx.current?.play();
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
