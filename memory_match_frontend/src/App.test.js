import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Memory Match header', () => {
  render(<App />);
  const title = screen.getByText(/Memory Match/i);
  expect(title).toBeInTheDocument();
});

test('shows moves pill', () => {
  render(<App />);
  const moves = screen.getByLabelText(/Moves:/i);
  expect(moves).toBeInTheDocument();
});
