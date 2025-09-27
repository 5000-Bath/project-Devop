
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Setting from './setting';

describe('Setting Page', () => {
  it('should render user profile information in display mode', () => {
    render(<Setting />);

    // Check for the welcome heading with the user's name
    expect(screen.getByRole('heading', { name: /welcome, my bro ake/i })).toBeInTheDocument();

    // Check that the user's name and email are displayed in the profile section
    expect(screen.getByRole('heading', { name: 'my bro Ake' })).toBeInTheDocument();
    expect(screen.getAllByText('ake@gmail.com')[0]).toBeInTheDocument();

    // Check that the "Full Name" input is disabled and has the correct value
    const fullNameInput = screen.getByDisplayValue('my bro Ake');
    expect(fullNameInput).toBeInTheDocument();
    expect(fullNameInput).toBeDisabled();

    // Check that the Edit button is present
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });
});
