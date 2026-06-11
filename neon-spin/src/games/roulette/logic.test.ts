import { describe, expect, it } from 'vitest';
import { calculateRoulettePayout, getRouletteColor } from '@/games/roulette/logic';

describe('roulette logic', () => {
  it('uses the standard European roulette colors', () => {
    expect(getRouletteColor(0)).toBe('green');
    expect(getRouletteColor(1)).toBe('red');
    expect(getRouletteColor(2)).toBe('black');
  });

  it('calculates color and parity payouts including returned stake', () => {
    expect(calculateRoulettePayout('red', 100, 1)).toBe(200);
    expect(calculateRoulettePayout('black', 100, 1)).toBe(0);
    expect(calculateRoulettePayout('even', 100, 12)).toBe(200);
    expect(calculateRoulettePayout('odd', 100, 12)).toBe(0);
  });

  it('pays 36x for zero and rejects invalid outcomes', () => {
    expect(calculateRoulettePayout('green', 100, 0)).toBe(3600);
    expect(calculateRoulettePayout('green', 100, 37)).toBe(0);
  });
});
