import { Howl, Howler } from 'howler';
import { useSettingsStore } from '@/store/useSettingsStore';

export class SoundManager {
  private spinSound: Howl | null = null;
  private rollingSound: Howl | null = null;
  private winSound: Howl | null = null;

  public init() {
    // Only load sounds when ready, prevents multiple initializations
    if (this.spinSound) return;

    const initialVolume = useSettingsStore.getState().volume;
    Howler.volume(initialVolume * 0.5);

    useSettingsStore.subscribe((state) => {
      Howler.volume(state.volume * 0.5);
    });

    this.spinSound = new Howl({
      src: ['/sounds/slot_spin.mp3'],
      volume: 0.3 * 1.0,
    });

    this.rollingSound = new Howl({
      src: ['/sounds/rolling.wav'],
      volume: 0.3 * 1.0,
      loop: true,
    });

    this.winSound = new Howl({
      src: ['/sounds/slot_win.mp3'],
      volume: 1.0,
    });
  }

  public playSpin() {
    this.spinSound?.play();
  }

  public startRolling() {
    if (this.rollingSound && !this.rollingSound.playing()) {
      this.rollingSound.play();
    }
  }

  public stopRolling() {
    this.rollingSound?.stop();
  }

  public playWin() {
    this.winSound?.play();
  }

  public stopAll() {
    this.spinSound?.stop();
    this.rollingSound?.stop();
    this.winSound?.stop();
    // Also global stop just in case
    Howler.stop();
  }
}

export const soundManager = new SoundManager();
