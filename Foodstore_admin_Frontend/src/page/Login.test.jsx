
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './Login';

// Mock the custom hook
vi.mock('./useIsMobile', () => ({
  useIsMobile: vi.fn(() => false), // Default to not mobile
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Login Page', () => {
  it('should render the login form elements', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Check for heading
    expect(screen.getByRole('heading', { name: /login as a admin/i })).toBeInTheDocument();

    // Check for input fields by their placeholders
    expect(screen.getByPlaceholderText(/โปรดใส่ชื่อผู้ใช้ของท่าน/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/โปรดใส่รหัสผ่านของท่าน/i)).toBeInTheDocument();

    // Check for the submit button
    expect(screen.getByRole('button', { name: /เข้าสู่ระบบ/i })).toBeInTheDocument();
    
    // Check for forgot password link
    expect(screen.getByText(/ลืมรหัสผ่าน?/i)).toBeInTheDocument();
  });
});
