/** Minimal socket surface used by MinesEngine (real or mocked). */
export interface MinesClientSocket {
  on(event: string, callback: (data: unknown) => void): void;
  off(event: string, callback?: (data: unknown) => void): void;
  emit(event: string, payload?: unknown): void;
}
