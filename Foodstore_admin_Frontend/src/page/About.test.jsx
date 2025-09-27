
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import About from './About';

// Mock dependencies
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

vi.mock('./useIsMobile', () => ({
  useIsMobile: vi.fn(() => false), // Test desktop view
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock fetch
global.fetch = vi.fn();

describe('About (Menu) Page', () => {
  it('should render the menu items after a successful fetch', async () => {
    const mockProducts = [
      { id: 1, name: 'Test Product', description: 'A test item', price: 100, stockQty: 10, imageUrl: null },
    ];
    // Mock a successful response
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    });

    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    // Check for loading state first
    expect(screen.getByText(/กำลังโหลด.../i)).toBeInTheDocument();

    // Wait for the product to appear
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /menu/i })).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('A test item')).toBeInTheDocument();
    expect(screen.getByText('100 บาท')).toBeInTheDocument();
  });
});
