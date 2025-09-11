import { NavLink } from "react-router-dom";
import "./Navbar.css";

// ปรับชื่อแบรนด์/โลโก้ได้ผ่าน prop
import logo from "../assets/shinchan.png"; // ถ้าไฟล์ชื่ออื่น ให้แก้พาธนี้

export default function Navbar({ brand = "Crayon Shinchan" }) {
  return (
    <header className="nav">
      <div className="nav__inner">
        {/* Brand (logo + title) */}
        <div className="nav__brand">
          <img className="nav__logo" src={logo} alt="Brand logo shinchan" />
          <h1 className="nav__title">
            Welcome to, <span>{brand}</span>
          </h1>
        </div>

        {/* Right links */}
        <nav className="nav__links" aria-label="Main">
          <NavLink to="/Home"   className={({isActive}) => "nav__link" + (isActive ? " is-active" : "")}>Menu</NavLink>
          <NavLink to="/Order" className={({isActive}) => "nav__link" + (isActive ? " is-active" : "")}>Orders</NavLink>
          <NavLink to="/Status" className={({isActive}) => "nav__link" + (isActive ? " is-active" : "")}>Status</NavLink>
          <NavLink to="/contact" className={({isActive}) => "nav__link" + (isActive ? " is-active" : "")}>Contact</NavLink>
          {/* ถ้า route จริงของคุณเป็น /status ให้เปลี่ยนเป็น to="/status" ได้เลย */}
        </nav>
      </div>
    </header>
  );
}