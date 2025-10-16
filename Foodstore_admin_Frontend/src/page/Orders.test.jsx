
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

beforeEach(() => {
  const mockOrdersData = [
    { id: 1111, userId: 'user-1', status: 'PENDING', createdAt: new Date().toISOString() },
    { id: 1112, userId: 'user-2', status: 'SUCCESS', createdAt: new Date().toISOString() },
  ];
  vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockOrdersData),
  });
});

describe('Orders Page', () => {
  it('should render the orders table after fetching data', async () => {
    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    // Wait for the heading and data to appear
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /order status/i })).toBeInTheDocument();
    });

    // Check for table headers
    expect(screen.getByRole('columnheader', { name: /order id/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /user id/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /created at/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /info/i })).toBeInTheDocument();

    // Check for at least one order row (by its ID)
    expect(screen.getByText('1111')).toBeInTheDocument();
    expect(screen.getByText('1112')).toBeInTheDocument();
  });
});
