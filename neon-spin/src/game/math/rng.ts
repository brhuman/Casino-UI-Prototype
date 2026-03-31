// Simple client-side RNG and Math Engine for the Slot Machine

export const SYMBOLS = {
  WILD: 0,
  SEVEN: 1,
  BAR: 2,
  WATERMELON: 3,
  BELL: 4,
  CHERRY: 5
};

export const REELS_COUNT = 5;
export const ROWS_COUNT = 3;

// Strip for each reel (simplified)
const REEL_STRIPS = [
  [0, 1, 2, 3, 4, 5, 2, 3, 4, 5, 1, 4, 3, 5],
  [5, 4, 3, 2, 1, 0, 5, 4, 3, 2, 5, 4, 3, 2],
  [1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 1, 2, 3],
  [0, 5, 4, 3, 2, 1, 0, 5, 4, 3, 2, 1, 5, 4],
  [2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 1, 2, 3, 4]
];

export const generateResultMatrix = (): number[][] => {
  const matrix: number[][] = [];
  for (let c = 0; c < REELS_COUNT; c++) {
    const strip = REEL_STRIPS[c];
    const stopIndex = Math.floor(Math.random() * strip.length);
    const col: number[] = [];
    for (let r = 0; r < ROWS_COUNT; r++) {
       // Wrap around strip
       col.push(strip[(stopIndex + r) % strip.length]);
    }
    matrix.push(col);
  }
  // Convert Columns to Rows for easier line checking, or keep as columns.
  // We'll return it as Column-first [reelIndex][rowIndex]
  return matrix;
};

export const calculateWin = (matrix: number[][], currentBet: number): number => {
  // Simplified paytable evaluation: just looking for 3+ of a kind on any horizontal line (3 lines total)
  let winAmount = 0;
  
  for (let r = 0; r < ROWS_COUNT; r++) {
    let matchCount = 1;
    const firstSymbol = matrix[0][r];
    
    for (let c = 1; c < REELS_COUNT; c++) {
      if (matrix[c][r] === firstSymbol || matrix[c][r] === SYMBOLS.WILD) {
        matchCount++;
      } else {
        break;
      }
    }
    
    if (matchCount >= 3) {
       // Simple multiplier
       const mult = (matchCount === 5 ? 10 : matchCount === 4 ? 4 : 1);
       const symbolBase = (firstSymbol === SYMBOLS.SEVEN ? 10 : firstSymbol === SYMBOLS.BAR ? 5 : 2);
       winAmount += currentBet * mult * symbolBase;
    }
  }
  
  return winAmount;
};
