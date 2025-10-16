
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Setting from './setting';

// Mock the global fetch function before each test
beforeEach(() => {
  const mockAdmin = {
    id: 1,
    username: 'my bro Ake',
    email: 'ake@gmail.com',
  };

  vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockAdmin),
  });
});

describe('Setting Page', () => {
  it('should render user profile information after fetching data', async () => {
    render(<Setting />);

    // Wait for the component to finish fetching and rendering the data
    await waitFor(() => {
      // Use a more flexible query to find the text, which might be split by a newline
      expect(screen.getByText(/ยินดีต้อนรับ my bro Ake/i)).toBeInTheDocument();
    });

    // Check that the user's name and email are displayed in the profile section
    expect(screen.getByRole('heading', { name: 'my bro Ake' })).toBeInTheDocument();
    expect(screen.getAllByText('ake@gmail.com')[0]).toBeInTheDocument();

    // Check that the "Full Name" input is disabled and has the correct value
    const fullNameInput = screen.getByDisplayValue('my bro Ake');
    expect(fullNameInput).toBeInTheDocument();
    expect(fullNameInput).toBeDisabled();

    // Check that the Edit button is present
    expect(screen.getByRole('button', { name: /แก้ไข/i })).toBeInTheDocument();
  });
});


