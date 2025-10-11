import { api } from './client';
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export async function createOrderFromCart(cartItems, { userId = 1 } = {}) {
    const orderItems = cartItems.map(it => ({
        product: { id: it.id || it.productId || it.menuId },
        quantity: Number(it.quantity ?? it.qty ?? 1)
    }));
    const res = await api_order('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
            userId: userId,
            status: 'PENDING',
            orderItems,
        }),
    });
    return res?.id
}

export async function api_order(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`${res.status} ${res.statusText} ${text}`);
    }
    return res.status === 204 ? null : res.json();
}

export async function getOrderById(id) {
    if (id == null || String(id).trim() === '') {
        throw new Error('order id is required');
    }
    const res = await fetch(`${API_BASE}/api/orders/${id}`, {
        headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data;
}

export const listOrders = () => api('/orders');
