import { api } from './client';
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

// สร้างออเดอร์จาก cartItems
export async function createOrderFromCart(cartItems, { userId = 1 } = {}) {
    const orderItems = cartItems.map(it => ({
        productId: it.id || it.productId || it.menuId ,  // map ให้ตรงของเดิม
        // price: Number(it.price),
        quantity: Number(it.quantity ?? it.qty ?? 1),
        productName: it.name ?? it.title ?? it.productName ?? undefined
    }));
    return api_order('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
            userId: userId,
            status: 'PENDING',
            orderItems,
        }),
    });
}

export async function api_order(path, options = {}) {
    console.log('fetch =>', options);     
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
    console.log('fetch =>', id); 
  if (id == null || String(id).trim() === '') {
    throw new Error('order id is required');
  }
  const res = await fetch(`${API_BASE}/api/orders/${id}`, {
        headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    console.log('data return', data); 

    return data;
}


export const listOrders   = () => api('/orders');
// export const getOrderById = (id) => api(`/orders/${id}`);
