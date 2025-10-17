import { describe, it, expect } from 'vitest';
import { money, isPending, isDone, isCancel, fmtTH } from './formatters';

describe('money formatter', () => {
  it('should format a whole number correctly', () => {
    expect(money(1234)).toBe('฿1,234.00');
  });

  it('should format a number with decimals', () => {
    expect(money(99.99)).toBe('฿99.99');
  });

  it('should handle zero', () => {
    expect(money(0)).toBe('฿0.00');
  });

  it('should handle null or undefined by returning ฿0.00', () => {
    expect(money(null)).toBe('฿0.00');
    expect(money(undefined)).toBe('฿0.00');
  });
});

describe('Status checkers', () => {
  describe('isPending', () => {
    it('should return true for pending statuses', () => {
      expect(isPending('PENDING')).toBe(true);
      expect(isPending('processing')).toBe(true); // Check case-insensitivity
    });
    it('should return false for non-pending statuses', () => {
      expect(isPending('SUCCESS')).toBe(false);
      expect(isPending('CANCELLED')).toBe(false);
    });
  });

  describe('isDone', () => {
    it('should return true for done statuses', () => {
      expect(isDone('SUCCESS')).toBe(true);
      expect(isDone('delivered')).toBe(true);
    });
    it('should return false for non-done statuses', () => {
      expect(isDone('PENDING')).toBe(false);
    });
  });

  describe('isCancel', () => {
    it('should return true for cancelled statuses', () => {
      expect(isCancel('CANCELLED')).toBe(true);
      expect(isCancel('void')).toBe(true);
    });
    it('should return false for non-cancelled statuses', () => {
      expect(isCancel('SUCCESS')).toBe(false);
    });
  });
});

describe('fmtTH date formatter', () => {
  it('should format a date string into a non-empty string', () => {
    const date = new Date();
    const formattedDate = fmtTH(date);
    expect(typeof formattedDate).toBe('string');
    expect(formattedDate.length).toBeGreaterThan(0);
  });
});
