import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders a top-level heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
