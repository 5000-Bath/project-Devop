// import { api } from './client';
// export const listProducts = () => api('/products');
// export const getProduct = (id) => api(`/products/${id}`);
// src/api/products.js
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export async function listProducts() {
    const res = await fetch(`${API_BASE}/products`, {
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
