// components/Navbar.jsx
import { NavLink } from "react-router-dom";
import { FiTrendingUp, FiBookOpen, FiGrid, FiSettings, FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const menu = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <FiTrendingUp /> },
  { to: "/admin/menu", label: "Menu", icon: <FiBookOpen /> },
  { to: "/admin/orders", label: "Orders", icon: <FiGrid /> },
  { to: "/admin/setting", label: "Setting", icon: <FiSettings /> },
];

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export default function Navbar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include", // ต้อง include cookie ด้วย
      });
      // redirect ไปหน้า login
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          minHeight: "100vh",
          maxHeight: "100vh", // จำกัดความสูง
          position: "fixed",
          top: 0,
          left: 0,
          background: "#2c3e50",
          display: "flex",
          flexDirection: "column",
          // ✅ ลบ justifyContent: "space-between"
          padding: "20px 16px",
          zIndex: 1000,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          overflowY: "auto", // ✅ ให้เลื่อนได้ถ้าล้น
        }}
      >
        {/* เมนูหลัก */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 10,
                textDecoration: "none",
                color: "#fff",
                fontWeight: 600,
                background: isActive ? "#34495e" : "transparent",
              })}
              onClick={() => window.innerWidth <= 768 && toggleSidebar()}
            >
              <span style={{ fontSize: 20, color: "#ecf0f1" }}>{item.icon}</span>
              <span style={{ color: "#ecf0f1" }}>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout */}
        <div
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            borderRadius: 10,
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            marginTop: 20,
            background: "transparent",
          }}
        >
          <span style={{ fontSize: 20, color: "#ecf0f1" }}><FiLogOut /></span>
          <span style={{ color: "#ecf0f1" }}>Logout</span>
        </div>



      </aside>




      {/* Overlay สำหรับมือถือ */}
      {isOpen && window.innerWidth <= 768 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 999,
          }}
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}