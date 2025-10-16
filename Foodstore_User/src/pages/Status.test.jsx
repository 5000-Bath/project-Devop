import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Status from './Status';
import { setupServer } from 'msw/node';
import { handlers } from '../mocks/handlers';

// Setup MSW server
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Helper function to render Status with router context
const renderWithRouter = (initialRoute = '/status') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/status" element={<Status />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Status Page', () => {
  it('should display the initial prompt when no order ID is provided', () => {
    renderWithRouter();
    expect(screen.getByText(/please enter your order id/i)).toBeInTheDocument();
  });

  it('should display an error if the order ID is not found', async () => {
    const user = userEvent.setup();
    renderWithRouter();
    
    const input = screen.getByPlaceholderText(/check your order/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(input, '999'); // non-existent ID
    await user.click(searchButton);

    // Wait for the Swal popup to appear (error message)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /ไม่พบออเดอร์/i })).toBeInTheDocument();
    });
    expect(screen.getByText(/หมายเลขออเดอร์นี้ไม่ถูกต้อง/i)).toBeInTheDocument();
  });

  it('should fetch and display order details for a valid order ID', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const input = screen.getByPlaceholderText(/check your order/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(input, '1');
    await user.click(searchButton);

    // Wait for order details to render
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /order status : pending/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/#your order id : 1/i)).toBeInTheDocument();
    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
  });

  it('should handle another status (e.g., COMPLETED) correctly', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const input = screen.getByPlaceholderText(/check your order/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(input, '2');
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /order status : completed/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/#your order id : 2/i)).toBeInTheDocument();
    expect(screen.getByText('Test Item 2')).toBeInTheDocument();
  });
});