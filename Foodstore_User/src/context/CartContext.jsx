import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.name === item.name);
      if (existingItem) {
        return prevItems.map(i => 
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (item) => {
    setCartItems(prevItems => prevItems.filter(i => i.name !== item.name));
  };

  const decreaseQuantity = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.name === item.name);
      if (existingItem.quantity === 1) {
        return prevItems.filter(i => i.name !== item.name);
      } else {
        return prevItems.map(i =>
          i.name === item.name ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};