
// // import Navbar from "./component/Navbar";   // ← โฟลเดอร์ component (ไม่มี s) และ N ใหญ่
// // import "./component/Navbar.css";

// // import { Outlet } from "react-router-dom";
// // import { CartProvider } from "./context/CartContext";

// // export default function App() {
// //   return (
// //     <div>
// //       <Navbar brand="Crayon Shinchan" />
// //       <main>
// //         <CartProvider>
// //           <Outlet />
// //         </CartProvider>
// //       </main>
// //     </div>
// //   );
// // }

// import Navbar from "./component/Navbar";   // โฟลเดอร์ component (ไม่มี s) และ N ใหญ่
// import "./component/Navbar.css";

// import { Outlet } from "react-router-dom";
// import { CartProvider } from "./context/CartContext";
// import { OrderProvider } from "./context/OrderContext"; // 👈 นำเข้า OrderProvider ใหม่

// export default function App() {
//   return (
//     <div>
//       <Navbar brand="Crayon Shinchan" />
//       <main>
//         {/* ครอบ CartProvider ไว้ข้างใน OrderProvider */}
//         <OrderProvider>
//           <CartProvider>
//             <Outlet />
//           </CartProvider>
//         </OrderProvider>
//       </main>
//     </div>
//   );
// }

import React from "react";
import Navbar from "./component/Navbar";
import "./component/Navbar.css";

import { Outlet, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
// ถ้าไม่มี OrderProvider ไม่ต้อง import/use ได้
// import { OrderProvider } from "./context/OrderContext";

export default function App() {
  const { pathname } = useLocation();
  const hideNavbar = pathname === "/";  // ⬅️ ซ่อนเฉพาะหน้า /

  return (
    <div>
      {!hideNavbar && <Navbar brand="Crayon Shinchan" />}
      <main>
        {/* ถ้ามี OrderProvider ให้ครอบเพิ่มได้ */}
        {/* <OrderProvider> */}
          <CartProvider>
            <Outlet />
          </CartProvider>
        {/* </OrderProvider> */}
      </main>
    </div>
  );
}
