
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home, { Card } from './Home';
import axios from 'axios';

// Mock libraries
vi.mock('axios');
vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-chart"></div>,
}));

beforeEach(() => {
  // Reset mocks before each test
  vi.clearAllMocks();
});

describe('Admin Home Page (Dashboard)', () => {
  it('should render the main dashboard after fetching data', async () => {
    // Mock API responses
    axios.get.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Wait for the component to render after fetching
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    });

    // Check for sections
    expect(screen.getByRole('heading', { name: /recent orders/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /top products/i })).toBeInTheDocument();

    // Check that the mocked chart is rendered
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
  });
});

describe('Card Component', () => {
  it('should render the title and a formatted value', () => {
    render(<Card title="Test Title" value={12345} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('12,345')).toBeInTheDocument();
  });

  it('should render "0" when the value is null', () => {
    render(<Card title="Null Value" value={null} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render "0" when the value is undefined', () => {
    render(<Card title="Undefined Value" value={undefined} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});

