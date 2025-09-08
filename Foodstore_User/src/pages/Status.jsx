import { useState, useEffect } from 'react';
import '../component/Status.css';

// Mock database of orders with simple IDs and various statuses
const mockDatabase = {
  '1': {
    id: '1',
    status: 'Order Received',
    events: [
      { icon: "https://api.iconify.design/ic/outline-restaurant.svg?color=%23000000", title: "Order Received", time: "Aug 31, 2025 19:00", status: 'inprogress'},
      { icon: "https://api.iconify.design/ic/outline-ramen-dining.svg?color=%23888888", title: "Cooking Order", time: "", status: 'pending'},
      { icon: "https://api.iconify.design/ic/outline-check-circle.svg?color=%23888888", title: "Order Finished", time: "", status: 'pending'},
    ],
    items: [
      { name: "ก๋วยเตี๋ยวเรือ", price: 60,  img: "https://img.wongnai.com/p/1920x0/2021/08/17/e18531c456a344369480a1d3c1b471da.jpg" },
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
      { name: "ข้าวมันไก่โกเอต", price: 50,  img: "https://img.wongnai.com/p/1920x0/2019/07/20/028c88396694499b9019b375b3a8836f.jpg" },
      { name: "เป็ดพะโล้โกก้อง", price: 120, img: "https://cdn.centerpoint.market/wp-content/uploads/2022/04/25182918/11-2-768x512.jpg" },
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
        { name: 'พิซซ่าฮาวายเอี้ยน', price: 250, img: 'https://www.gornogor.com/wp-content/uploads/2022/02/Hawaiian-Pizza-The-Best-Recipe-e1645391431385.jpg' },
        { name: 'โค้ก', price: 20, img: 'https://backend.tops.co.th/media/catalog/product/8/8/8851959132019_1.jpg' },
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
        { name: 'ส้มตำปูปลาร้า', price: 80, img: 'https://i.ytimg.com/vi/Hq_S-a1a_wA/maxresdefault.jpg' },
    ],
    deliveryFee: 25,
    currency: 'THB',
  }
};

export default function Status() {
    const [searchInput, setSearchInput] = useState('');
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    const handleSearch = () => {
      setIsAnimating(false);
      setError('');
      setOrder(null);

      setTimeout(() => {
        if (mockDatabase[searchInput]) {
          setOrder(mockDatabase[searchInput]);
          setIsAnimating(true);
        } else {
          setError(`Order with ID "${searchInput}" not found.`);
          setIsAnimating(true);
        }
      }, 100);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    }

    const total = order ? order.items.reduce((s, it) => s + it.price, 0) + order.deliveryFee : 0;
  
    useEffect(() => {
      if (!order && !error) {
        setIsAnimating(true);
      }
    }, [order, error]);
  
    return (
      <div className="status-page">
        <div className="status-header-bar">ORDER STATUS</div>

        <div className="status-main-container">
          <div className="search-container">
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Check your Order with your Order ID here" 
              className="search-input" 
            />
            <button onClick={handleSearch} className="search-button">
              <img 
                src="https://api.iconify.design/ic/outline-search.svg" 
                alt="Search" 
                className="search-icon" 
              />
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
              <p className="message-sub-text">(Try: 1, 2, 3, or 4)</p>
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
                  {order.events.map((ev) => (
                    <div key={ev.title} className="event">
                      <img src={ev.icon} alt="" className="event-icon" />
                      <div className={`event-details ${ev.status}`}>
                        <div>{ev.title}</div>
                        {ev.time && <div className="event-time">{ev.time}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <aside className="summary-card">
                <h2 className="summary-title">Order Summary</h2>
                <div>
                  {order.items.map((it) => (
                    <div key={it.name} className="item-row">
                      <img src={it.img} alt={it.name} className="item-thumb" />
                      <div>
                        <div className="item-name">{it.name}</div>
                        <div className="item-price">{it.price} {order.currency}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="summary-meta">
                  <div className="summary-label">Delivery Fee</div>
                  <div>{order.deliveryFee} {order.currency}</div>
                  <div className="summary-line" style={{ gridColumn: '1 / -1' }}></div>
                  <div className="summary-total-label">Total Price</div>
                  <div className="summary-total-price">{total} {order.currency}</div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    );
  }