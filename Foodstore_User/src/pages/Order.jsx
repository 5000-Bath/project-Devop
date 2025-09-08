
import React, { useContext, useState } from 'react';
import './Order.css';
import { CartContext } from '../context/CartContext';

export default function Order() {
  const { cartItems, addToCart, decreaseQuantity, removeFromCart } = useContext(CartContext);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [orderId] = useState(Math.floor(Math.random() * 10000));

  const handleCheckout = () => {
    setIsCheckedOut(true);
  };

  const closePopup = () => {
    setIsCheckedOut(false);
  };

  const deliveryFee = 40;
  const discount = 0;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalPrice = subtotal + deliveryFee - discount;

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
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div className="order-item" key={item.name}>
                <div className="item-info">
                  <img src={item.img} alt={item.name} />
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">{item.price} THB</p>
                  </div>
                </div>
                <div className="item-quantity">
                  <button onClick={() => decreaseQuantity(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item)}>+</button>
                  <button onClick={() => removeFromCart(item)} className="remove-button">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="checkout-summary">
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
          <button className="checkout-button" onClick={handleCheckout} disabled={isCheckedOut || cartItems.length === 0}>
            Checkout
          </button>
        </div>
      </div>

      {isCheckedOut && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Checkout successfully! Your Order ID is #{orderId}</p>
            <button className="popup-close-button" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
