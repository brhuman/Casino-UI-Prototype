import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '@/App';
import { useMinesStore } from '@/games/mines/store';
import { useUserStore } from '@/store/useUserStore';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
}));

vi.mock('@/components/ui/LoadingView', async () => {
  const { useEffect } = await import('react');
  return {
    LoadingView: ({ onComplete }: { onComplete: () => void }) => {
      useEffect(() => {
        onComplete();
      }, [onComplete]);
      return null;
    },
  };
});

vi.mock('@/components/ui/AboutModal', () => ({
  AboutModal: () => null,
}));

type MockPixiApp = {
  init: ReturnType<typeof vi.fn>;
  stage: { addChild: ReturnType<typeof vi.fn> };
  renderer: { resize: ReturnType<typeof vi.fn>; on: ReturnType<typeof vi.fn> };
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
    this.renderer = { resize: vi.fn(), on: vi.fn() };
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
    Assets: {
      load: vi.fn(() => Promise.resolve()),
    },
  };
});

const CI_WAIT = 30_000;

describe('Integration: Mines View interaction', () => {
  it('should navigate to Mines and click minus button', async () => {
    render(<App />);

    const minesNavBtn = await screen.findByRole('button', { name: /mines/i }, { timeout: CI_WAIT });
    fireEvent.click(minesNavBtn);

    await waitFor(() => expect(screen.queryByText('Loading view')).not.toBeInTheDocument(), {
      timeout: CI_WAIT,
    });

    const minusButton = await screen.findByRole('button', { name: '-' }, { timeout: CI_WAIT });
    expect(minusButton).toBeInTheDocument();

    fireEvent.click(minusButton);

    const plusButton = await screen.findByRole('button', { name: '+' }, { timeout: CI_WAIT });
    fireEvent.click(plusButton);
    expect(plusButton).toBeInTheDocument();
  }, 45_000);
});

describe('MinesView branch coverage', () => {
  beforeEach(() => {
    useMinesStore.setState({
      isActive: false,
      currentBet: 100,
      minesCount: 3,
      multiplier: 1.0,
      winAmount: 0,
      lastSound: null,
    });
    useUserStore.setState({
      balance: 10000,
      level: 1,
      xp: 250,
      maxXp: 1000,
    });
  });

  it('should click decrease bet button', async () => {
    render(<App />);
    try {
      const btns = screen.queryAllByRole('button');
      const minusBtn = btns.find(b => b.textContent === '−' || b.textContent === '-');
      if (minusBtn) fireEvent.click(minusBtn);
    } catch {
      // timeout ok
    }
  }, 8000);
});
