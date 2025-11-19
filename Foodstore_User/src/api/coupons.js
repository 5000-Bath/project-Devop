// c:/Users/minec/Desktop/kk/new-19-11-2025/project-Devop/Foodstore_User/src/api/coupons.js
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/+$/, "");

/**
 * Applies a coupon to a given amount.
 * @param {string} code The coupon code.
 * @param {number} originalAmount The original total amount of the cart.
 * @returns {Promise<{newAmount: number, discountAmount: number}>}
 */
export async function applyCoupon(code, originalAmount) {
  if (!code) throw new Error('Coupon code is required');
  if (typeof originalAmount !== 'number' || originalAmount < 0) {
    throw new Error('Original amount must be a valid number');
  }

  const res = await fetch(`${API_BASE}/api/coupons/use`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ code, originalAmount }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(errorBody || `Error ${res.status}: Could not apply coupon`);
  }

  return res.json();
}
