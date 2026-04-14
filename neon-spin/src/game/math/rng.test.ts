import { describe, it, expect } from 'vitest';
import { generateResultMatrix, calculateWin, REELS_COUNT, ROWS_COUNT } from '@/game/math/rng';

describe('RNG Math Engine', () => {
  it('should generate a 5x3 matrix', () => {
    const matrix = generateResultMatrix();
    expect(matrix).toHaveLength(REELS_COUNT);
    matrix.forEach(col => {
      expect(col).toHaveLength(ROWS_COUNT);
    });
  });

  it('calculateWin should return 0 for no matches', () => {
    const loseMatrix = [
      [1, 2, 3],
      [4, 5, 1],
      [2, 3, 4],
      [5, 1, 2],
      [3, 4, 5]
    ];
    const { winAmount } = calculateWin(loseMatrix, 100);
    expect(winAmount).toBe(0);
  });

  it('calculateWin should calculate 3 of a kind', () => {
    const winMatrix = [
      [1, 2, 3],
      [1, 5, 1],
      [1, 3, 4],
      [5, 1, 2],
      [3, 4, 5]
    ];

    const { winAmount } = calculateWin(winMatrix, 100);
    expect(winAmount).toBe(1000);
  });

  it('calculateWin should correctly use wilds', () => {
    const winMatrix = [
      [2, 2, 3],
      [0, 5, 1],
      [0, 3, 4],
      [2, 1, 2],
      [3, 4, 5]
    ];

    const { winAmount } = calculateWin(winMatrix, 100);
    expect(winAmount).toBe(2000);
  });
});
