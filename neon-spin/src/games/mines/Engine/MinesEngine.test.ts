import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { MinesClientSocket } from '@/games/mines/Engine/minesSocket';
import { useMinesStore } from '@/games/mines/store';
import gsap from 'gsap';

let resizeHandler: ((w: number, h: number) => void) | null = null;

const { TestCell } = vi.hoisted(() => {
  class TestCell {
    x = 0;
    y = 0;
    gridIndex: number;
    isRevealed = false;
    reveal = vi.fn((_type: 'SAFE' | 'BOMB') => {
      this.isRevealed = true;
    });
    private onPick: (idx: number) => void;

    constructor(index: number, _size: number, onPick: (idx: number) => void) {
      this.gridIndex = index;
      this.onPick = onPick;
    }

    simulatePick() {
      if (!this.isRevealed) this.onPick(this.gridIndex);
    }
  }
  return { TestCell };
});

vi.mock('pixi.js', () => ({
  Application: vi.fn(function MockApplication(this: {
    stage: { addChild: ReturnType<typeof vi.fn> };
    screen: { width: number; height: number };
    renderer: { on: ReturnType<typeof vi.fn> };
    ticker: { stop: ReturnType<typeof vi.fn> };
    destroy: ReturnType<typeof vi.fn>;
  }) {
    this.stage = { addChild: vi.fn() };
    this.screen = { width: 800, height: 600 };
    this.renderer = {
      on: vi.fn((ev: string, cb: (w: number, h: number) => void) => {
        if (ev === 'resize') resizeHandler = cb;
      }),
    };
    this.ticker = { stop: vi.fn() };
    this.destroy = vi.fn();
    return this;
  }),
  Container: vi.fn(function MockContainer(this: {
    x: number;
    y: number;
    removeChildren: ReturnType<typeof vi.fn>;
    addChild: ReturnType<typeof vi.fn>;
  }) {
    this.x = 0;
    this.y = 0;
    this.removeChildren = vi.fn();
    this.addChild = vi.fn();
    return this;
  }),
  Text: vi.fn(function MockText(this: {
    anchor: { set: ReturnType<typeof vi.fn> };
    y: number;
    alpha: number;
    scale: { set: ReturnType<typeof vi.fn> };
    destroy: ReturnType<typeof vi.fn>;
  }) {
    this.anchor = { set: vi.fn() };
    this.y = 0;
    this.alpha = 0;
    this.scale = { set: vi.fn() };
    this.destroy = vi.fn();
    return this;
  }),
  TextStyle: vi.fn(),
  Assets: {
    load: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('@/games/mines/Engine/Cell', () => ({
  Cell: TestCell,
}));

import { MinesEngine } from '@/games/mines/Engine/MinesEngine';

function createSocket(): MinesClientSocket & {
  trigger: (event: string, data: unknown) => void;
} {
  const handlers = new Map<string, (data: unknown) => void>();
  return {
    emit: vi.fn(),
    on: vi.fn((event: string, cb: (data: unknown) => void) => {
      handlers.set(event, cb);
    }),
    off: vi.fn((event: string, cb?: (data: unknown) => void) => {
      if (cb && handlers.get(event) === cb) handlers.delete(event);
      else if (!cb) handlers.delete(event);
    }),
    trigger(event: string, data: unknown) {
      handlers.get(event)?.(data);
    },
  };
}

async function createEngine() {
  const socket = createSocket();
  const engine = new MinesEngine(socket);
  const app = {
    stage: { addChild: vi.fn() },
    screen: { width: 800, height: 600 },
    renderer: {
      on: vi.fn((ev: string, cb: (w: number, h: number) => void) => {
        if (ev === 'resize') resizeHandler = cb;
      }),
    },
    ticker: { stop: vi.fn() },
    destroy: vi.fn(),
  } as unknown as import('pixi.js').Application;
  await engine.init(app);
  return { engine, socket, app };
}

describe('MinesEngine', () => {
  beforeEach(() => {
    resizeHandler = null;
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    useMinesStore.setState({
      isActive: false,
      currentBet: 100,
      minesCount: 3,
      multiplier: 1,
      winAmount: 0,
      lastSound: null,
    });
  });

  afterEach(() => {
    vi.mocked(Math.random).mockRestore();
    vi.useRealTimers();
  });

  it('subscribes to socket events on construction', () => {
    const socket = createSocket();
    new MinesEngine(socket);
    expect(socket.on).toHaveBeenCalledWith('MINES_STARTED', expect.any(Function));
    expect(socket.on).toHaveBeenCalledWith('MINES_RESULT', expect.any(Function));
    expect(socket.on).toHaveBeenCalledWith('MINES_CASHOUT_RESULT', expect.any(Function));
  });

  it('destroy without init skips PIXI teardown but still unsubscribes socket', () => {
    const socket = createSocket();
    const engine = new MinesEngine(socket);
    engine.destroy();
    expect(socket.off).toHaveBeenCalled();
  });

  it('init loads assets, mounts stage, and wires resize recentering', async () => {
    const { engine, app } = await createEngine();
    const { Assets } = await import('pixi.js');
    expect(Assets.load).toHaveBeenCalledWith(['/assets/gem_sprite.png', '/assets/mine_sprite.png']);
    expect(app.stage.addChild).toHaveBeenCalled();
    expect(resizeHandler).toBeTypeOf('function');
    resizeHandler!(1000, 600);
    const container = (engine as unknown as { container: { x: number; y: number } }).container;
    expect(container.x).toBe(500);
    expect(container.y).toBe(300);
  });

  it('startRound redraws grid, plays start sound, and emits MINES_START', async () => {
    const { engine, socket } = await createEngine();
    engine.startRound(250, { minesCount: 7 });
    expect(socket.emit).toHaveBeenCalledWith('MINES_START', { bet: 250, minesCount: 7 });
    expect(useMinesStore.getState().lastSound?.type).toBe('start');
    const gridContainer = (engine as unknown as { gridContainer: { removeChildren: ReturnType<typeof vi.fn> } })
      .gridContainer;
    expect(gridContainer.removeChildren).toHaveBeenCalled();
  });

  it('handlePick does nothing when game is inactive', async () => {
    const { engine, socket } = await createEngine();
    const cells = (engine as unknown as { cells: InstanceType<typeof TestCell>[] }).cells;
    expect(useMinesStore.getState().isActive).toBe(false);
    cells[0].simulatePick();
    expect(socket.emit).not.toHaveBeenCalled();
  });

  it('handlePick emits MINES_PICK and click sound when active', async () => {
    const { engine, socket } = await createEngine();
    useMinesStore.getState().actions.startGame();
    const cells = (engine as unknown as { cells: InstanceType<typeof TestCell>[] }).cells;
    cells[3].simulatePick();
    expect(useMinesStore.getState().lastSound?.type).toBe('click');
    expect(socket.emit).toHaveBeenCalledWith('MINES_PICK', { index: 3 });
  });

  it('handlePick does nothing when engine is destroyed', async () => {
    const { engine, socket } = await createEngine();
    useMinesStore.getState().actions.startGame();
    (engine as unknown as { isDestroyed: boolean }).isDestroyed = true;
    const cells = (engine as unknown as { cells: InstanceType<typeof TestCell>[] }).cells;
    cells[1].simulatePick();
    expect(socket.emit).not.toHaveBeenCalled();
  });

  it('cashout returns early when inactive', async () => {
    const { engine, socket } = await createEngine();
    engine.cashout();
    expect(socket.emit).not.toHaveBeenCalled();
  });

  it('cashout plays sound and emits when active', async () => {
    const { engine, socket } = await createEngine();
    useMinesStore.getState().actions.startGame();
    engine.cashout();
    expect(useMinesStore.getState().lastSound?.type).toBe('cashout');
    expect(socket.emit).toHaveBeenCalledWith('MINES_CASHOUT');
  });

  it('onGameStarted calls startGame only when success is true', async () => {
    const { socket } = await createEngine();
    socket.trigger('MINES_STARTED', { success: false });
    expect(useMinesStore.getState().isActive).toBe(false);
    socket.trigger('MINES_STARTED', { success: true });
    expect(useMinesStore.getState().isActive).toBe(true);
  });

  it('onServerResult SAFE updates progress and reveal sound when newMultiplier is truthy', async () => {
    const { engine } = await createEngine();
    useMinesStore.getState().actions.startGame();
    engine.onServerResult({ status: 'SAFE', newMultiplier: 2.5 });
    expect(useMinesStore.getState().multiplier).toBe(2.5);
    expect(useMinesStore.getState().lastSound?.type).toBe('reveal');
  });

  it('onServerResult SAFE skips store update when newMultiplier is missing or zero', async () => {
    const { engine } = await createEngine();
    useMinesStore.getState().actions.startGame();
    useMinesStore.setState({ multiplier: 3 });
    engine.onServerResult({ status: 'SAFE' });
    expect(useMinesStore.getState().multiplier).toBe(3);
    engine.onServerResult({ status: 'SAFE', newMultiplier: 0 });
    expect(useMinesStore.getState().multiplier).toBe(3);
    expect(useMinesStore.getState().lastSound?.type).not.toBe('reveal');
  });

  it('onServerResult BUST with grid reveals mines, plays bust, ends game, and shakes container', async () => {
    const { engine, socket } = await createEngine();
    useMinesStore.getState().actions.startGame();
    const cells = (engine as unknown as { cells: InstanceType<typeof TestCell>[] }).cells;
    cells[0].isRevealed = true;
    const grid = Array(25).fill(0);
    grid[0] = 1;
    grid[1] = 1;
    engine.onServerResult({ status: 'BUST', grid });
    expect(useMinesStore.getState().lastSound?.type).toBe('bust');
    expect(useMinesStore.getState().isActive).toBe(false);
    await vi.runAllTimersAsync();
    expect(cells[0].reveal).not.toHaveBeenCalled();
    expect(cells[1].reveal).toHaveBeenCalledWith('BOMB');
    expect(gsap.to).toHaveBeenCalled();
    expect(socket.emit).not.toHaveBeenCalled();
  });

  it('onServerResult BUST without grid does not end game', async () => {
    const { engine } = await createEngine();
    useMinesStore.getState().actions.startGame();
    engine.onServerResult({ status: 'BUST' });
    expect(useMinesStore.getState().isActive).toBe(true);
  });

  it('revealAll timeout skips reveal when engine already destroyed', async () => {
    const { engine } = await createEngine();
    useMinesStore.getState().actions.startGame();
    const grid = Array(25).fill(0);
    engine.onServerResult({ status: 'BUST', grid });
    (engine as unknown as { isDestroyed: boolean }).isDestroyed = true;
    await vi.runAllTimersAsync();
    const cells = (engine as unknown as { cells: InstanceType<typeof TestCell>[] }).cells;
    const revealCalls = cells.reduce((n, c) => n + c.reveal.mock.calls.length, 0);
    expect(revealCalls).toBe(0);
  });

  it('revealCellClient returns when destroyed or index invalid', async () => {
    const { engine } = await createEngine();
    (engine as unknown as { isDestroyed: boolean }).isDestroyed = true;
    engine.revealCellClient(0, true);
    (engine as unknown as { isDestroyed: boolean }).isDestroyed = false;
    engine.revealCellClient(99, true);
    const cells = (engine as unknown as { cells: InstanceType<typeof TestCell>[] }).cells;
    expect(cells[0].reveal).not.toHaveBeenCalled();
  });

  it('revealCellClient reveals SAFE or BOMB from flag', async () => {
    const { engine } = await createEngine();
    engine.revealCellClient(4, true);
    engine.revealCellClient(5, false);
    const cells = (engine as unknown as { cells: InstanceType<typeof TestCell>[] }).cells;
    expect(cells[4].reveal).toHaveBeenCalledWith('SAFE');
    expect(cells[5].reveal).toHaveBeenCalledWith('BOMB');
  });

  it('onCashoutResult ends game, reveals grid, and schedules win text animation', async () => {
    const { engine } = await createEngine();
    const grid = Array(25).fill(0);
    (engine as unknown as { onCashoutResult: (d: unknown) => void }).onCashoutResult({ winAmount: 420, grid });
    expect(useMinesStore.getState().isActive).toBe(false);
    expect(useMinesStore.getState().winAmount).toBe(420);
    await vi.runAllTimersAsync();
    expect(gsap.to).toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(2000);
    await vi.runAllTimersAsync();
  });

  it('destroy clears timeouts, unsubscribes socket, kills tweens, and destroys app', async () => {
    const { engine, socket, app } = await createEngine();
    useMinesStore.getState().actions.startGame();
    engine.onServerResult({
      status: 'BUST',
      grid: Array(25).fill(1),
    });
    engine.destroy();
    expect(socket.off).toHaveBeenCalled();
    expect(gsap.killTweensOf).toHaveBeenCalled();
    expect(app.ticker.stop).toHaveBeenCalled();
    expect(app.destroy).toHaveBeenCalledWith(true, { children: true, texture: true });
    await vi.runAllTimersAsync();
  });

  it('destroy swallows errors from app.destroy', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { engine, app } = await createEngine();
    (app.destroy as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('pixi teardown');
    });
    engine.destroy();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('showWinText early-returns second gsap when destroyed before timeout', async () => {
    const { engine } = await createEngine();
    const grid = Array(25).fill(0);
    (engine as unknown as { onCashoutResult: (d: unknown) => void }).onCashoutResult({ winAmount: 50, grid });
    (engine as unknown as { isDestroyed: boolean }).isDestroyed = true;
    await vi.advanceTimersByTimeAsync(2000);
    await vi.runAllTimersAsync();
  });
});
