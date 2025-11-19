import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import ReactDOM from "react-dom/client"; // ✅ สำคัญ

import { Buffer } from 'buffer';
window.Buffer = Buffer;

import App from "./App.jsx";
import Home from "./page/Home.jsx";
import About from "./page/About.jsx";
import Contact from "./page/status.jsx";
import Additem from "./page/AddItem.jsx";
import Setting from "./page/setting.jsx";
import Orders from "./page/Orders.jsx";
import Coupons from "./page/coupons.jsx"; // แก้ไข path
import Ordersdetail from "./page/Ordersdetail.jsx";
import Login from "./page/Login.jsx";

const API_BASE = "";

// 🔹 PrivateRoute wrapper
function PrivateRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${API_BASE}/auth/check`, {
                    method: "GET",
                    credentials: "include", // ส่ง cookie ไปตรวจสอบ
                });
                if (res.ok) {
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            } catch (error) {
                console.error(error);
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!authenticated) return <Navigate to="/" replace />;

    return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App layout="auth" />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: "/admin",
    element: <App layout="main" />,
    children: [
      { path: "dashboard", element: <PrivateRoute><Home /></PrivateRoute> },
      { path: "menu", element: <PrivateRoute><About /></PrivateRoute> },
      { path: "status", element: <PrivateRoute><Contact /></PrivateRoute> },
      { path: "orders", element: <PrivateRoute><Orders /></PrivateRoute> }, { path: "orders/orders-detail/:id", element: <PrivateRoute><Ordersdetail /></PrivateRoute> },
      { path: "add-item", element: <PrivateRoute><Additem /></PrivateRoute> },
      { path: "setting", element: <PrivateRoute><Setting /></PrivateRoute> },
      { path: "Coupons", element: <PrivateRoute><Coupons /></PrivateRoute> },
    ],
  },
  { path: "*", element: <div>Not Found</div> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
