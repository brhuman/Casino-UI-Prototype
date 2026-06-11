import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import '@/i18n';
import { setupDocumentVisibilityForAnimationsAndAudio } from '@/game/audio/documentVisibility';
import App from '@/App';

setupDocumentVisibilityForAnimationsAndAudio();
import { generateResultMatrix, calculateWin } from '@/game/math/rng';



if (import.meta.env.DEV) {
  (window as { __FastSpinSimulator?: unknown }).__FastSpinSimulator = (
    spins: number = 10000,
    bet: number = 100
  ) => {
    let totalBet = 0;
    let totalWin = 0;
    for (let i = 0; i < spins; i += 1) {
      totalBet += bet;
      totalWin += calculateWin(generateResultMatrix(), bet).winAmount;
    }
    return (totalWin / totalBet) * 100;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
