import { useState, useEffect, useMemo, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../component/Status.css';
import Swal from 'sweetalert2';



function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function Status() {
  const { user, isAuthed, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const q = useQuery();

  const [searchInput, setSearchInput] = useState(q.get('orderId') || '');
  const [order, setOrder] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // คำนวณ total ก่อน discount
  const subtotal = useMemo(() => {
    if (!order) return 0;
    return order.orderItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.qty),
      0
    );
  }, [order]);

  // คำนวณ final amount หลัง discount
  const finalAmount = useMemo(() => {
    if (!order) return 0;
    return Number(order.finalAmount ?? subtotal);
  }, [order, subtotal]);

  const discountAmount = useMemo(() => {
    if (!order) return 0;
    return Number(order.discountAmount ?? 0);
  }, [order]);

  function formatThaiFromLocalInput(inputStr) {
    if (!inputStr) return "";
    const iso = inputStr.replace(' ', 'T') + 'Z';
    const d = new Date(iso);
    if (isNaN(d)) return inputStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const yearBE = d.getFullYear() + 543;
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${yearBE} ${hour}:${minute}`;
  }

  const findOrder = async (id) => {
    const trimmed = String(id || '').trim();
    if (!trimmed) {
      setOrder(null);
      return;
    }

    if (!isAuthed) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาเข้าสู่ระบบ',
        text: 'คุณต้องเข้าสู่ระบบก่อนตรวจสอบสถานะออเดอร์',
        confirmButtonText: 'เข้าสู่ระบบ',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/login?redirect=/status?orderId=${trimmed}`);
        }
      });
      return;
    }

    try {
      setIsAnimating(false);

      const res = await fetch(`/api/orders/${trimmed}`, {
        credentials: 'include',
        headers: { Accept: 'application/json' }
      });

      if (!res.ok) {
        if (res.status === 403) throw new Error('คุณไม่มีสิทธิ์ดูออเดอร์นี้');
        // หากไม่พบข้อมูล (404) หรือเกิดปัญหาที่เซิร์ฟเวอร์ (500) ให้แจ้งว่าไม่พบ
        if (res.status === 404 || res.status === 500) {
          throw new Error('ไม่พบเลขออเดอร์นี้');
        }
        if (res.status === 401) {
          navigate(`/login?redirect=/status?orderId=${trimmed}`);
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const rawData = await res.json();
      const adapted = adaptOrder(rawData);

      if (!adapted) throw new Error('Invalid order data');

      setOrder(adapted);
    } catch (err) {
      console.error('Failed to fetch order:', err);
      setOrder(null);
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถโหลดออเดอร์',
        text: err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล',
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setTimeout(() => setIsAnimating(true), 50);
    }
  };

  function adaptOrder(api) {
    if (!api || typeof api !== 'object') return null;

    const items = Array.isArray(api.orderItems)
      ? api.orderItems.map((it) => ({
          id: it.id ?? null,
          name: it.product?.name ?? '',
          price: Number(it.product?.price ?? 0),
          qty: Number(it.quantity ?? it.qty ?? 1),
          img: it.product?.imageUrl ?? '/khao-man-kai.jpg',
        }))
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
      couponCode: api.couponCode ?? null,
      discountAmount: Number(api.discountAmount ?? 0),
      finalAmount: Number(api.finalAmount ?? null),
      orderItems: items,
      items,
      events: defaultEvents,
    };
  }

  const handleSearch = () => {
    const input = searchInput.trim();
    if (!input) {
      Swal.fire({ icon: 'warning', title: 'กรุณากรอกหมายเลขออเดอร์', timer: 2000, showConfirmButton: false });
      return;
    }
    if (!/^\d+$/.test(input)) {
      Swal.fire({ icon: 'error', title: 'ไม่ถูกต้อง', text: 'กรุณากรอกตัวเลขเท่านั้น', timer: 2000, showConfirmButton: false });
      return;
    }
    findOrder(input);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

  useEffect(() => {
    if (authLoading) return;

    const orderIdFromUrl = q.get('orderId');
    if (orderIdFromUrl) {
      const trimmed = orderIdFromUrl.trim();
      if (/^\d+$/.test(trimmed)) {
        setSearchInput(trimmed);
        findOrder(trimmed);
      } else {
        Swal.fire({ icon: 'error', title: 'ลิงก์ไม่ถูกต้อง', text: 'หมายเลขออเดอร์ในลิงก์ไม่ถูกต้อง', timer: 3000, showConfirmButton: false });
      }
    } else setIsAnimating(true);
  }, [authLoading]);

  if (authLoading) {
    return (
      <div className="status-page">
        <div className="status-header-bar">ORDER STATUS</div>
        <div className="status-main-container">
          <div className="message-container animating">
            <p className="message-text">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="status-page">
      <div className="status-header-bar">ORDER STATUS</div>
      <div className="status-main-container">
        <div className="search-container">
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Check your Order with your Order ID here" className="search-input" />
          <button onClick={handleSearch} className="search-button" title="Search order by ID">
            <img src="https://api.iconify.design/ic/outline-search.svg" alt="Search" className="search-icon" />
          </button>
        </div>

        {!order && (
          <div className={`message-container ${isAnimating ? 'animating' : ''}`}>
            <img src="https://api.iconify.design/ic/outline-receipt-long.svg?color=%239ca3af" alt="Search for order" className="message-icon" />
            <p className="message-text">Please enter your Order ID to see the status.</p>
            {isAuthed && <p className="message-sub-text">หรือดูประวัติออเดอร์ทั้งหมดได้ที่ <a href="/history" style={{ color: '#3b82f6' }}>History</a></p>}
            {!isAuthed && <p className="message-sub-text">กรุณา <a href="/login" style={{ color: '#3b82f6' }}>เข้าสู่ระบบ</a> เพื่อดูสถานะออเดอร์</p>}
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
                    <img src={it.img || '/khao-man-kai.jpg'} alt={it.name} className="item-thumb" />
                    <div>
                      <div className="item-name">{it.name}</div>
                      <div className="item-price">{it.price} THB × {it.qty}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-meta" style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
                <div className="summary-total-label">Subtotal</div>
                <div className="summary-total-price">{subtotal} THB</div>

                {discountAmount > 0 && (
                  <>
                    <div className="summary-total-label">Discount ({order.couponCode})</div>
                    <div className="summary-total-price">- {discountAmount} THB</div>
                  </>
                )}

                <div className="summary-total-label" style={{ fontWeight: 'bold' }}>Final Amount</div>
                <div className="summary-total-price" style={{ fontWeight: 'bold' }}>{finalAmount} THB</div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
