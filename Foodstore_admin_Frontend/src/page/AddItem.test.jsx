
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Additem from './AddItem';

// Mock dependencies
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock URL.createObjectURL for image preview
window.URL.createObjectURL = vi.fn(() => 'mock-preview-url');


describe('Add Item Page', () => {
  it('should render the form for adding a new menu item', () => {
    render(
      <MemoryRouter>
        <Additem />
      </MemoryRouter>
    );

    // Check for heading
    expect(screen.getByRole('heading', { name: /add new menu/i })).toBeInTheDocument();

    // Check for input fields by their placeholders
    expect(screen.getByPlaceholderText(/enter menu name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter menu description/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter stock quantity/i)).toBeInTheDocument();

    // Check for upload button (which is a label for a hidden input)
    expect(screen.getByText(/upload image/i)).toBeInTheDocument();

    // Check for submit button
    expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument();
  });
});
