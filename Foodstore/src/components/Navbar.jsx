import { NavLink } from "react-router-dom"; // ถ้ายังไม่ใช้ Router เปลี่ยนเป็น <a> ได้
import { FiTrendingUp, FiBookOpen, FiRefreshCcw, FiGrid, FiSettings } from "react-icons/fi";

const menu = [
  { to: "/", label: "Dashboard", icon: <FiTrendingUp /> },
  { to: "/menu", label: "Menu", icon: <FiBookOpen /> },
  { to: "/status", label: "Status", icon: <FiRefreshCcw /> },
  { to: "/orders", label: "Orders", icon: <FiGrid /> },
];

function Navbar() {
  return (
    <aside style={styles.aside}>
      <div style={styles.menuWrap}>
        {menu.map(item => (
          <NavLink
            key={item.label}
            to={item.to}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.active : {}),
            })}
          >
            <span style={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom Settings */}
      <NavLink
        to="/setting"
        style={({ isActive }) => ({
          ...styles.link,
          ...styles.setting,
          ...(isActive ? styles.active : {}),
        })}
      >
        <span style={styles.icon}><FiSettings /></span>
        <span>Setting</span>
      </NavLink>
    </aside>
  );
}

const styles = {
  aside: {
    width: 220,
    minHeight: "100vh",
    position: "sticky",
    top: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px 16px",
    background: "#fff",
    borderRight: "1px solid #eee",
  },
  menuWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 10,
    textDecoration: "none",
    color: "#111",
    fontWeight: 600,
  },
  active: {
    background: "#f3f4f6",
  },
  icon: {
    fontSize: 20,
  },
  setting: {
    marginTop: 24,
  },
};

export default Navbar;
