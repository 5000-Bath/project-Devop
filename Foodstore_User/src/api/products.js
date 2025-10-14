// src/api/products.js

// ✅ base URL: ให้เป็น root (ใช้ /api โดยตรง ไม่ต้องมี env)
const API_BASE = '/api';

// ✅ ดึงรายการสินค้า
export async function listProducts() {
  const res = await fetch(`${API_BASE}/products`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const data = await res.json();

  // ✅ ถ้า backend ส่ง path แบบ /uploads/... เติมโดเมนให้ครบ (ผ่าน window.location.origin)
  return (Array.isArray(data) ? data : []).map((p) => ({
    ...p,
    imageUrl:
      typeof p.imageUrl === 'string' && p.imageUrl.startsWith('/')
        ? `${window.location.origin}${p.imageUrl}`
        : p.imageUrl,
  }));
}

// ✅ ตัด stock หลัง checkout
export async function cutStock(cartItems) {
  for (const it of cartItems) {
    const id = it.id || it.productId || it.menuId;
    const quantity = Number(it.quantity ?? it.qty ?? 1);

    const res = await fetch(`${API_BASE}/products/${id}/quantity/cut`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty: quantity }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`cutStock failed for id=${id}: ${res.status} ${text}`);
    }
  }
}
