import { useState, useEffect } from 'react';
import '../component/Status.css';
import { getOrderById } from '../api/orders'; 
import { useLocation } from 'react-router-dom';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function Status() {
  const q = useQuery();

  const [searchInput, setSearchInput] = useState(q.get('orderId') || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const findOrder = async (id) => {
    const trimmed = String(id || '').trim();
    if (!trimmed) {
      setOrder(null);
      setError('');
      return;
    }
    const found = getOrderById(trimmed).then(order => {
      const updated = {
    ...(order ?? {}),   
    createdAt: new Date(order?.createdAt+"+07:00" ?? "").toLocaleString(),                   
    events: [ ...(order?.events ?? []), ...createInitialEvents ],
  };
  setOrder(updated);  
//       setOrder(order => ({
//   ...order, status: "Complete",
//   events: [...(order.events || []), ...createInitialEvents]
// }));
console.log("CheckStatus", order)
});
    // if (found) {
    //   console.log('test',found.id);
    //   setOrder(found);
    //   setError('');
    // } else {
    //   setOrder(null);
    //   setError(`Order with ID "${trimmed}" not found.`);
    // }
  };

  const createInitialEvents = [
    { icon: "https://api.iconify.design/ic/outline-restaurant.svg?color=%23000000", title: "Cooking Order", time: order?.createdAt ?? "", status: 'Pending'}
  ];
  

  const handleSearch = () => {
    setIsAnimating(false);
    findOrder(searchInput);
    setTimeout(() => setIsAnimating(true), 50);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

  useEffect(() => {
    if (searchInput) handleSearch(); else setIsAnimating(true);
    // eslint-disable-next-line
  }, []);

  const items = Array.isArray(order?.orderItems) ? order.orderItems : [];
  const total =
    items.reduce(
      (s, it) =>
        s + Number(it?.product?.price ?? 0) * Number(it?.qty ?? it?.quantity ?? 1),
      0
    ) + Number(40);

function adaptOrder(api) {
  if (!api || typeof api !== 'object') return null;

  const items = Array.isArray(api.orderItems)
    ? api.orderItems.map(it => ({
        id: it.id ?? null,
        name: it.product?.name ?? '',
        price: Number(it.product?.price ?? 0),
        qty: Number(it.quantity ?? it.qty ?? 1),
        img: api.API_BASE && typeof it.product?.imageUrl === 'string'
          ? it.product.imageUrl
          : null,
      }))
    : [];

  const defaultEvents = [
    { title: 'Order Created',  status: 'done',      time: api.createdAt ?? '', icon: 'https://api.iconify.design/mdi:clipboard-text.svg' },
    { title: 'Payment Pending',status: api.status === 'PAID' ? 'done' : 'pending', time: '', icon: 'https://api.iconify.design/mdi:credit-card-outline.svg' },
    { title: 'Preparing',      status: (api.status === 'PREPARING' || api.status === 'SHIPPED' || api.status === 'DELIVERED') ? 'inprogress' : 'pending', time: '', icon: 'https://api.iconify.design/mdi:chef-hat.svg' },
    { title: 'Shipped',        status: (api.status === 'SHIPPED' || api.status === 'DELIVERED') ? 'done' : 'pending', time: '', icon: 'https://api.iconify.design/mdi:truck-delivery.svg' },
    { title: 'Delivered',      status: api.status === 'DELIVERED' ? 'done' : 'pending', time: '', icon: 'https://api.iconify.design/mdi:home-check.svg' },
  ];

  return {
    id: api.id ?? null,
    userId: api.userId ?? null,
    status: api.status ?? 'PENDING',
    createdAt: api.createdAt ?? null,
    currency: api.currency ?? 'THB',
    deliveryFee: Number(api.deliveryFee ?? 0),

    // สำหรับคำนวณรวม (ใช้โครงสร้างดิบเดิมไว้)
    orderItems: Array.isArray(api.orderItems) ? api.orderItems : [],

    // สำหรับแสดงใน Summary (UI-friendly)
    items,

    // ไทม์ไลน์ (ใช้ของ backend ถ้ามี ไม่งั้น default)
    events: Array.isArray(api.events) ? api.events : defaultEvents,
  };
}

  return (
    <div className="status-page">
      <div className="status-header-bar">ORDER STATUS</div>

      <div className="status-main-container">
        <div className="search-container">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Check your Order with your Order ID here"
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button" title="Search order by ID">
            <img src="https://api.iconify.design/ic/outline-search.svg" alt="Search" className="search-icon" />
          </button>
        </div>

        {error && (
          <div className={`message-container ${isAnimating ? 'animating' : ''}`}>
            <img src="https://api.iconify.design/ic/outline-warning-amber.svg?color=%23fb923c" alt="Error" className="message-icon" />
            <p className="message-text error">{error}</p>
          </div>
        )}

        {!order && !error && (
          <div className={`message-container ${isAnimating ? 'animating' : ''}`}>
            <img src="https://api.iconify.design/ic/outline-receipt-long.svg?color=%239ca3af" alt="Search for order" className="message-icon" />
            <p className="message-text">Please enter your Order ID to see the status.</p>
            <p className="message-sub-text">(Try: 1, 2, 3, or 4 — หรือใช้ Order ID ล่าสุดที่เพิ่ง Checkout)</p>
          </div>
        )}

        {order && (
          <div className={`status-grid ${isAnimating ? 'animating' : ''}`}>
            <section className="timeline">
              <div className="timeline-head">
                <div className="timeline-bar"></div>
                <h1 className="status-title">Order Status : {order.status}</h1>
              </div>
              <div className="order-id">#Your Order ID : {order.id}</div>
              <div style={{ marginTop: 18 }}>
                {order.events.map((ev, idx) => {
                  const cls = ev.status === 'inprogress' ? 'pending' : ev.status; // เผื่อ CSS ไม่มี inprogress
                  return (
                    <div key={idx} className="event">
                      <img src={ev.icon} alt="" className="event-icon" />
                      <div className={`event-details ${cls}`}>
                        <div>{ev.title}</div>
                        {ev.time && <div className="event-time">{ev.time}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <aside className="summary-card">
              <h2 className="summary-title">Order Summary</h2>
              <div>
                {order.orderItems.map((it, i) => (
                  <div key={i} className="item-row">
                    {it.product.imageUrl ? <img src={it.product.imageUrl} alt={it.product.name} className="item-thumb" /> : <div className="item-thumb" style={{ background: '#f3f4f6' }} />}
                    <div>
                      <div className="item-name">{it.product.name}</div>
                      <div className="item-price">
                        {Number(it.product.price)} {"THB"} × {Number(it.qty ?? it.quantity ?? 1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-meta">
                <div className="summary-label">Delivery Fee</div>
                <div>{40} {"THB"}</div>
                <div className="summary-line" style={{ gridColumn: '1 / -1' }}></div>
                <div className="summary-total-label">Total Price</div>
                <div className="summary-total-price">{total} {"THB"}</div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
