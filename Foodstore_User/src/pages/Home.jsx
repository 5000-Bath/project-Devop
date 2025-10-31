import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Fuse from 'fuse.js';
import './Home.css';
import placeholder from '../assets/menupic/khao-man-kai.jpg';
import { CartContext } from '../context/CartContext';
import { listProducts } from '../api/products';

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

// 🔹 normalize text
function normalizeText(text) {
  if (!text) return '';
  return text.normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase();
}

// 🔹 แปลงไทย → อังกฤษ (สามารถเชื่อม AI API ภายนอกได้)
function translateThaiToEng(text) {
  if (!text) return '';
  text = normalizeText(text);

  // ตัวอย่าง regex + พจนานุกรมง่าย ๆ
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

const Home = () => {
  const { cartItems, addToCart } = useContext(CartContext);
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [toast, setToast] = useState({ isVisible: false, message: '' });
  const [pressedButtonId, setPressedButtonId] = useState(null);
  const [isCartShaking, setIsCartShaking] = useState(false);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    let ignore = false;
    listProducts()
      .then((data) => {
        if (!ignore) {
          const list = Array.isArray(data) ? data : [];
          setItems(list);
          setFiltered(list);
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

  // 🔹 bilingual search โดยใช้ regex / translation
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(items);
      return;
    }

    const normalizedSearch = normalizeText(searchTerm);
    const translatedSearch = translateThaiToEng(normalizedSearch);

    const itemsWithSearchable = items.map(item => {
      const name = normalizeText(item.name);
      const desc = normalizeText(item.description);

      // แปลงชื่อ + description ด้วยฟังก์ชัน translation
      const translatedName = translateThaiToEng(name);
      const translatedDesc = translateThaiToEng(desc);

      const _searchable = [name, desc, translatedName, translatedDesc];
      return { ...item, _searchable };
    });

    const fuse = new Fuse(itemsWithSearchable, {
      keys: ['_searchable'],
      threshold: 0.4,
    });

    const results = fuse.search(translatedSearch);
    setFiltered(results.map(r => r.item));
  }, [searchTerm, items]);

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

  return (
    <div className="home-container">
      <div className="all-menus-header">
        <h1>ALL MENUS</h1>
        <input
          type="text"
          placeholder="Search menu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="menu-grid-container">
        {loading && <div style={{ padding: 24 }}>Loading...</div>}
        {err && !loading && <div style={{ padding: 24, color: 'red' }}>Error: {err}</div>}

        {!loading && !err && (
          <div className="menu-grid">
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const buttonId = item.id ?? item.productId ?? item.menuId;
                return (
                  <div className="menu-card" key={item.id ?? item.name}>
                    <div className="image-wrapper">
                      <img
                        src={item.imageUrl ?? placeholder}
                        alt={item.name}
                        className="product-image"
                      />
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
              })
            ) : (
              <div className="no-results">ไม่พบเมนูที่ค้นหา</div>
            )}
          </div>
        )}
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ isVisible: false, message: '' })}
      />

      <div className="cart-icon-wrapper">
        <NavLink to="/Order" className="cart-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="currentColor"
            viewBox="0 0 16 16"
            className={isCartShaking ? 'cart-icon--shake' : ''}
            onAnimationEnd={() => setIsCartShaking(false)}
          >
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 0 0 1 0-2z" />
          </svg>
          {totalQuantity > 0 && <span className="cart-count">{totalQuantity}</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Home;
