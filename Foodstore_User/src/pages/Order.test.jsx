
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Order from './Order';
import { CartContext } from '../context/CartContext';
import * as mockDb from '../mockdb';

// Mock the db module
vi.mock('../mockdb');

const mockNavigate = vi.fn();
// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});


const mockCartContextValue = {
  cartItems: [],
  addToCart: vi.fn(),
  decreaseQuantity: vi.fn(),
  removeFromCart: vi.fn(),
};

const renderWithContext = (cartValue) => {
  return render(
    <MemoryRouter>
      <CartContext.Provider value={cartValue}>
        <Order />
      </CartContext.Provider>
    </MemoryRouter>
  );
};

describe('Order Page', () => {
  it('should display "Your cart is empty" when there are no items', () => {
    renderWithContext(mockCartContextValue);
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /checkout/i })).toBeDisabled();
  });

  it('should display items and correct total when cart is not empty', () => {
    const items = [
      { name: 'Khao Man Kai', price: 50, quantity: 2, img: 'test.jpg' },
      { name: 'Ped Pa Lo', price: 60, quantity: 1, img: 'test2.jpg' },
    ];
    const subtotal = (50 * 2) + (60 * 1);
    const totalPrice = subtotal;

    renderWithContext({ ...mockCartContextValue, cartItems: items });

    // Check for items
    expect(screen.getByText('Khao Man Kai')).toBeInTheDocument();
    expect(screen.getByText('Ped Pa Lo')).toBeInTheDocument();
    
    // Check for quantity
    const quantitySpans = screen.getAllByText((content, element) => {
        return element.tagName.toLowerCase() === 'span' && /^\d+$/.test(content);
    });
    expect(quantitySpans.find(span => span.textContent === '2')).toBeInTheDocument();
    expect(quantitySpans.find(span => span.textContent === '1')).toBeInTheDocument();


    // Check for total price
    const totalElement = screen.getByText('Total Price').parentElement;
    const priceSpan = totalElement.querySelector('span:last-child');
    expect(priceSpan).toHaveTextContent(`${totalPrice} THB`);

    // Check if checkout button is enabled
    expect(screen.getByRole('button', { name: /checkout/i })).toBeEnabled();
  });
});
