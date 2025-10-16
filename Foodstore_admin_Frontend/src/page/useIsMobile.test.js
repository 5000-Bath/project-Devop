import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useIsMobile } from './useIsMobile';

// To be able to set window.innerWidth in JSDOM, we need to make it writable.
const originalInnerWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth');

beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', { writable: true });
});

afterEach(() => {
  if (originalInnerWidth) {
    Object.defineProperty(window, 'innerWidth', originalInnerWidth);
  }
});

describe('useIsMobile hook', () => {
  it('should return true when window width is less than the breakpoint', () => {
    // Set initial window size
    act(() => {
      window.innerWidth = 500;
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('should return false when window width is greater than the breakpoint', () => {
    // Set initial window size
    act(() => {
      window.innerWidth = 1024;
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('should update from false to true when window is resized to be smaller', () => {
    // Initial large size
    act(() => {
      window.innerWidth = 1024;
    });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate resize to a smaller screen
    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(true);
  });

  it('should update from true to false when window is resized to be larger', () => {
    // Initial small size
    act(() => {
      window.innerWidth = 500;
    });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    // Simulate resize to a larger screen
    act(() => {
      window.innerWidth = 1024;
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(false);
  });

  it('should respect a custom breakpoint', () => {
    // Set a custom breakpoint
    const customBreakpoint = 1200;

    act(() => {
      window.innerWidth = 1100;
    });

    const { result } = renderHook(() => useIsMobile(customBreakpoint));

    expect(result.current).toBe(true);
  });
});
