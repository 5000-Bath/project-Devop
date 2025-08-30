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
import Contact from "./page/Contact.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },       // http://localhost:5173/
      { path: "menu", element: <About /> },     // /menu
      { path: "status", element: <Contact /> }, // /status
      { path: "orders", element: <Home /> },    // /orders (ตัวอย่าง)
      { path: "setting", element: <div>Setting Page</div> },
      { path: "*", element: <div>Not Found</div> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
