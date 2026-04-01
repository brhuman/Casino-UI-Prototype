import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useMinesStore } from '../store';
import { useUiStore } from '../../../store/useUiStore';

// Small neon-themed sound effects in base64
const SOUND_ASSETS = {
  click: '/sounds/ui_click.mp3',
  reveal: '/sounds/mine_reveal.mp3',
  bust: '/sounds/mine_bust.mp3',
  cashout: '/sounds/slot_win.mp3',
  start: '/sounds/slot_start.mp3'
};

export const useMinesAudio = () => {
  const isMuted = useUiStore(state => state.isMuted);
  const lastSound = useMinesStore(state => state.lastSound);
  
  const sounds = useRef<Record<string, Howl>>({});

  useEffect(() => {
    // Initialize sounds
    Object.entries(SOUND_ASSETS).forEach(([key, src]) => {
      sounds.current[key] = new Howl({ 
        src: [src],
        volume: key === 'bust' ? 0.8 : (key === 'cashout' ? 1.0 : 0.5)
      });
    });

    return () => {
      Object.values(sounds.current).forEach(s => s.unload());
    };
  }, []);

  useEffect(() => {
    // Only play if it's a fresh sound change and not on mount
    if (isMuted || !lastSound) return;

    const sound = sounds.current[lastSound.type];
    if (sound) {
      sound.play();
    }
  }, [lastSound, isMuted]);
};
