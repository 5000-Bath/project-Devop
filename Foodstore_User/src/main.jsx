import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Status from "./pages/Status.jsx";
import History from "./pages/History.jsx";
import Contact from "./pages/Contact.jsx";
import Order from "./pages/Order.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: "Home", element: <Home /> },
      { path: "Order", element: <Order /> },
      { path: "Status", element: <Status /> },
      { path: "History", element: <History /> },
      { path: "Contact", element: <Contact /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <div>Not Found</div> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
