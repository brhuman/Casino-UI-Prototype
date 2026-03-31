# Deep Architecture Analysis: Mines Tab Hang Issue

After a detailed audit of the codebase, several critical architectural patterns have been identified that could lead to the reported hang in the "Mines" game, especially during automated testing or rapid UI interaction.

## 1. Concurrent PIXI v8 Initialization (StrictMode)
**Risk: High**
In `MinesView.tsx`, the `MinesEngine` is initialized within a `useEffect` with an empty dependency array. 
```tsx
useEffect(() => {
  const engine = new MinesEngine(wrappedSocket);
  engine.init(canvasRef.current);
  // ...
  return () => engine.destroy();
}, []);
```
In React 18+ **StrictMode**, this effect runs **twice** synchronously. 
- **The Problem**: both `engine.init` calls are asynchronous and target the **same canvas element**. PIXI v8's `app.init` is a heavy operation involving WebGL context creation. Initializing two separate Applications on the same canvas concurrently can lead to a WebGL deadlock or a browser hang.
- **Why it hangs on "minus"**: While the `useEffect` doesn't re-run on "minus" click, any previously pending or hung initialization might block the main thread or GPU, eventually causing a full freeze when the UI tries to re-render in response to the state update.

## 2. Asynchronous Initialization vs. Synchronous Destruction
**Risk: Medium**
In `MinesEngine.ts`, the `destroy()` method is synchronous, while `init()` is asynchronous.
If `destroy()` is called (due to unmounting) while `init()` is still awaiting `app.init()`, the engine sets `isDestroyed = true`. 
```ts
async init(canvas: HTMLCanvasElement) {
  await this.app.init({ ... });
  if (this.isDestroyed) {
    this.app.destroy(true, { children: true });
    return;
  }
}
```
However, the `this.app` instance was already created in the constructor. If `app.init()` hangs or doesn't honor the destruction state correctly during its internal async phases, it can leak Web Workers or Tickers that keep the test environment alive or frozen.

## 3. Atomic State vs. Component Re-renders
**Risk: Medium**
`MinesView` subscribes to the entire `useMinesStore` without a selector:
```tsx
const { isActive, currentBet, minesCount, multiplier, actions } = useMinesStore();
```
Every click on "minus" triggers a full re-render of the massive `MinesView` component. Inside this component, there are complex animations (Framer Motion) and a complex DOM structure. While not directly a hang, rapid re-renders combined with a struggling PIXI renderer can lead to event loop starvation.

## 4. Inconsistent Balance Stores
**Risk: Low/Medium**
- `Header.tsx` uses `useGameStore` for balance.
- `MinesView.tsx` uses `useUserStore` for balance.
When a game starts in Mines, the `FakeSocket` updates `useUserStore`. This mismatch means different parts of the UI are fighting for the balance update, potentially causing redundant re-render cascades across the entire layout.

## 5. Potential NaN Propagation
**Risk: Low**
The "Bet Amount" input allows raw number entry. `actions.setBet(Number(e.target.value))` does not guard against `NaN`. If `currentBet` becomes `NaN`, calculations like `currentBet * multiplier` will produce `NaN`, which might cause issues if passed down to PIXI or GSAP properties (though usually they just ignore it).

---

## Proposed Architectural Fixes

1. **Guard PIXI Initialization**: Implement a mounting guard to ensure only one PIXI instance is active and that `init` is not called until the previous one is fully disposed.
2. **State Selection**: Use specific selectors for `useMinesStore` to minimize re-renders.
3. **Synchronize Stores**: Unified balance management.
4. **GSAP/Ticker Cleanup**: Ensure ALL animations and timeouts are cleared on engine destruction.
