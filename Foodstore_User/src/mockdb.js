// src/mockdb.js
// Mock DB เก็บใน localStorage + seed ออเดอร์ #1..#4 เพื่อให้ลองค้นได้
const STORAGE_KEY = 'foodstore_mockdb_orders_v1';
const COUNTER_KEY = STORAGE_KEY + '_counter';

// ---- seed เริ่มต้น (แก้ได้ตามใจ) ----
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

// ---- utils ----
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function save(ordersObj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ordersObj));
}
function ensureInit() {
  let orders = load();
  if (!orders) {
    orders = { ...seedOrders };
    save(orders);
    const maxId = Object.keys(orders).map(n => Number(n)).reduce((a,b)=>Math.max(a,b), 0);
    localStorage.setItem(COUNTER_KEY, String(maxId));
  }
}
function nextId() {
  const n = Number(localStorage.getItem(COUNTER_KEY) || '0') + 1;
  localStorage.setItem(COUNTER_KEY, String(n));
  return String(n);
}
function createInitialEvents() {
  return [
    { icon: "https://api.iconify.design/ic/outline-restaurant.svg?color=%23000000", title: "Order Received", time: new Date().toLocaleString(), status: 'done'},
    { icon: "https://api.iconify.design/ic/outline-ramen-dining.svg?color=%23000000", title: "Cooking Order", time: "", status: 'pending'},
    { icon: "https://api.iconify.design/ic/outline-check-circle.svg?color=%23888888", title: "Order Finished", time: "", status: 'pending'},
  ];
}

// ---- API ที่หน้าอื่นใช้ ----
export function addOrderFromCart(cartItems, { deliveryFee = 40, currency = 'THB' } = {}) {
  ensureInit();
  if (!Array.isArray(cartItems) || cartItems.length === 0) return null;

  const id = nextId();

  const items = cartItems.map((it, idx) => ({
    menuId: it.id || it.menuId || `m_${idx}_${(it.name || 'item').replace(/\s+/g,'_')}`,
    name: it.name || `Item ${idx+1}`,
    price: Number(it.price || 0),
    qty: Number(it.quantity ?? it.qty ?? 1),
    img: it.img || it.image || '',
  }));

  const order = {
    id,
    status: 'Order Received',
    events: createInitialEvents(),
    items,
    deliveryFee: Number(deliveryFee),
    currency,
  };

  const orders = load() || {};
  orders[id] = order;
  save(orders);

  return id;
}

export function getOrderById(id) {
  ensureInit();
  const orders = load() || {};
  return orders[String(id)] || null;
}

// (debug helper)
// export function getAllOrders() { ensureInit(); return load() || {}; }
// export function resetMock() { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(COUNTER_KEY); }
