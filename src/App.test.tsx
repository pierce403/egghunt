import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the egg hunt board', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Bunny Egg Hunt' })).toBeInTheDocument();
  expect(screen.getByText(/Score: 0/)).toBeInTheDocument();
  expect(screen.getByText('🐰')).toBeInTheDocument();
  expect(screen.getAllByText('🥚')).toHaveLength(5);
});
