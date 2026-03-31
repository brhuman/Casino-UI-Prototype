import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from './useUserStore';

describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.setState({
      token: null,
      userId: null,
      username: 'Guest',
      balance: 10000,
    });
  });

  it('should have default state', () => {
    const state = useUserStore.getState();
    expect(state.token).toBeNull();
    expect(state.userId).toBeNull();
    expect(state.username).toBe('Guest');
    expect(state.balance).toBe(10000);
  });

  it('should login user', () => {
    useUserStore.getState().actions.login('test-token', 'user-123', 'PlayerOne', 5000);
    const state = useUserStore.getState();
    expect(state.token).toBe('test-token');
    expect(state.userId).toBe('user-123');
    expect(state.username).toBe('PlayerOne');
    expect(state.balance).toBe(5000);
  });

  it('should logout user', () => {
    useUserStore.getState().actions.login('test-token', 'user-123', 'PlayerOne', 5000);
    
    useUserStore.getState().actions.logout();
    const state = useUserStore.getState();
    expect(state.token).toBeNull();
    expect(state.userId).toBeNull();
    expect(state.username).toBe('Guest');
    expect(state.balance).toBe(5000); 
  });

  it('should update balance', () => {
    useUserStore.getState().actions.updateBalance(1500);
    expect(useUserStore.getState().balance).toBe(11500);

    useUserStore.getState().actions.updateBalance(-500);
    expect(useUserStore.getState().balance).toBe(11000);
  });
});
