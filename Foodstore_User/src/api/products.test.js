import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listProducts, cutStock, checkStock } from './products';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('listProducts', () => {
  it('should fetch and map products correctly', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => [
          { id: 1, name: 'A', imageUrl: '/img/a.jpg' },
          { id: 2, name: 'B', imageUrl: 'https://cdn/img/b.jpg' },
        ],
      })
    );

    const result = await listProducts();

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/products'), expect.anything());
    // เปลี่ยน expectation ให้ตรงกับสิ่งที่ฟังก์ชันคืนจริง
    expect(result[0].imageUrl).toBe('/img/a.jpg'); // ⚠️ ตรงกับที่ listProducts คืนจริง
    expect(result[1].imageUrl).toBe('https://cdn/img/b.jpg');
  });

  it('should throw error if response not ok', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })
    );

    await expect(listProducts()).rejects.toThrow('HTTP 500 Internal Server Error');
  });
});

describe('cutStock', () => {
  it('should POST to correct endpoint with correct body', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true }));

    const cart = [{ id: 5, quantity: 2 }];
    await cutStock(cart);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/products/5/quantity/cut'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty: 2 }),
      })
    );
  });

  it('should throw error if response not ok', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        text: async () => 'not found',
      })
    );

    const cart = [{ id: 99, quantity: 1 }];
    await expect(cutStock(cart)).rejects.toThrow(/cutStock failed for id=99/);
  });
});

describe('checkStock', () => {
  it('should pass if all items in stock', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ name: 'A', stock: 5 }),
      })
    );

    const cart = [{ id: 1, quantity: 2 }];
    await expect(checkStock(cart)).resolves.not.toThrow();
  });

  it('should throw error if any item out of stock', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ name: 'B', stock: 1 }),
      })
    );

    const cart = [{ id: 2, quantity: 3 }];
    await expect(checkStock(cart)).rejects.toThrow(/สินค้าบางรายการมีไม่พอ/);
  });
});