import React from "react";
import Navbar from "./component/Navbar";
import "./component/Navbar.css";
import { Outlet, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const { pathname } = useLocation();
  const hideNavbar = pathname === "/";

  return (
    <AuthProvider>
      {!hideNavbar && <Navbar brand="Crayon Shinchan" />}
      <main>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </main>
    </AuthProvider>
  );
}
