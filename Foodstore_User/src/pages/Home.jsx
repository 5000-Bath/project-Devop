import React, { useContext, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Fuse from 'fuse.js';
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
  return <div className="toast" role="status" aria-live="polite">{message}</div>;
};

function normalizeText(text) {
  if (!text) return '';
  return String(text).normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase();
}

function translateThaiToEng(text) {
  if (!text) return '';
  text = normalizeText(text);

  const dict = {
    น้ำ: 'water',
    ข้าว: 'rice',
    ไก่: 'chicken',
    หมู: 'pork',
    ปลา: 'fish',
    ชา: 'tea',
    กาแฟ: 'coffee',
  };

  for (const [thai, eng] of Object.entries(dict)) {
    const pattern = new RegExp(thai, 'gi');
    text = text.replace(pattern, eng);
  }

  return text;
}

const resolveItemCategory = (item) => item.category || item.cat || item.type || item.group || 'อื่นๆ';

const Home = () => {
  const { cartItems, addToCart } = useContext(CartContext);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
      .then((data) => {
        if (!ignore) {
          const list = Array.isArray(data) ? data : [];
          setItems(list);
        }
      })
      .catch((e) => {
        if (!ignore) setErr(e.message || 'Fetch failed');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => { ignore = true; };
  }, []);

  const availableCategories = useMemo(() => {
    const set = new Set();
    items.forEach(item => set.add(resolveItemCategory(item)));
    CATEGORY_OPTIONS.forEach(c => set.add(c));
    return ['All', ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    let list = items.slice();

    // category filter
    if (selectedCategory && selectedCategory !== 'All') {
      list = list.filter(item => resolveItemCategory(item) === selectedCategory);
    }

    // search
    if (!searchTerm.trim()) {
      return list;
    }

    const normalizedSearch = normalizeText(searchTerm);
    const translatedSearch = translateThaiToEng(normalizedSearch);

    const itemsWithSearchable = list.map(item => {
      const name = normalizeText(item.name);
      const desc = normalizeText(item.description);
      const translatedName = translateThaiToEng(name);
      const translatedDesc = translateThaiToEng(desc);
      const searchable = [name, desc, translatedName, translatedDesc].join(' ');
      return { ...item, searchable };
    });

    const fuse = new Fuse(itemsWithSearchable, {
      keys: ['searchable'],
      threshold: 0.4,
    });

    const results = fuse.search(translatedSearch);
    return results.length ? results.map(r => r.item) : [];
  }, [items, searchTerm, selectedCategory]);

  const handleAdd = (p) => {
    const cartItem = {
      id: p.id ?? p.productId ?? p.menuId ?? p.name,
      name: p.name,
      price: Number(p.price ?? 0),
      imageUrl: p.imageUrl ?? p.img ?? placeholder,
      quantity: 1,
    };

    addToCart(cartItem);
    setIsCartShaking(true);
    setToast({ isVisible: true, message: `เพิ่ม "${p.name}" ลงตะกร้าแล้ว!` });
    const id = cartItem.id;
    setPressedButtonId(id);
    setTimeout(() => setPressedButtonId(null), 300);
    // fallback to clear shake in case animationend doesn't fire
    setTimeout(() => setIsCartShaking(false), 800);
  };

  return (
    <div className="home-container">
      <div className="all-menus-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h1>ALL MENUS</h1>
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
            aria-label="ค้นหาเมนู"
          />
        </div>

        <div className="category-bar" role="tablist" aria-label="Categories">
          <button
            className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
            aria-pressed={selectedCategory === 'All'}
            aria-label="All categories"
          >
            All
          </button>

          {availableCategories.filter(c => c !== 'All').map((cat) => (
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

      <div className="menu-grid-container">
        {loading && <div style={{ padding: 24 }}>Loading...</div>}
        {err && !loading && <div style={{ padding: 24, color: 'red' }}>Error: {err}</div>}

        {!loading && !err && (
          <>
            {filteredItems.length === 0 ? (
              <div className="no-results" style={{ padding: 24, color: '#555' }}>
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
                        {typeof item.stock !== 'undefined' && item.stock <= 0 && (
                          <div className="sold-out-overlay" aria-hidden>
                            <span className="sold-out-text">SOLD OUT</span>
                          </div>
                        )}
                      </div>

                      <div className="menu-card-name">{item.name}</div>
                      <div className="menu-card-price">{item.price} THB</div>
                      <button
                        className={`add-to-cart-button ${pressedButtonId === buttonId ? 'pressed' : ''}`}
                        onClick={() => handleAdd(item)}
                        disabled={typeof item.stock !== 'undefined' && item.stock <= 0}
                        aria-label={`เพิ่ม ${item.name} ลงตะกร้า`}
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
        <NavLink to="/Order" className="cart-icon" aria-label="ไปยังหน้าออเดอร์">
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