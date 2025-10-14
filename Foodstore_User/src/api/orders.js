// src/api/order.js

// ✅ base URL: ใช้ root path /api
const API_BASE = '/api';

// สร้าง order จาก cart
export async function createOrderFromCart(cartItems, { userId = 1 } = {}) {
  const orderItems = cartItems.map(it => ({
    product: { id: it.id || it.productId || it.menuId },
    quantity: Number(it.quantity ?? it.qty ?? 1)
  }));

  const res = await api_order('/orders', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      status: 'PENDING',
      orderItems,
    }),
  });

  return res?.id;
}

// wrapper fetch สำหรับ order
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

// ดึง order ตาม id
export async function getOrderById(id) {
  if (id == null || String(id).trim() === '') {
    throw new Error('order id is required');
  }

  const res = await fetch(`${API_BASE}/orders/${id}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.json();
}

// ดึงรายการ order ทั้งหมด
export const listOrders = () => api_order('/orders');
