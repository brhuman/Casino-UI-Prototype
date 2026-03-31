import { describe, it, expect, beforeEach } from 'vitest';
import { useUiStore } from './useUiStore';

describe('useUiStore', () => {
  beforeEach(() => {
    useUiStore.setState({
      currentView: 'lobby',
    });
  });

  it('should have default state', () => {
    const state = useUiStore.getState();
    expect(state.currentView).toBe('lobby');
  });

  it('should set view', () => {
    useUiStore.getState().setView('slots');
    expect(useUiStore.getState().currentView).toBe('slots');

    useUiStore.getState().setView('profile');
    expect(useUiStore.getState().currentView).toBe('profile');
  });
});
