import { createContext, useContext, useEffect, useMemo, useState } from "react";

const seedOrders = {
  '1': {
    id: '1',
    status: 'Order Received',
    events: [
      { icon: "https://api.iconify.design/ic/outline-restaurant.svg?color=%23000000", title: "Order Received", time: "Aug 31, 2025 19:00", status: 'inprogress'},
      { icon: "https://api.iconify.design/ic/outline-ramen-dining.svg?color=%23888888", title: "Cooking Order", time: "", status: 'pending'},
      { icon: "https://api.iconify.design/ic/outline-check-circle.svg?color=%23888888", title: "Order Finished", time: "", status: 'pending'},
    ],
    items: [
      { menuId: 'm1', name: "ก๋วยเตี๋ยวเรือ", price: 60, qty: 1, img: "https://img.wongnai.com/p/1920x0/2021/08/17/e18531c456a344369480a1d3c1b471da.jpg" },
    ],
    deliveryFee: 20,
    currency: "THB",
  },
  '2': {
    id: '2',
    status: 'Cooking',
    events: [
      { icon: "https://api.iconify.design/ic/outline-restaurant.svg?color=%23000000", title: "Order Received", time: "Aug 31, 2025 19:28", status: 'done'},
      { icon: "https://api.iconify.design/ic/outline-ramen-dining.svg?color=%23000000", title: "Cooking Order", time: "Aug 31, 2025 19:40", status: 'inprogress'},
      { icon: "https://api.iconify.design/ic/outline-check-circle.svg?color=%23888888", title: "Order Finished", time: "", status: 'pending'},
    ],
    items: [
      { menuId: 'm2', name: "ข้าวมันไก่โกเอต", price: 50, qty: 1, img: "https://img.wongnai.com/p/1920x0/2019/07/20/028c88396694499b9019b375b3a8836f.jpg" },
      { menuId: 'm3', name: "เป็ดพะโล้โกก้อง", price: 120, qty: 1, img: "https://cdn.centerpoint.market/wp-content/uploads/2022/04/25182918/11-2-768x512.jpg" },
    ],
    deliveryFee: 40,
    currency: "THB",
  },
  '3': {
    id: '3',
    status: 'Finished',
    events: [
      { icon: "https://api.iconify.design/ic/outline-restaurant.svg?color=%23000000", title: 'Order Received', time: 'Aug 31, 2025 10:00', status: 'done' },
      { icon: "https://api.iconify.design/ic/outline-ramen-dining.svg?color=%23000000", title: 'Cooking Order', time: 'Aug 31, 2025 10:15', status: 'done' },
      { icon: "https://api.iconify.design/ic/outline-check-circle.svg?color=%23000000", title: 'Order Finished', time: 'Aug 31, 2025 10:30', status: 'done' },
    ],
    items: [
      { menuId: 'm4', name: 'พิซซ่าฮาวายเอี้ยน', price: 250, qty: 1, img: 'https://www.gornogor.com/wp-content/uploads/2022/02/Hawaiian-Pizza-The-Best-Recipe-e1645391431385.jpg' },
      { menuId: 'm5', name: 'โค้ก', price: 20, qty: 1, img: 'https://backend.tops.co.th/media/catalog/product/8/8/8851959132019_1.jpg' },
    ],
    deliveryFee: 30,
    currency: 'THB',
  },
  '4': {
    id: '4',
    status: 'Cancelled',
    events: [
      { icon: "https://api.iconify.design/ic/outline-restaurant.svg?color=%23000000", title: 'Order Received', time: 'Aug 31, 2025 11:00', status: 'done' },
      { icon: "https://api.iconify.design/ic/outline-cancel.svg?color=%23d9534f", title: 'Order Cancelled', time: 'Aug 31, 2025 11:01', status: 'inprogress' },
    ],
    items: [
      { menuId: 'm6', name: 'ส้มตำปูปลาร้า', price: 80, qty: 1, img: 'https://i.ytimg.com/vi/Hq_S-a1a_wA/maxresdefault.jpg' },
    ],
    deliveryFee: 25,
    currency: 'THB',
  }
};

// ====== เมนู mock สำหรับหน้า Home (มี id + currency ให้ครบ) ======
export const MENUS = [
  { id: 'm1', name: 'Life Kitchen 金沙海鮮咖哩', price: 18, currency: 'THB', img: '' },
  { id: 'm2', name: 'Life Kitchen 金沙海鮮咖哩', price: 18, currency: 'THB', img: '' },
  { id: 'm3', name: '米其林二星四人餐', price: 12, currency: 'THB', img: '' },
  { id: 'm4', name: 'Life Kitchen 金沙海鮮咖哩', price: 9,  currency: 'THB', img: '' },
  { id: 'm5', name: '霜降牛肉壽喜燒', price: 7,  currency: 'THB', img: '' },
  // ... จะใช้รูปจาก assets ของคุณใน Home เอง
];

const STORAGE_KEY = "foodstore_orders_v1";
const COUNTER_KEY = STORAGE_KEY + "_counter";

// template event สำหรับออเดอร์ใหม่
const eventTemplate = () => ([
  { icon: "https://api.iconify.design/ic/outline-restaurant.svg?color=%23000000", title: "Order Received", time: new Date().toLocaleString(), status: 'done'},
  { icon: "https://api.iconify.design/ic/outline-ramen-dining.svg?color=%23000000",  title: "Cooking Order",  time: "", status: 'pending'},
  { icon: "https://api.iconify.design/ic/outline-check-circle.svg?color=%23888888", title: "Order Finished", time: "", status: 'pending'},
]);

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const loaded = raw ? JSON.parse(raw) : {};
    // รวม seed ถ้ายังไม่มีอะไรเลย
    return Object.keys(loaded).length ? loaded : { ...seedOrders };
  } catch { return { ...seedOrders }; }
}
function saveOrders(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

function initCounter(ordersObj) {
  const existed = localStorage.getItem(COUNTER_KEY);
  if (existed) return Number(existed);
  const maxId = Object.keys(ordersObj).map(k => Number(k)).filter(n => !isNaN(n)).reduce((a,b)=>Math.max(a,b), 0);
  localStorage.setItem(COUNTER_KEY, String(maxId));
  return maxId;
}
function nextId() {
  const n = Number(localStorage.getItem(COUNTER_KEY) || "0") + 1;
  localStorage.setItem(COUNTER_KEY, String(n));
  return String(n);
}

const OrderContext = createContext(null);
export const useOrder = () => useContext(OrderContext);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => loadOrders());
  const [counterReady, setCounterReady] = useState(false);

  useEffect(() => { initCounter(orders); setCounterReady(true); }, []);
  useEffect(() => { saveOrders(orders); }, [orders]);

  // จาก cartItems → สร้างออเดอร์และบันทึก
  const checkoutFromCart = (cartItems, { deliveryFee = 40, currency = 'THB' } = {}) => {
    if (!counterReady || !Array.isArray(cartItems) || cartItems.length === 0) return null;

    const id = nextId();
    const items = cartItems.map(it => ({
      menuId: it.id || it.menuId || it.name, // กันพลาด
      name: it.name,
      price: Number(it.price),
      qty: Number(it.quantity ?? it.qty ?? 1),
      img: it.img || it.image || '',
    }));

    const order = {
      id,
      status: 'Order Received',
      events: eventTemplate(),
      items,
      deliveryFee: Number(deliveryFee),
      currency,
    };

    setOrders(prev => ({ ...prev, [id]: order }));
    return id;
  };

  const getOrderById = (id) => orders[id] || null;

  const value = useMemo(() => ({
    orders,
    checkoutFromCart,
    getOrderById,
  }), [orders]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
