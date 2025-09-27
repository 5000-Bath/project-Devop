
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from './Home';

// Mock the recharts library
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => <div data-testid="recharts-container">{children}</div>,
  };
});

describe('Admin Home Page (Dashboard)', () => {
  it('should render the main dashboard and section headings', () => {
    render(<Home />);

    // Check for the main header
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();

    // Check for the main sections
    expect(screen.getByRole('heading', { name: /recent orders/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /top products/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /inventory alerts/i })).toBeInTheDocument();

    // Check that the recharts mock is rendered
    expect(screen.getByTestId('recharts-container')).toBeInTheDocument();
  });
});
