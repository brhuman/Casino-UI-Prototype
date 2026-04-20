import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    testTimeout: 10000,
    hookTimeout: 10000,
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'json-summary', 'html'],
      all: false,
      // Scope gates to logic-heavy layers; untested PIXI/roulette UI does not drag down the metric.
      include: [
        'src/game/math/**/*.ts',
        'src/games/mines/**/*.ts',
        'src/store/**/*.ts',
      ],
      exclude: ['src/**/*.test.{ts,tsx}', '**/*.d.ts'],
      thresholds: {
        lines: 60,
        branches: 38,
        functions: 55,
        statements: 58,
      },
    },
  },
});
