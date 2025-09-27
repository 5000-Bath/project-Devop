
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Landing from './Landing';

describe('Landing Page', () => {
  it('should render hero text and navigation links', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );

    // Check for the main heading
    expect(screen.getByRole('heading', { name: /welcome to\s+crayon\s+shinchan\s+foodstore/i })).toBeInTheDocument();

    // Check for the primary link to the menu
    const menuLink = screen.getByRole('link', { name: /browse menu/i });
    expect(menuLink).toBeInTheDocument();
    expect(menuLink).toHaveAttribute('href', '/Home');

    // Check for the secondary link to orders
    const orderLink = screen.getByRole('link', { name: /go to orders/i });
    expect(orderLink).toBeInTheDocument();
    expect(orderLink).toHaveAttribute('href', '/Order');
  });
});
