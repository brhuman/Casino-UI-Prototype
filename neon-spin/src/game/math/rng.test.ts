import { describe, it, expect } from 'vitest';
import { generateResultMatrix, calculateWin, REELS_COUNT, ROWS_COUNT } from './rng';

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
    const win = calculateWin(loseMatrix, 100);
    expect(win).toBe(0);
  });

  it('calculateWin should calculate 3 of a kind', () => {
    const winMatrix = [
      [1, 2, 3],
      [1, 5, 1],
      [1, 3, 4], // 3 of symbol 1 (SEVEN) on row 0
      [5, 1, 2],
      [3, 4, 5]
    ];
    // Symbol 1 is SEVEN. Base is 10. Match 3 mult is 1. Bet is 100. Win = 100 * 1 * 10 = 1000
    const win = calculateWin(winMatrix, 100);
    expect(win).toBe(1000);
  });

  it('calculateWin should correctly use wilds', () => {
    const winMatrix = [
      [2, 2, 3],
      [0, 5, 1], // 0 is WILD
      [0, 3, 4],
      [2, 1, 2], // 4 of symbol 2 (BAR) on row 0
      [3, 4, 5]
    ];
    // Symbol 2 is BAR. Base is 5. Match 4 mult is 4. Bet is 100. Win = 100 * 4 * 5 = 2000
    const win = calculateWin(winMatrix, 100);
    expect(win).toBe(2000);
  });
});
