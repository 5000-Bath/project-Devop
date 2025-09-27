
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Ordersdetail from './Ordersdetail';

describe('Orders Detail Page', () => {
  it('should render the order items table with headers', () => {
    render(<Ordersdetail />);

    // Check for heading
    expect(screen.getByRole('heading', { name: /orders/i })).toBeInTheDocument();

    // Check for table headers
    expect(screen.getByRole('columnheader', { name: /menu/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /due date/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /price/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();

    // Check for at least one order row (by its menu name)
    expect(screen.getByText(/ไข่ไก่ทะเลเฟยเหอ/i)).toBeInTheDocument();
  });
});
