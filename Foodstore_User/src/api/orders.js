
const ORDERS_URL = `/api/orders`;

export async function createOrderFromCart(cartItems, orderDetails, finalPrice) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const orderItemsPayload = cartItems.map(item => ({
    quantity: item.quantity,
    product: {
      id: item.id, // ส่ง ID ของสินค้าไปในอ็อบเจกต์ product โดยตรง
    }
  }));

  const payload = {
    ...orderDetails,
    orderItems: orderItemsPayload,
    finalAmount: finalPrice,
  };

  return await api_order("POST", null, payload);
}

async function api_order(method, id = null, body = null) {
  const url = id ? `${ORDERS_URL}/${id}` : ORDERS_URL;

  const options = {
    method,
    credentials: 'include',
    headers: {},
  };

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} ${JSON.stringify(data)}`);
  return data?.id ?? data;
}