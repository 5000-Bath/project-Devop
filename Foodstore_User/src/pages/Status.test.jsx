
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Status from './Status';
import * as mockDb from '../mockdb';

// Mock the db module
vi.mock('../mockdb');

const renderWithRouter = (route) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Status />
    </MemoryRouter>
  );
};

describe('Status Page', () => {
  it('should display the initial prompt when no order ID is provided', () => {
    renderWithRouter('/status');
    expect(screen.getByText(/please enter your order id/i)).toBeInTheDocument();
  });

  it('should display an error if the order ID from URL is not found', async () => {
    mockDb.getOrderById.mockReturnValue(null);
    renderWithRouter('/status?orderId=999');
    
    await waitFor(() => {
        expect(screen.getByText(/order with id "999" not found/i)).toBeInTheDocument();
    });
  });

  it('should fetch and display order details when a valid order ID is in the URL', async () => {
    const mockOrder = {
      id: '1',
      status: 'Order Received',
      events: [
        { icon: 'icon.svg', title: 'Order Received', time: '2025-09-26 10:00', status: 'done' },
      ],
      items: [
        { name: 'Khao Man Kai', price: 50, quantity: 1, img: 'test.jpg' },
      ],
      deliveryFee: 40,
      currency: 'THB',
    };
    mockDb.getOrderById.mockReturnValue(mockOrder);

    renderWithRouter('/status?orderId=1');

    await waitFor(() => {
      // Check for status title
      expect(screen.getByRole('heading', { name: /order status : order received/i })).toBeInTheDocument();
    });

    // Check for order ID
    expect(screen.getByText(/#your order id : 1/i)).toBeInTheDocument();

    // Check for item in summary
    expect(screen.getByText('Khao Man Kai')).toBeInTheDocument();

    // Check for total price
    const total = 50 + 40;
    const totalElement = screen.getByText('Total Price').parentElement;
    expect(totalElement).toHaveTextContent(`${total} THB`);
  });
});
