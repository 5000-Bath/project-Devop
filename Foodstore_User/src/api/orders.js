// ✅ ไม่ใช้ env — ใช้ /api เป็น base path ตรง
const API_BASE = '/api';

/**
 * ส่งคำสั่งซื้อจากตะกร้า
 */
export async function createOrderFromCart(cartItems, { userId = 1 } = {}) {
  const orderItems = cartItems.map((it) => ({
    product: { id: it.id || it.productId || it.menuId },
    quantity: Number(it.quantity ?? it.qty ?? 1),
  }));

  const res = await api_order('/orders', {
    method: 'POST',
    body: JSON.stringify({
      userId: userId,
      status: 'PENDING',
      orderItems,
    }),
  });

  return res?.id;
}

/**
 * ฟังก์ชันช่วยสำหรับเรียก API order
 */
async function api_order(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText} ${text}`);
  }

  return res.status === 204 ? null : res.json();
}

/**
 * ดึงข้อมูลคำสั่งซื้อจาก ID
 */
export async function getOrderById(id) {
  if (id == null || String(id).trim() === '') {
    throw new Error('order id is required');
  }

  const res = await fetch(`${API_BASE}/orders/${id}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}