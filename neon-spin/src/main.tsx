import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { generateResultMatrix, calculateWin } from './game/math/rng';

// RTP Fast Spin Simulator
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).__FastSpinSimulator = (spins: number = 10000, bet: number = 100) => {
  console.log(`🚀 Starting Fast Spin Simulator (${spins} spins at $${bet} bet)...`);
  let totalBet = 0;
  let totalWin = 0;
  
  const startTime = performance.now();
  for (let i = 0; i < spins; i++) {
    totalBet += bet;
    const matrix = generateResultMatrix();
    totalWin += calculateWin(matrix, bet);
  }
  const endTime = performance.now();
  
  const rtp = (totalWin / totalBet) * 100;
  console.log(`⏱ Time taken: ${(endTime - startTime).toFixed(2)}ms`);
  console.log(`🎯 Total Bet: $${totalBet}`);
  console.log(`💰 Total Win: $${totalWin}`);
  console.log(`📊 Actual RTP: ${rtp.toFixed(2)}%`);
  return rtp;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
