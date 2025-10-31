import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Home.css';
import placeholder from '../assets/menupic/khao-man-kai.jpg';
import { CartContext } from '../context/CartContext';
import { listProducts } from '../api/products';

const CATEGORY_OPTIONS = ['อาหารคาว', 'ของหวาน', 'เครื่องดื่ม', 'เมนูพิเศษ'];

const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => onClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;
  return <div className="toast">{message}</div>;
};

const Home = () => {
  const { cartItems, addToCart } = useContext(CartContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [toast, setToast] = useState({ isVisible: false, message: '' });
  const [pressedButtonId, setPressedButtonId] = useState(null);
  const [isCartShaking, setIsCartShaking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    let ignore = false;
    listProducts()
      .then(data => { if (!ignore) setItems(Array.isArray(data) ? data : []); })
      .catch(e => { if (!ignore) setErr(e.message || 'Fetch failed'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const handleAdd = (p) => {
    const cartItem = {
      id: p.id ?? p.productId ?? p.menuId,
      name: p.name,
      price: Number(p.price ?? 0),
      imageUrl: p.imageUrl ?? p.img ?? placeholder,
      quantity: 1,
    };
    addToCart(cartItem);
    setIsCartShaking(true);
    setToast({ isVisible: true, message: `เพิ่ม "${p.name}" ลงตะกร้าแล้ว!` });
    const id = p.id ?? p.productId ?? p.menuId;
    setPressedButtonId(id);
    setTimeout(() => setPressedButtonId(null), 300);
  };

  const resolveItemCategory = (item) => item.category || item.cat || item.type || item.group || 'อื่นๆ';

  const filteredItems = items.filter(item => {
    if (selectedCategory === 'All') return true;
    return resolveItemCategory(item) === selectedCategory;
  });

  const availableCategories = React.useMemo(() => {
    const set = new Set();
    items.forEach(item => set.add(resolveItemCategory(item)));
    CATEGORY_OPTIONS.forEach(c => set.add(c));
    return ['All', ...Array.from(set)];
  }, [items]);

  return (
    <div className="home-container">
      <div className="all-menus-header">
        <div className="header-left">
          <h1>ALL MENUS</h1>
        </div>

        <div className="category-bar">
          <div className="category-tabs" role="tablist" aria-label="Categories">
            <button
              className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('All')}
              aria-pressed={selectedCategory === 'All'}
              aria-label="All categories"
            >
              All
            </button>

            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                aria-label={cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="menu-grid-container">
        {loading && <div style={{ padding: 24 }}>Loading...</div>}
        {err && !loading && <div style={{ padding: 24, color: 'red' }}>Error: {err}</div>}

        {!loading && !err && (
          <>
            {filteredItems.length === 0 ? (
              <div style={{ padding: 24, color: '#555' }}>
                ไม่พบเมนูสำหรับหมวดหมู่ "{selectedCategory === 'All' ? 'ทั้งหมด' : selectedCategory}"
              </div>
            ) : (
              <div className="menu-grid">
                {filteredItems.map((item) => {
                  const buttonId = item.id ?? item.productId ?? item.menuId ?? item.name;
                  return (
                    <div className="menu-card" key={buttonId}>
                      <div className="image-wrapper">
                        <img src={item.imageUrl ?? placeholder} alt={item.name} className="product-image" />
                        {item.stock <= 0 && (
                          <div className="sold-out-overlay">
                            <span className="sold-out-text">SOLD OUT</span>
                          </div>
                        )}
                      </div>

                      <div className="menu-card-name">{item.name}</div>
                      <div className="menu-card-price">{item.price} THB</div>
                      <button
                        className={`add-to-cart-button ${pressedButtonId === buttonId ? 'pressed' : ''}`}
                        onClick={() => handleAdd(item)}
                        disabled={item.stock <= 0}
                      >
                        +1
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <Toast message={toast.message} isVisible={toast.isVisible} onClose={() => setToast({ isVisible: false, message: '' })} />

      <div className="cart-icon-wrapper">
        <NavLink to="/Order" className="cart-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16"
               className={isCartShaking ? "cart-icon--shake" : ""} onAnimationEnd={() => setIsCartShaking(false)}>
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
          {totalQuantity > 0 && <span className="cart-count">{totalQuantity}</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Home;