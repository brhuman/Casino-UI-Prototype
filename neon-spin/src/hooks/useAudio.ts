import { useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { useGameStore } from '@/store/useGameStore';
import { useSettingsStore } from '@/store/useSettingsStore';

export const useAudio = () => {
  const isMuted = useSettingsStore((state) => state.isMuted);
  const volume = useSettingsStore((state) => state.volume);
  const isSpinning = useGameStore(state => state.isSpinning);
  

  const bgMusic = useRef<Howl | null>(null);
  const spinStartSfx = useRef<Howl | null>(null);
  const spinSfx = useRef<Howl | null>(null);
  const winSfx = useRef<Howl | null>(null);

  useEffect(() => {
    Howler.volume(volume * 0.5);
  }, [volume]);

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

    const currentBgMusic = bgMusic.current;
    const currentSpinStartSfx = spinStartSfx.current;
    const currentSpinSfx = spinSfx.current;
    const currentWinSfx = winSfx.current;

    return () => {
      currentBgMusic?.unload();
      currentSpinStartSfx?.unload();
      currentSpinSfx?.unload();
      currentWinSfx?.unload();
    };

  }, [volume, isMuted]);

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
