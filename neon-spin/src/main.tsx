import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import '@/i18n';
import App from '@/App';
import { generateResultMatrix, calculateWin } from '@/game/math/rng';



(window as { __FastSpinSimulator?: unknown }).__FastSpinSimulator = (spins: number = 10000, bet: number = 100) => {
  let totalBet = 0;
  let totalWin = 0;

  for (let i = 0; i < spins; i++) {
    totalBet += bet;
    const matrix = generateResultMatrix();
    totalWin += calculateWin(matrix, bet).winAmount;
  }

  const rtp = (totalWin / totalBet) * 100;
  return rtp;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
