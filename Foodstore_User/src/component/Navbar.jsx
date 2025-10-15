import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

import logo from "../assets/shinchan.png";

export default function Navbar({ brand = "Crayon Shinchan" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* Brand */}
        <div className="nav__brand">
          <img className="nav__logo" src={logo} alt="Brand logo shinchan" />
          <h1 className="nav__title">
            Welcome to, <span>{brand}</span>
          </h1>
        </div>

        {/* Hamburger button (มือถือเท่านั้น) */}
        <button
          className="nav__hamburger"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation links */}
        <nav
          className={`nav__links ${isMenuOpen ? "nav__links--open" : ""}`}
          aria-label="Main"
        >
          <NavLink
            to="/Home"
            className={({ isActive }) =>
              "nav__link" + (isActive ? " is-active" : "")
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Menu
          </NavLink>
          <NavLink
            to="/Order"
            className={({ isActive }) =>
              "nav__link" + (isActive ? " is-active" : "")
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Orders
          </NavLink>
          <NavLink
            to="/Status"
            className={({ isActive }) =>
              "nav__link" + (isActive ? " is-active" : "")
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Status
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              "nav__link" + (isActive ? " is-active" : "")
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
}