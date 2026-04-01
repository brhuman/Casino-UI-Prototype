import { Howl, Howler } from 'howler';

export class SoundManager {
  private spinSound: Howl | null = null;
  private rollingSound: Howl | null = null;
  private winSound: Howl | null = null;

  public init() {
    // Only load sounds when ready, prevents multiple initializations
    if (this.spinSound) return;

    // Use Howler global settings if needed
    Howler.volume(0.8);

    this.spinSound = new Howl({
      src: ['/sounds/spin.wav'],
      volume: 0.6,
    });

    this.rollingSound = new Howl({
      src: ['/sounds/rolling.wav'],
      volume: 0.4,
      loop: true,
    });

    this.winSound = new Howl({
      src: ['/sounds/win.wav'],
      volume: 0.9,
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
}

export const soundManager = new SoundManager();
