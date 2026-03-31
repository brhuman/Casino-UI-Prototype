import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { generateResultMatrix, calculateWin } from './game/math/rng';



(window as any).__FastSpinSimulator = (spins: number = 10000, bet: number = 100) => {
  let totalBet = 0;
  let totalWin = 0;

  for (let i = 0; i < spins; i++) {
    totalBet += bet;
    const matrix = generateResultMatrix();
    totalWin += calculateWin(matrix, bet);
  }

  const rtp = (totalWin / totalBet) * 100;
  return rtp;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
