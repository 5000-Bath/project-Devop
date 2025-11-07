import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  it('should render brand name and all navigation links', () => {
    // Arrange: Render the component
    // We wrap Navbar with MemoryRouter because it contains NavLink components
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Act & Assert: Check if elements are on the screen

    // Check for the brand heading
    // This is more robust as it checks the accessible name of the heading,
    // ignoring the internal span structure.
    expect(screen.getByRole('heading', { name: /Welcome to, Crayon Shinchan/i })).toBeInTheDocument();

    // Check for navigation links
    expect(screen.getByRole('link', { name: /Menu/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Orders/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Status/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contact/i })).toBeInTheDocument();
  });
});
