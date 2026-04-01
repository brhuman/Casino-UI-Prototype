import { Howl, Howler } from 'howler';
import { useUserStore } from '../../store/useUserStore';

export class SoundManager {
  private spinSound: Howl | null = null;
  private rollingSound: Howl | null = null;
  private winSound: Howl | null = null;

  public init() {
    // Only load sounds when ready, prevents multiple initializations
    if (this.spinSound) return;

    const globalVol = useUserStore.getState().globalVolume;
    Howler.volume(globalVol * 0.5);

    useUserStore.subscribe((state) => {
      Howler.volume(state.globalVolume * 0.5);
    });

    this.spinSound = new Howl({
      src: ['/assets/spin.mp3'],
      volume: 0.3 * 1.0,
    });

    this.rollingSound = new Howl({
      src: ['/assets/rolling.mp3'],
      volume: 0.3 * 1.0,
      loop: true,
    });

    this.winSound = new Howl({
      src: ['/assets/win.mp3'],
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
