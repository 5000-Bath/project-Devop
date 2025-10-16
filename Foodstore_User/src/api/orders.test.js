import { describe, it, expect, vi } from 'vitest';
import { api_order, getOrderById, createOrderFromCart } from './orders';

describe('api_order', () => {
  it('should return JSON if response ok', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ message: 'ok' }),
      })
    );

    const res = await api_order('/api/test');
    expect(res).toEqual({ message: 'ok' });
  });

  it('should throw error if response not ok', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: () => Promise.resolve('missing'),
      })
    );

    await expect(api_order('/wrong')).rejects.toThrow('404 Not Found missing');
  });
});

describe('getOrderById', () => {
  it('should fetch correct URL and return JSON', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, status: 'PENDING' }),
      })
    );

    const data = await getOrderById(1);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/orders/1'), expect.anything());
    expect(data).toEqual({ id: 1, status: 'PENDING' });
  });
});

describe('createOrderFromCart', () => {
  it('should POST order with correct payload', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 99 }),
      })
    );

    const cartItems = [{ id: 1, quantity: 2 }];
    const id = await createOrderFromCart(cartItems);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/orders'),
      expect.objectContaining({
        method: 'POST',
      })
    );
    expect(id).toBe(99);
  });
});