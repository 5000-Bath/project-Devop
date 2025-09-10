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
import {createBrowserRouter, RouterProvider, redirect,} from "react-router-dom";

import App from "./App.jsx";
import Home from "./page/Home.jsx";
import About from "./page/About.jsx";
import Contact from "./page/Contact.jsx";
import Login from "./page/Login.jsx";

const requireAuth = () => {
  const authed = localStorage.getItem("auth") === "true";
  if (!authed) return redirect("/login");
  return null;
};

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <App />,
    loader: requireAuth, 
    children: [
      { index: true, element: <Home /> },      
      { path: "menu", element: <About /> },     
      { path: "status", element: <Contact /> }, 
      { path: "orders", element: <Home /> },    
      { path: "setting", element: <div>Setting Page</div> },
      { path: "*", element: <div>Not Found</div> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);