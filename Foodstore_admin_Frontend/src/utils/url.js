const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function apiBase() {
    return API_BASE;
}

// ทำให้รูปที่เป็น /uploads/... กลายเป็น URL เต็ม
export function resolveImageUrl(path) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path; // เป็น URL เต็มอยู่แล้ว
    if (path.startsWith('/')) return `${API_BASE}${path}`;
    return `${API_BASE}/${path}`;
}
