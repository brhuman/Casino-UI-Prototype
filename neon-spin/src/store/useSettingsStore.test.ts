import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from './useSettingsStore';

describe('useSettingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      isMuted: false,
      volume: 0.5,
      theme: 'neon',
    });
  });

  it('should have default state', () => {
    const state = useSettingsStore.getState();
    expect(state.isMuted).toBe(false);
    expect(state.volume).toBe(0.5);
    expect(state.theme).toBe('neon');
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

  it('should set theme', () => {
    useSettingsStore.getState().actions.setTheme('cyberpunk');
    expect(useSettingsStore.getState().theme).toBe('cyberpunk');
  });
});
