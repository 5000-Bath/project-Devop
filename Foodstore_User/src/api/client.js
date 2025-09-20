// src/api/client.js
export async function api(path, options = {}) {
    const url = `/api${path}`;            // ← สำคัญ: ให้ผ่าน proxy ของ Vite
    console.log('fetch =>', url);         // debug ดูใน Console ได้
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`${res.status} ${res.statusText} ${text}`);
    }
    return res.status === 204 ? null : res.json();
}
