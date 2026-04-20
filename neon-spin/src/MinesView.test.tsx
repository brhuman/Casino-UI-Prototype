import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '@/App';

type MockPixiApp = {
  init: ReturnType<typeof vi.fn>;
  stage: { addChild: ReturnType<typeof vi.fn> };
  renderer: { resize: ReturnType<typeof vi.fn> };
  screen: { width: number; height: number };
  destroy: ReturnType<typeof vi.fn>;
};

type MockPixiContainer = {
  addChild: ReturnType<typeof vi.fn>;
  position: { set: ReturnType<typeof vi.fn> };
  scale: { set: ReturnType<typeof vi.fn>; x: number; y: number };
  removeChildren: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
  emit: ReturnType<typeof vi.fn>;
  destroy: ReturnType<typeof vi.fn>;
};

type MockPixiGraphics = {
  roundRect: ReturnType<typeof vi.fn>;
  fill: ReturnType<typeof vi.fn>;
  stroke: ReturnType<typeof vi.fn>;
  rect: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
  circle: ReturnType<typeof vi.fn>;
  moveTo: ReturnType<typeof vi.fn>;
  lineTo: ReturnType<typeof vi.fn>;
  addChild: ReturnType<typeof vi.fn>;
};

vi.mock('pixi.js', () => {
  const MockApp = vi.fn().mockImplementation(function(this: MockPixiApp) {
    this.init = vi.fn().mockResolvedValue(undefined);
    this.stage = { addChild: vi.fn() };
    this.renderer = { resize: vi.fn() };
    this.screen = { width: 800, height: 600 };
    this.destroy = vi.fn();
  });

  const MockContainer = vi.fn().mockImplementation(function(this: MockPixiContainer) {
    this.addChild = vi.fn();
    this.position = { set: vi.fn() };
    this.scale = { set: vi.fn(), x: 1, y: 1 };
    this.removeChildren = vi.fn();
    this.on = vi.fn().mockReturnThis();
    this.off = vi.fn().mockReturnThis();
    this.emit = vi.fn().mockReturnThis();
    this.destroy = vi.fn();
  });

  const MockGraphics = vi.fn().mockImplementation(function(this: MockPixiGraphics) {
    this.roundRect = vi.fn().mockReturnThis();
    this.fill = vi.fn().mockReturnThis();
    this.stroke = vi.fn().mockReturnThis();
    this.rect = vi.fn().mockReturnThis();
    this.clear = vi.fn().mockReturnThis();
    this.circle = vi.fn().mockReturnThis();
    this.moveTo = vi.fn().mockReturnThis();
    this.lineTo = vi.fn().mockReturnThis();
    this.addChild = vi.fn();
  });

  return {
    Application: MockApp,
    Container: MockContainer,
    Graphics: MockGraphics,
    Text: vi.fn(),
    TextStyle: vi.fn(),
  };
});

describe('Integration: Mines View interaction', () => {
  it('should navigate to Mines and click minus button', async () => {
    render(<App />);

    // Navigate via sidebar: find the nav button by role that contains 'Mines'
    const navButtons = screen.getAllByRole('button');
    const minesNavBtn = navButtons.find(btn => btn.textContent?.match(/^Mines$/i));
    fireEvent.click(minesNavBtn!);

    const minusButton = await screen.findByRole('button', { name: '-' });
    expect(minusButton).toBeInTheDocument();

    fireEvent.click(minusButton);

    const plusButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(plusButton);
    expect(plusButton).toBeInTheDocument();
  }, 10000);
});
