import { api } from './client';

// สร้างออเดอร์จาก cartItems
export function createOrderFromCart(cartItems, { userId = 1 } = {}) {
    const orderItems = cartItems.map(it => ({
        product: { id: it.id || it.productId || it.menuId },  // map ให้ตรงของเดิม
        price: Number(it.price),
        quantity: Number(it.quantity ?? it.qty ?? 1),
    }));
    return api('/orders', {
        method: 'POST',
        body: JSON.stringify({
            user: { id: userId },
            status: 'PENDING',
            orderItems,
        }),
    });
}

export const listOrders   = () => api('/orders');
export const getOrderById = (id) => api(`/orders/${id}`);
