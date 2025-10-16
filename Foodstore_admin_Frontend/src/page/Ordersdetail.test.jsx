
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Ordersdetail from './Ordersdetail';

beforeEach(() => {
  const mockOrderDetail = {
    id: 123,
    userId: 'user-abc',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    orderItems: [
      { id: 1, quantity: 1, product: { name: 'ไข่ไก่ทะเลเฟยเหอ', price: 100 } }
    ]
  };

  vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockOrderDetail),
  });
});

describe('Orders Detail Page', () => {
  it('should render order details after fetching data', async () => {
    const initialPath = '/admin/orders/orders-detail/123';

    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/admin/orders/orders-detail/:id" element={<Ordersdetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the heading with the order ID to appear
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Order #123/i })).toBeInTheDocument();
    });

    // Check for table content
    expect(screen.getByText(/ไข่ไก่ทะเลเฟยเหอ/i)).toBeInTheDocument();

    // Check for other details
    expect(screen.getByText(/user-abc/i)).toBeInTheDocument();
    expect(screen.getByText(/PENDING/i)).toBeInTheDocument();
  });
});
