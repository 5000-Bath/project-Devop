
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Orders from './Orders';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Orders Page', () => {
  it('should render the orders table with headers', () => {
    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    // Check for heading
    expect(screen.getByRole('heading', { name: /order status/i })).toBeInTheDocument();

    // Check for table headers
    expect(screen.getByRole('columnheader', { name: /^date$/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /order id/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /due date/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /total/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /info/i })).toBeInTheDocument();

    // Check for at least one order row (by its ID)
    expect(screen.getByText('1111')).toBeInTheDocument();
  });
});
