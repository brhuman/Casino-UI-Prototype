import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { Application, type ApplicationOptions } from 'pixi.js';

interface UsePixiApplicationOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  getOptions: (canvas: HTMLCanvasElement) => Partial<ApplicationOptions>;
  initialize: (app: Application) => Promise<void | (() => void)>;
  timeoutMs?: number;
}

export const usePixiApplication = ({
  canvasRef,
  getOptions,
  initialize,
  timeoutMs = 20000,
}: UsePixiApplicationOptions) => {
  const appRef = useRef<Application | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setIsLoaded(false);
    setError(null);
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let active = true;
    let dispose: void | (() => void);
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const app = new Application();
    appRef.current = app;
    const setup = async () => {
      try {
        const timeout = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(
            () => reject(new Error(`PIXI initialization timed out after ${timeoutMs / 1000} seconds`)),
            timeoutMs
          );
        });
        await Promise.race([app.init(getOptions(canvas)), timeout]);
        if (timeoutId) clearTimeout(timeoutId);
        if (!active) return;

        dispose = await initialize(app);
        if (!active) {
          dispose?.();
          return;
        }
        setIsLoaded(true);
      } catch (reason) {
        if (timeoutId) clearTimeout(timeoutId);
        if (active) {
          setError(reason instanceof Error ? reason.message : 'Failed to initialize game engine.');
        }
      }
    };

    void setup();

    return () => {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
      dispose?.();
      if (appRef.current === app) appRef.current = null;
      try {
        app.destroy(true, { children: true, texture: true });
      } catch {
        // PIXI may throw when initialization was interrupted before renderer creation.
      }
    };
  }, [attempt, canvasRef, getOptions, initialize, timeoutMs]);

  return { appRef, isLoaded, error, retry };
};
