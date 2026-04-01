import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';


vi.mock('pixi.js', () => {
  const MockApp = vi.fn().mockImplementation(function(this: any) {
    this.init = vi.fn().mockResolvedValue(undefined);
    this.stage = { addChild: vi.fn() };
    this.renderer = { resize: vi.fn() };
    this.screen = { width: 800, height: 600 };
    this.destroy = vi.fn();
  });

  const MockContainer = vi.fn().mockImplementation(function(this: any) {
    this.addChild = vi.fn();
    this.position = { set: vi.fn() };
    this.scale = { set: vi.fn(), x: 1, y: 1 };
    this.removeChildren = vi.fn();
    this.on = vi.fn().mockReturnThis();
    this.off = vi.fn().mockReturnThis();
    this.emit = vi.fn().mockReturnThis();
    this.destroy = vi.fn();
  });

  const MockGraphics = vi.fn().mockImplementation(function(this: any) {
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
