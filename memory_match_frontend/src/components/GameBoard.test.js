import { render, screen, within } from '@testing-library/react';
import GameBoard from './GameBoard';

describe('GameBoard', () => {
  test('renders 16 cards in grid', () => {
    render(<GameBoard />);
    const grid = screen.getByRole('grid', { name: /Cards grid/i });
    const cells = within(grid).getAllByRole('gridcell');
    expect(cells.length).toBe(16);
  });

  test('renders moves and time', () => {
    render(<GameBoard />);
    expect(screen.getByLabelText(/Moves:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time:/i)).toBeInTheDocument();
  });
});
