import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useMinesStore } from '../store';
import { useUiStore } from '../../../store/useUiStore';
import { useUserStore } from '../../../store/useUserStore';

// Small neon-themed sound effects in base64
const SOUND_ASSETS = {
  click: '/sounds/ui_click.mp3',
  reveal: '/sounds/mine_reveal_pleasant.mp3',
  bust: '/sounds/mine_bust.mp3',
  cashout: '/sounds/slot_win.mp3',
  start: '/sounds/ui_click.mp3'
};

export const useMinesAudio = () => {
  const isMuted = useUiStore((state: any) => state.isMuted);
  const lastSound = useMinesStore((state: any) => state.lastSound);
  const globalVolume = useUserStore((state: any) => state.globalVolume);
  
  const sounds = useRef<Record<string, Howl>>({});

  useEffect(() => {
    // Initialize sounds with global volume scale and 0.5 cap
    const volumeFactor = globalVolume * 0.5;
    
    Object.entries(SOUND_ASSETS).forEach(([key, src]) => {
      const baseVol = key === 'bust' ? 0.27 : (key === 'cashout' ? 1.0 : 0.5);
      sounds.current[key] = new Howl({ 
        src: [src],
        volume: baseVol * volumeFactor
      });
    });

    return () => {
      Object.values(sounds.current).forEach(s => s.unload());
    };
  }, [globalVolume]);

  useEffect(() => {
    // Only play if it's a fresh sound change and not on mount
    if (isMuted || !lastSound) return;

    const sound = sounds.current[lastSound.type];
    if (sound) {
      sound.play();
    }
  }, [lastSound, isMuted]);
};
