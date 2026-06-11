export type RouletteBet = 'red' | 'black' | 'green' | 'even' | 'odd';

const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

export const getRouletteColor = (result: number): 'red' | 'black' | 'green' => {
  if (result === 0) return 'green';
  return RED_NUMBERS.has(result) ? 'red' : 'black';
};

export const calculateRoulettePayout = (
  bet: RouletteBet,
  stake: number,
  result: number
): number => {
  if (!Number.isInteger(result) || result < 0 || result > 36 || stake <= 0) return 0;

  const color = getRouletteColor(result);
  if (bet === 'green') return result === 0 ? stake * 36 : 0;
  if (bet === 'red' || bet === 'black') return color === bet ? stake * 2 : 0;
  if (result === 0) return 0;
  if (bet === 'even') return result % 2 === 0 ? stake * 2 : 0;
  return result % 2 !== 0 ? stake * 2 : 0;
};
