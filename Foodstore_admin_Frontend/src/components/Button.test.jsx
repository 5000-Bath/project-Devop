import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button Component', () => {
  it('should render children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should apply primary styles by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background: linear-gradient(135deg, #22c55e 0%, #059669 100%)');
    expect(button).toHaveStyle('color: #fff');
  });

  it('should apply ghost styles when variant is ghost', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background: #f3f4f6');
    expect(button).toHaveStyle('color: #374151');
  });

  it('should apply danger styles when variant is danger', () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background: #ef4444');
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled={true}>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    // Try to click it and ensure the handler is not called
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
