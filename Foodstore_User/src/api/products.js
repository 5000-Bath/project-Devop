const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export async function listProducts() {
    const res = await fetch(`${API_BASE}/api/products`, {
        headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();

    // ถ้า backend ส่ง path แบบ /uploads/... ให้เติมโดเมนให้ครบ
    return (Array.isArray(data) ? data : []).map((p) => ({
        ...p,
        imageUrl:
            typeof p.imageUrl === 'string' && p.imageUrl.startsWith('/')
                ? `${API_BASE}${p.imageUrl}`
                : p.imageUrl,
    }));
}

export async function cutStock(cartItems) {
  for (const it of cartItems) {
    const id = it.id || it.productId || it.menuId;          
    const quantity = Number(it.quantity ?? it.qty ?? 1);    

    const res = await fetch(`${API_BASE}/api/products/${id}/quantity/cut`, {
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
