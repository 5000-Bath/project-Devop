// import React, { useContext, useState } from 'react';
// import './Order.css';
// import { CartContext } from '../context/CartContext';
// import { useOrder } from '../context/OrderContext';
// import { useNavigate } from 'react-router-dom';

// export default function Order() {
//   const { cartItems, addToCart, decreaseQuantity, removeFromCart } = useContext(CartContext);
//   const { checkoutFromCart } = useOrder();
//   const nav = useNavigate();

//   const [isCheckedOut, setIsCheckedOut] = useState(false);
//   const [lastOrderId, setLastOrderId] = useState(null);

//   const deliveryFee = 40;
//   const discount = 0;

//   const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
//   const totalPrice = subtotal + deliveryFee - discount;

//   const handleCheckout = () => {
//     if (cartItems.length === 0) return;
//     const id = checkoutFromCart(cartItems, { deliveryFee, currency: 'THB' });
//     if (id) {
//       setLastOrderId(id);
//       setIsCheckedOut(true);
//       // ถ้าต้องการพาไปหน้า Status อัตโนมัติ ให้ใช้บรรทัดล่างแทน popup:
//       // nav(`/Status?orderId=${id}`);
//     }
//   };

//   const closePopup = () => {
//     setIsCheckedOut(false);
//   };

//   return (
//     <div className="order-page">
//       <div className="order-details-header">
//         <h1>Order Details</h1>
//       </div>

//       <div className="order-container">
//         {/* ซ้าย: รายการสินค้า */}
//         <div className="order-summary">
//           <div className="summary-title">
//             <div className="title-decorator"></div>
//             <h2>Order Summary</h2>
//           </div>

//           {cartItems.length === 0 ? (
//             <p>Your cart is empty.</p>
//           ) : (
//             cartItems.map((item) => (
//               <div className="order-item" key={item.name}>
//                 <div className="item-info">
//                   <img src={item.img} alt={item.name} />
//                   <div className="item-details">
//                     <p className="item-name">{item.name}</p>
//                     <p className="item-price">{item.price} THB</p>
//                   </div>
//                 </div>

//                 <div className="item-quantity">
//                   <button onClick={() => decreaseQuantity(item)}>-</button>
//                   <span>{item.quantity}</span>
//                   <button onClick={() => addToCart(item)}>+</button>
//                   <button onClick={() => removeFromCart(item)} className="remove-button">Remove</button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* ขวา: สรุปยอด + ปุ่ม Checkout */}
//         <div className="checkout-summary">
//           <div className="summary-line">
//             <span>Delivery Fee</span>
//             <span>{deliveryFee} THB</span>
//           </div>
//           <div className="summary-line">
//             <span>Discount</span>
//             <span>{discount} THB</span>
//           </div>
//           <div className="summary-line total">
//             <span>Total Price</span>
//             <span>{totalPrice} THB</span>
//           </div>

//           <button
//             className="checkout-button"
//             onClick={handleCheckout}
//             disabled={isCheckedOut || cartItems.length === 0}
//           >
//             Checkout
//           </button>
//         </div>
//       </div>

//       {/* Popup หลัง Checkout สำเร็จ */}
//       {isCheckedOut && (
//         <div className="popup-overlay">
//           <div className="popup-content">
//             <p>Checkout successfully! Your Order ID is #{lastOrderId}</p>
//             <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
//               <button className="popup-close-button" onClick={closePopup}>Close</button>
//               <button
//                 className="popup-close-button"
//                 onClick={() => nav(`/Status?orderId=${lastOrderId}`)}
//               >
//                 Go to Status
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useContext, useState } from 'react';
import './Order.css';
import { CartContext } from '../context/CartContext';
import { addOrderFromCart } from '../mockdb';   // 👈 ใช้ mockdb (ไม่ใช่ backend)
import { useNavigate } from 'react-router-dom';

export default function Order() {
  const { cartItems, addToCart, decreaseQuantity, removeFromCart } = useContext(CartContext);
  const nav = useNavigate();

  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);

  const deliveryFee = 40;
  const discount = 0;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) * Number(item.quantity)),
    0
  );
  const totalPrice = subtotal + deliveryFee - discount;

  const clearCart = () => {
    const copy = [...cartItems];
    copy.forEach(it => removeFromCart(it));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    const id = addOrderFromCart(cartItems, { deliveryFee, currency: 'THB' }); // 👈 บันทึกลง mockdb
    if (id) {
      setLastOrderId(id);
      setIsCheckedOut(true);   // แสดง popup พร้อม Order ID
      clearCart();
      // ถ้าอยากไปหน้า Status ทันทีแทน popup:
      // nav(`/status?orderId=${id}`);
    }
  };

  const closePopup = () => setIsCheckedOut(false);

  return (
    <div className="order-page">
      <div className="order-details-header">
        <h1>Order Details</h1>
      </div>

      <div className="order-container">
        {/* ซ้าย: รายการสินค้า */}
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
                  {item.img ? <img src={item.img} alt={item.name} /> : <div style={{width:80, height:80, background:'#f3f4f6'}} />}
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

        {/* ขวา: สรุปยอด + ปุ่ม Checkout */}
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

          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>

      {/* Popup หลัง Checkout สำเร็จ */}
      {isCheckedOut && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Checkout successfully! Your Order ID is #{lastOrderId}</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button className="popup-close-button" onClick={closePopup}>Close</button>
              <button
                className="popup-close-button"
                onClick={() => nav(`/status?orderId=${lastOrderId}`)}  // 👈 ไปหน้า Status
              >
                Go to Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
