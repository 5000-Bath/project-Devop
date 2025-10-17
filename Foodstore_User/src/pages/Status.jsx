import { useState, useEffect, useMemo } from 'react';
import '../component/Status.css';
import { getOrderById } from '../api/orders';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function Status() {
  const q = useQuery();
  const [searchInput, setSearchInput] = useState(q.get('orderId') || '');
  const [order, setOrder] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const API_BASE = "";

  //  คำนวณยอดรวมทั้งหมดจาก orderItems (ไม่รวมค่าส่ง)
  const total = useMemo(() => {
    if (!order) return 0;
    const items = Array.isArray(order.orderItems) ? order.orderItems : [];
    return items.reduce(
      (sum, item) => sum + Number(item?.price ?? 0) * Number(item?.qty ?? 0),
      0
    );
  }, [order]);

  // 🛠 ฟังก์ชันดึงข้อมูลออเดอร์ + จัดการ error
  const findOrder = async (id) => {
    const trimmed = String(id || '').trim();
    if (!trimmed) {
      setOrder(null);
      return;
    }

    try {
      setIsAnimating(false);
      const rawData = await getOrderById(trimmed);

      // ✅ แปลงข้อมูลให้เป็นรูปแบบที่ใช้งานได้
      const adapted = adaptOrder(rawData, API_BASE);
      if (!adapted) throw new Error('Invalid order data');

      setOrder(adapted);
    } catch (err) {
      console.error('Failed to fetch order:', err);
      setOrder(null);
      Swal.fire({
        icon: 'error',
        title: 'ไม่พบออเดอร์',
        text: 'หมายเลขออเดอร์นี้ไม่ถูกต้องหรือไม่มีอยู่ในระบบ',
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setTimeout(() => setIsAnimating(true), 50);
    }
  };

  // 📅 ฟอร์แมตวันที่เป็นไทย
  function formatThaiFromLocalInput(inputStr) {
    const iso = inputStr.replace(' ', 'T') + 'Z';
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const yearBE = d.getFullYear() + 543;
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${yearBE} ${hour}:${minute}`;
  }

  // 🕒 เหตุการณ์เริ่มต้น
  const createInitialEvents = (order) => [
    {
      icon: 'https://api.iconify.design/ic/outline-restaurant.svg?color=%23000000',
      title: 'Cooking Order',
      time: order?.createdAt ? formatThaiFromLocalInput(order.createdAt) : '',
      status: 'done',
    },
  ];

  // 🔍 ค้นหาเมื่อกดปุ่ม
  const handleSearch = () => {
    const input = searchInput.trim();
    if (!input) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกหมายเลขออเดอร์',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (!/^\d+$/.test(input)) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่ถูกต้อง',
        text: 'กรุณากรอกตัวเลขเท่านั้น',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    findOrder(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // 🔄 โหลดออเดอร์จาก URL (เมื่อเข้ามาครั้งแรก)
  useEffect(() => {
    const orderIdFromUrl = q.get('orderId');
    if (orderIdFromUrl) {
      const trimmed = orderIdFromUrl.trim();
      if (/^\d+$/.test(trimmed)) {
        setSearchInput(trimmed);
        findOrder(trimmed);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'ลิงก์ไม่ถูกต้อง',
          text: 'หมายเลขออเดอร์ในลิงก์ไม่ถูกต้อง',
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } else {
      setIsAnimating(true);
    }
  }, []); // รันแค่ตอน mount

  // 🧩 แปลงข้อมูลออเดอร์ให้ใช้งานง่าย
  function adaptOrder(api) {
    if (!api || typeof api !== 'object') return null;

    const items = Array.isArray(api.orderItems)
      ? api.orderItems.map((it) => {
        return {
          id: it.id ?? null,
          name: it.product?.name ?? '',
          price: Number(it.product?.price ?? 0),
          qty: Number(it.quantity ?? it.qty ?? 1),
          img: it.product?.imageUrl ?? '/khao-man-kai.jpg', // <-- ใช้ตรงๆ เหมือน Home
        };
      })
      : [];

    const defaultEvents = [
      {
        title: 'Order Created',
        status: 'done',
        time: api.createdAt ? formatThaiFromLocalInput(api.createdAt) : '',
        icon: 'https://api.iconify.design/mdi/clipboard-text.svg',
      },
    ];

    return {
      id: api.id ?? null,
      status: api.status ?? 'PENDING',
      createdAt: api.createdAt ?? null,
      deliveryFee: Number(api.deliveryFee ?? 0),
      orderItems: items,
      items,
      events: defaultEvents,
    };
  }


  // 🖼 Render UI
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
          <button
            onClick={handleSearch}
            className="search-button"
            title="Search order by ID"
          >
            <img
              src="https://api.iconify.design/ic/outline-search.svg"
              alt="Search"
              className="search-icon"
            />
          </button>
        </div>

        {!order && (
          <div className={`message-container ${isAnimating ? 'animating' : ''}`}>
            <img
              src="https://api.iconify.design/ic/outline-receipt-long.svg?color=%239ca3af"
              alt="Search for order"
              className="message-icon"
            />
            <p className="message-text">
              Please enter your Order ID to see the status.
            </p>
            <p className="message-sub-text">
              (Try: 1, 2, 3, or 4 — หรือใช้ Order ID ล่าสุดที่เพิ่ง Checkout)
            </p>
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
                  const cls = ev.status === 'inprogress' ? 'pending' : ev.status;
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
                    {it.img ? (
                      <img src={it.img} alt={it.name} className="item-thumb" />
                    ) : (
                      <img
                        src="/khao-man-kai.jpg"
                        alt={it.name}
                        className="item-thumb"
                      />
                    )}
                    <div>
                      <div className="item-name">{it.name}</div>
                      <div className="item-price">
                        {it.price} THB × {it.qty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-meta" style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
                <div className="summary-total-label">Total Price</div>
                <div className="summary-total-price">{total} THB</div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}