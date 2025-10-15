const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export async function listProducts() {
    const res = await fetch(`${API_BASE}/api/products`, {
        headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();

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


export async function checkStock(cartItems) {
      const orderItems = cartItems.map(it => ({
        product: { id: it.id || it.productId || it.menuId },
        quantity: Number(it.quantity ?? it.qty ?? 1)
    }));

     const results = await Promise.all(
    orderItems.map(async item => {
      const res = await fetch(`${API_BASE}/api/products/${item.product.id}`, {
        headers: { Accept: "application/json" }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const data = await res.json();

      if (data.stock < item.quantity) {
        return { ok: false, name: data.name, available: data.stock };
      }
      return { ok: true };
    })
  );

  const failed = results.filter(r => !r.ok);
  if (failed.length > 0) {
    const msg = failed
      .map(f => `${f.name} เหลือ ${f.available} ชิ้น`)
      .join("\n");
    throw new Error(`สินค้าบางรายการมีไม่พอ:\n${msg}`);
  }
}
