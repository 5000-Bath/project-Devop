import React, { useContext, useState } from 'react';
import './Order.css';
import { CartContext } from '../context/CartContext';
import { createOrderFromCart } from '../api/orders';
import { cutStock, checkStock } from '../api/products';
import { useNavigate } from 'react-router-dom';

export default function Order() {
  const { cartItems, addToCart, decreaseQuantity, removeFromCart } = useContext(CartContext);
  const nav = useNavigate();

  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [stockError, setStockError] = useState(null);

  const deliveryFee = 40;
  const discount = 0;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  const totalPrice = subtotal + deliveryFee - discount;

  const clearCart = () => {
    const copy = [...cartItems];
    copy.forEach(it => removeFromCart(it));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    try {
      await checkStock(cartItems);
      await cutStock(cartItems);
      const id = await createOrderFromCart(cartItems, { userId: 1 });
      if (id != null) {
        setLastOrderId(id);
        setIsCheckedOut(true);
        clearCart();
      }
    } catch (error) {
      setStockError(error.message || 'ตรวจสอบสต็อกไม่สำเร็จ');
    }
  };

  const closePopup = () => setIsCheckedOut(false);
  const closePopupError = () => setStockError(null);

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
                    <div className="placeholder-image" />
                  )}
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">{item.price} THB</p>
                  </div>
                </div>
                <div className="item-actions">
                  {/* Quantity Controller */}
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

                  {/* Remove Button with Trash Icon */}
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

        <div className="checkout-summary">
          <div className="summary-line">
            <span>Subtotal</span>
            <span>{subtotal} THB</span>
          </div>
          <div className="summary-line">
            <span>Delivery Fee</span>
            <span>{deliveryFee} THB</span>
          </div>
          <div className="summary-line">
            <span>Discount</span>
            <span>{discount} THB</span>
          </div>
          <div className="summary-line total">
            <span>Total Price</span>
            <span>{totalPrice} THB</span>
          </div>

          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>

      {/* Success Popup */}
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
                onClick={() => nav(`/status?orderId=${lastOrderId}`)}
              >
                Go to Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
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