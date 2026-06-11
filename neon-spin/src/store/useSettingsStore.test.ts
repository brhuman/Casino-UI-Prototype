import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '@/store/useSettingsStore';

describe('useSettingsStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState({
      isMuted: false,
      volume: 0.3,
    });
  });

  it('should have default state', () => {
    const state = useSettingsStore.getState();
    expect(state.isMuted).toBe(false);
    expect(state.volume).toBe(0.3);
  });

  it('should toggle mute', () => {
    useSettingsStore.getState().actions.toggleMute();
    expect(useSettingsStore.getState().isMuted).toBe(true);

    useSettingsStore.getState().actions.toggleMute();
    expect(useSettingsStore.getState().isMuted).toBe(false);
  });

  it('should set volume', () => {
    useSettingsStore.getState().actions.setVolume(0.8);
    expect(useSettingsStore.getState().volume).toBe(0.8);
  });

  it('should set muted explicitly', () => {
    useSettingsStore.getState().actions.setMuted(true);
    expect(useSettingsStore.getState().isMuted).toBe(true);
  });

});
