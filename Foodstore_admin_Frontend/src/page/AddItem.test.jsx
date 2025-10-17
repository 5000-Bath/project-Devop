import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Swal from 'sweetalert2';
import { MemoryRouter } from 'react-router-dom';
import Additem from './AddItem';

// Mock dependencies
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-route' +
    'r-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

window.URL.createObjectURL = vi.fn(() => 'mock-preview-url');

describe('Add Item Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form for adding a new menu item', () => {
    render(<MemoryRouter><Additem /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /add new menu/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter menu name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument();
  });

  it('should show a validation error if required fields are empty on submit', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    render(<MemoryRouter><Additem /></MemoryRouter>);

    const submitButton = screen.getByRole('button', { name: /apply/i });
    await userEvent.click(submitButton);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: 'warning',
      title: 'กรุณากรอกข้อมูลให้ครบ',
      text: 'กรุณากรอกชื่อเมนูและราคา',
      confirmButtonText: 'ตกลง'
    });
  });

  it('should allow a user to fill the form and submit successfully', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1, name: 'New Mock Item' }),
    });

    render(<MemoryRouter><Additem /></MemoryRouter>);

    await userEvent.type(screen.getByPlaceholderText(/enter menu name/i), 'Spicy Noodle');
    await userEvent.type(screen.getByPlaceholderText(/enter price/i), '80');

    await userEvent.click(screen.getByRole('button', { name: /apply/i }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      // Check the new endpoint
      expect(fetchSpy).toHaveBeenCalledWith('/api/products', expect.any(Object));
      
      expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'success' }));
      expect(mockNavigate).toHaveBeenCalledWith('/admin/menu');
    });
  });
});