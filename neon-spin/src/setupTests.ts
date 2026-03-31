import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock GSAP to prevent animation-related hangs in tests
vi.mock('gsap', () => ({
  default: {
    to: vi.fn((_target: any, vars: any) => {
      // Immediately call onComplete if provided
      if (vars.onComplete) vars.onComplete();
      return { kill: vi.fn() };
    }),
    from: vi.fn((_target: any, vars: any) => {
      if (vars.onComplete) vars.onComplete();
      return { kill: vi.fn() };
    }),
    set: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      add: vi.fn().mockReturnThis(),
      play: vi.fn().mockReturnThis(),
      kill: vi.fn().mockReturnThis(),
    })),
  },
}));

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
});
