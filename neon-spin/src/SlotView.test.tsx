import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SlotView } from '@/views/SlotView';

// Mock PixiBridge since it's hard to test PIXI in JSDOM
vi.mock('./components/game/PixiBridge', () => ({
  PixiBridge: () => <div data-testid="pixi-bridge">Pixi Engine</div>
}));

describe('SlotView', () => {
  it('should render the PixiBridge component', () => {
    render(<SlotView />);
    expect(screen.getByTestId('pixi-bridge')).toBeInTheDocument();
  });
});
