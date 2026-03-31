import { Application } from 'pixi.js';


export interface IGameEngine {
  
  app: Application;
  
  
  startRound(bet: number, payload?: unknown): void;
  
  
  onServerResult(data: unknown): void;
  
  
  destroy(): void;
}
