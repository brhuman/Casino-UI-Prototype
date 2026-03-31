import { Application } from 'pixi.js';

/**
 * Base generic interface that any Game Engine Plugin must implement
 */
export interface IGameEngine {
  /** Reference to the PIXI application initialized by PixiBridge */
  app: Application;
  
  /** 
   * Starts a new round/spin/game from the client.
   * Can accept a bet amount and any specific payload (e.g., minesCount) 
   */
  startRound(bet: number, payload?: unknown): void;
  
  /** 
   * Called when WebSocket sends a result to the client 
   */
  onServerResult(data: unknown): void;
  
  /** 
   * Trigger cleanup when the game view unmounts 
   */
  destroy(): void;
}
