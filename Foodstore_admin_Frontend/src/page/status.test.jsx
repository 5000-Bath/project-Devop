
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Contact from './status'; // The component is named Contact in the file

describe('Status Page', () => {
  it('should render the status page heading', () => {
    render(<Contact />);

    // Check for heading
    expect(screen.getByRole('heading', { name: /status page/i })).toBeInTheDocument();
  });
});
