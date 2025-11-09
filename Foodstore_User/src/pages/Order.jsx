import React, { useContext, useState, useEffect } from 'react';
import './Order.css';
import { CartContext } from '../context/CartContext';
import { createOrderFromCart } from '../api/orders';
import { cutStock, checkStock } from '../api/products';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Order() {
  const { cartItems, addToCart, decreaseQuantity, removeFromCart } = useContext(CartContext);
  const { user, isAuthed, loading: authLoading } = useContext(AuthContext); 
  const nav = useNavigate();

  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [stockError, setStockError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cart') || '[]');
      if (!Array.isArray(saved) || saved.length === 0) return;

      [...cartItems].forEach(it => removeFromCart(it));

      for (const s of saved) {
        const qty = Math.max(1, Number(s.quantity || 1));
        const baseItem = {
          id: s.productId ?? s.id ?? `${s.name}-${s.price}`,
          name: s.name ?? '(unknown)',
          price: Number(s.price) || 0,
          imageUrl: s.imageUrl || '',
        };
        for (let i = 0; i < qty; i++) addToCart(baseItem);
      }
      localStorage.removeItem('cart');
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    }
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const clearCart = () => {
    const copy = [...cartItems];
    copy.forEach(it => removeFromCart(it));
  };

  const handleCheckout = async () => {
    if (!isAuthed) {
      nav(`/login?redirect=${encodeURIComponent("/Order")}`);
      return;
    }

    if (cartItems.length === 0) {
      alert('ตะกร้าสินค้าว่างเปล่า');
      return;
    }

    if (!user || !user.id) {
      alert('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
      nav('/login');
      return;
    }

    setIsProcessing(true);
    setStockError(null);

    try {
      await checkStock(cartItems);
      await cutStock(cartItems);

      const id = await createOrderFromCart(cartItems, { 
        userId: user.id  
      });
      
      if (id != null) {
        setLastOrderId(id);
        setIsCheckedOut(true);
        clearCart();
      } else {
        throw new Error('ไม่สามารถสร้างออเดอร์ได้');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setStockError(error.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ');
    } finally {
      setIsProcessing(false);
    }
  };

  const closePopup = () => {
    setIsCheckedOut(false);
    setLastOrderId(null);
  };

  const closePopupError = () => {
    setStockError(null);
  };

  if (authLoading) {
    return (
      <div className="order-page">
        <div className="order-details-header">
          <h1>Order Details</h1>
        </div>
        <div className="order-container">
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="order-details-header">
        <h1>Order Details</h1>
      </div>

      <div className="order-container">
        <div className="order-summary">
          <div className="summary-title">
            <div className="title-decorator"></div>
            <h2>Order Summary</h2>
          </div>

          {cartItems.length === 0 ? (
            <p className="empty-cart-message">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div className="order-item" key={item.id ?? item.name}>
                <div className="item-info">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <div className="placeholder-image">📦</div>
                  )}
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">{item.price} THB</p>
                  </div>
                </div>
                <div className="item-actions">
                  <div className="quantity-controller">
                    <button
                      className="qty-btn"
                      onClick={() => decreaseQuantity(item)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => addToCart(item)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item)}
                    aria-label="Remove item"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="checkout-summary" style={{ borderTop: '1px solid #eee', paddingTop: 16, marginTop: 16 }}>
          <div className="summary-line total" style={{ 
            fontWeight: "bold", 
            fontSize: "1.1em", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "8px 0" 
          }}>
            <span>Total Price</span>
            <span>{totalPrice} THB</span>
          </div>

          {!isAuthed && (
            <p style={{ 
              color: '#dc3545', 
              fontSize: '0.9em', 
              textAlign: 'center', 
              marginTop: '12px' 
            }}>
              กรุณาเข้าสู่ระบบก่อนสั่งซื้อ
            </p>
          )}

          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      </div>

      {isCheckedOut && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Checkout successfully! Your Order ID is #{lastOrderId}</p>
            <p style={{ fontSize: '0.9em', color: '#555', marginTop: '8px' }}>
              โปรดจำหมายเลขออเดอร์ เพื่อใช้ในการเช็คสถานะ
            </p>
            <div className="popup-buttons">
              <button className="popup-close-button" onClick={closePopup}>
                Close
              </button>
              <button
                className="popup-close-button"
                onClick={() => {
                  closePopup();
                  nav(`/status?orderId=${lastOrderId}`);
                }}
              >
                Go to Status
              </button>
            </div>
          </div>
        </div>
      )}

      {stockError && (
        <div className="popup-overlay">
          <div className="popup-content-error">
            <p>{stockError}</p>
            <div className="popup-buttons">
              <button className="popup-close-button" onClick={closePopupError}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}