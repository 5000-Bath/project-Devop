// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import Home from "./page/Home.jsx";
import About from "./page/About.jsx";
import Contact from "./page/status.jsx";
import Additem from "./page/AddItem.jsx";
import Setting from "./page/setting.jsx";
import Orders from "./page/Orders.jsx";
import Ordersdetail from "./page/Ordersdetail.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },       // http://localhost:5173/
      { path: "admin/menu", element: <About /> },     // /menu
      { path: "admin/status", element: <Contact /> }, // /status
      { path: "admin/orders", element: <Orders /> },
      { path: "admin/orders/orders-detail", element: <Ordersdetail /> },    
      { path: "admin/add-item", element: <Additem /> },    // /orders (ตัวอย่าง)
      { path: "admin/setting", element: <Setting /> },
      { path: "*", element: <div>Not Found</div> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
