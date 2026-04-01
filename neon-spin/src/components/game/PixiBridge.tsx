import { useEffect, useRef, useState } from 'react';
import { Application } from 'pixi.js';
import { initGameConfig, SLOT_STAGE_HEIGHT, SLOT_STAGE_WIDTH } from '../../game/core/init';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { useUserStore } from '../../store/useUserStore';
import { Button } from '../ui/Button';

export const PixiBridge = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const balance = useUserStore((state) => state.balance);
  const currentBet = useGameStore((state) => state.currentBet);
  const isSpinning = useGameStore((state) => state.isSpinning);
  const lastWinAmount = useGameStore((state) => state.lastWinAmount);
  const placeBet = useGameStore((state) => state.actions.placeBet);
  const increaseBet = useGameStore((state) => state.actions.increaseBet);
  const decreaseBet = useGameStore((state) => state.actions.decreaseBet);
  const canSpin = isLoaded && !isSpinning && balance >= currentBet;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isInterrupted = false;
    let localApp: Application | null = null;
    let unsubscribe: (() => void) | null = null;

    const setup = async () => {
      try {
        if (!canvas.isConnected) return;

        localApp = new Application();
        appRef.current = localApp;

        await localApp.init({
          canvas,
          width: SLOT_STAGE_WIDTH,
          height: SLOT_STAGE_HEIGHT,
          preference: 'webgl',
          backgroundColor: 0x02040a,
          backgroundAlpha: 1,
          autoDensity: true,
          resolution: 1,
        });

        if (isInterrupted) return;

        unsubscribe = await initGameConfig(localApp, (p: number) => setProgress(p));

        if (isInterrupted) return;
        setIsLoaded(true);
      } catch (err: unknown) {
        if (!isInterrupted) setError((err as Error).message || 'Failed to load game assets.');
        console.error('[PixiBridge] init error:', err);
      }
    };

    setup();

    return () => {
      isInterrupted = true;
      const app = appRef.current;
      appRef.current = null;

      if (app) {
        try {
          app.destroy(true, { children: true, texture: true });
        } catch (_) {
          // no-op during teardown
        }
      }

      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[2.35rem] bg-[radial-gradient(circle_at_top,_rgba(83,227,255,0.08),_transparent_20%),radial-gradient(circle_at_bottom,_rgba(255,0,153,0.08),_transparent_26%),linear-gradient(180deg,rgba(15,16,24,0.98),rgba(7,8,12,1)_18%,rgba(2,2,5,1))]">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_50%)] blur-3xl" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-[10px] pt-[10px] pb-[8px]">
        <div className="relative mx-auto flex h-full min-h-0 w-full flex-1 flex-col">
          <div className="relative h-[428px] shrink-0 overflow-hidden rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(24,24,32,0.96),rgba(11,11,17,0.98)_20%,rgba(7,7,10,1))] p-[6px] shadow-[0_22px_55px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="absolute inset-[6px] rounded-[1.45rem] border border-white/6 bg-[linear-gradient(180deg,rgba(4,6,12,0.94),rgba(2,2,5,0.98))] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-26px_45px_rgba(0,0,0,0.45)]" />
            <div className="absolute inset-x-[4%] top-[12px] h-[3px] rounded-full bg-gradient-to-r from-transparent via-cyan-300/75 to-transparent blur-[1px]" />

            <div className="relative z-10 flex h-full min-h-0 items-center justify-center overflow-hidden px-[5px] py-[5px]">
              <div
                className="relative h-auto w-full max-h-full overflow-hidden rounded-[1.3rem] border border-white/10 bg-[linear-gradient(180deg,rgba(26,27,35,0.96),rgba(9,10,16,0.98))] p-[5px] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_0_24px_rgba(0,0,0,0.25)]"
                style={{ aspectRatio: `${SLOT_STAGE_WIDTH} / ${SLOT_STAGE_HEIGHT}` }}
              >
                <div className="absolute inset-0 rounded-[1.3rem] shadow-[inset_0_0_0_2px_rgba(120,130,150,0.08),inset_0_0_28px_rgba(34,211,238,0.04)]" />
                <div className="absolute inset-[5px] rounded-[1.08rem] border border-cyan-300/12 bg-[linear-gradient(180deg,rgba(5,11,19,0.92),rgba(2,4,8,0.98))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />
                <canvas
                  ref={canvasRef}
                  className={`relative z-10 block h-full w-full rounded-[1.02rem] bg-[#02040a] transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                  style={{ filter: 'drop-shadow(0 0 18px rgba(255, 0, 255, 0.06))' }}
                />
              </div>
            </div>
          </div>

          <div className="relative z-20 mt-2 h-[154px] shrink-0">
            <div className="h-full w-full rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,35,44,0.96),rgba(13,14,19,0.98))] p-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_26px_rgba(255,0,153,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="h-full rounded-[1.05rem] border border-white/8 bg-[linear-gradient(180deg,rgba(6,7,12,0.96),rgba(14,14,18,0.98)_48%,rgba(8,8,11,1))] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-24px_30px_rgba(0,0,0,0.35)]">
                <div className="grid h-full gap-2.5 lg:grid-cols-[1.35fr_0.9fr_0.95fr]">
                  <div className="h-full rounded-[1.3rem] border border-cyan-300/12 bg-[linear-gradient(180deg,rgba(9,16,26,0.9),rgba(3,7,14,0.96))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_18px_rgba(34,211,238,0.08)]">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.38em] text-cyan-300/65">Bet Adjust</div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="min-h-11 min-w-11 rounded-[0.9rem] border-white/10 bg-[linear-gradient(180deg,rgba(36,37,46,0.96),rgba(10,11,18,0.98))] px-0 text-lg text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_18px_rgba(0,0,0,0.25)] hover:border-cyan-300/40 hover:bg-cyan-400/10"
                        disabled={isSpinning || currentBet <= 100}
                        onClick={decreaseBet}
                      >
                        -
                      </Button>

                      <div className="flex-1 rounded-[1rem] border border-cyan-300/14 bg-[linear-gradient(180deg,rgba(1,14,24,0.92),rgba(2,6,11,0.98))] px-3 py-2.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_24px_rgba(0,255,255,0.05)]">
                        <div className="text-[10px] font-bold uppercase tracking-[0.36em] text-cyan-300/60">Current Bet</div>
                        <div className="mt-1 font-mono text-xl font-semibold tracking-[0.08em] text-white">${currentBet}</div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="min-h-11 min-w-11 rounded-[0.9rem] border-white/10 bg-[linear-gradient(180deg,rgba(36,37,46,0.96),rgba(10,11,18,0.98))] px-0 text-lg text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_18px_rgba(0,0,0,0.25)] hover:border-cyan-300/40 hover:bg-cyan-400/10"
                        disabled={isSpinning || currentBet >= 5000}
                        onClick={increaseBet}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="grid h-full gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-[1.1rem] border border-emerald-300/10 bg-[linear-gradient(180deg,rgba(8,18,15,0.9),rgba(4,9,8,0.98))] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_16px_rgba(16,185,129,0.08)]">
                      <div className="text-[10px] font-bold uppercase tracking-[0.36em] text-emerald-300/60">Balance</div>
                      <div className="mt-1 font-mono text-lg font-semibold text-white">${balance.toLocaleString()}</div>
                    </div>

                    <div className="rounded-[1.1rem] border border-amber-300/12 bg-[linear-gradient(180deg,rgba(29,22,6,0.88),rgba(18,12,2,0.98))] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_16px_rgba(245,158,11,0.08)]">
                      <div className="text-[10px] font-bold uppercase tracking-[0.36em] text-amber-200/60">Win Meter</div>
                      <div className="mt-1 font-mono text-lg font-semibold text-amber-50">${lastWinAmount.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="h-full rounded-[1.1rem] border border-fuchsia-300/12 bg-[linear-gradient(180deg,rgba(31,10,35,0.84),rgba(10,6,18,0.98))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_18px_rgba(217,70,239,0.08)]">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.38em] text-fuchsia-200/60">Main Action</div>
                    <Button
                      type="button"
                      variant="secondary"
                      className="min-h-[56px] w-full rounded-[1rem] border border-cyan-300/18 bg-[linear-gradient(180deg,rgba(130,255,255,0.96),rgba(39,211,255,0.88)_56%,rgba(15,160,202,0.92))] px-4 text-sm font-black tracking-[0.22em] text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_18px_30px_rgba(0,0,0,0.28),0_0_34px_rgba(34,211,238,0.25)] hover:scale-[1.01] disabled:shadow-none sm:min-h-[62px] sm:text-base"
                      disabled={!canSpin}
                      onClick={placeBet}
                    >
                      {isSpinning ? 'Spinning...' : 'Spin'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!isLoaded && !error && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/88 backdrop-blur-md"
          >
            <div className="mb-4 h-2 w-64 overflow-hidden rounded-full border border-gray-700 bg-gray-800">
              <div
                className="h-full bg-gradient-to-r from-neon-blue to-neon-pink transition-all duration-200"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="animate-pulse font-mono text-neon-pink">Loading Assets... {Math.round(progress * 100)}%</p>
          </motion.div>
        )}

        {error && (
          <motion.div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black">
            <p className="mb-4 text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="cursor-pointer rounded bg-gray-800 px-6 py-2 text-white hover:bg-gray-700"
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
