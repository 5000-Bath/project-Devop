import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { FiMenu } from "react-icons/fi";

export default function App({ layout = "main" }) {
  // ใช้เฉพาะ MainLayout เท่านั้น
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (layout === "main") {
      const handleResize = () => {
        if (window.innerWidth > 768) {
          setSidebarOpen(true);
        } else {
          setSidebarOpen(false);
        }
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [layout]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // ✅ Auth Layout (ใช้กับหน้า login, register)
  if (layout === "auth") {
    return (
      <div>
        <Outlet />
      </div>
    );
  }

  // ✅ Main Layout (มี Navbar)
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Navbar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main
        style={{
          flex: 1,
          marginLeft: window.innerWidth > 768 && sidebarOpen ? 220 : 0,
          transition: "margin-left 0.3s ease",
          padding: "20px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 20px",
          }}
        >
          <button
            onClick={toggleSidebar}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#333",
            }}
          >
            <FiMenu size={24} />
          </button>
          <div style={{ flex: 1 }}></div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
