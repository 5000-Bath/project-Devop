import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from './Home';
import { CartContext } from '../context/CartContext';
import * as productApi from '../api/products'; // Import to mock

// Mock the API module
vi.mock('../api/products');

const mockAddToCart = vi.fn();

const renderWithContext = (component) => {
  return render(
    <CartContext.Provider value={{ addToCart: mockAddToCart, cart: [] }}>
      {component}
    </CartContext.Provider>
  );
};

describe('Home Component', () => {
  it('should render the heading and loading state initially', () => {
    productApi.listProducts.mockResolvedValue([]); // Mock for initial load
    renderWithContext(<Home />);
    expect(screen.getByRole('heading', { name: /all menus/i })).toBeInTheDocument();
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('should render products after a successful API call', async () => {
    const mockProducts = [
      { id: 1, name: 'Khao Man Kai', price: 50, imageUrl: 'test1.jpg' },
      { id: 2, name: 'Ped Pa Lo', price: 60, imageUrl: 'test2.jpg' },
    ];
    productApi.listProducts.mockResolvedValue(mockProducts);

    renderWithContext(<Home />);

    // Wait for the loading to disappear and products to appear
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
    });

    // Check if product names are rendered
    expect(screen.getByText('Khao Man Kai')).toBeInTheDocument();
    expect(screen.getByText('Ped Pa Lo')).toBeInTheDocument();

    // Check if prices are rendered
    expect(screen.getByText('50 THB')).toBeInTheDocument();
    expect(screen.getByText('60 THB')).toBeInTheDocument();
  });

  it('should display an error message if the API call fails', async () => {
    productApi.listProducts.mockRejectedValue(new Error('Failed to fetch'));
    renderWithContext(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/error: failed to fetch/i)).toBeInTheDocument();
    });
  });
});
