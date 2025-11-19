const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export async function loginApi(username, password) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error(await res.text() || "Login failed");
  return res.json(); 
}

export async function meApi(token) {
  const res = await fetch(`${API_BASE}/api/me`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("unauthorized");
  return res.json();
}
