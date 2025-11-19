import { useState, useContext, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/shinchan.png";
import { AuthContext } from "../context/AuthContext";

export default function Navbar({ brand = "Crayon Shinchan" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthed, user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const userMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    nav("/");
  };

  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__brand">
          <img className="nav__logo" src={logo} alt="Brand logo shinchan" />
          <h1 className="nav__title">
            Welcome to, <span>{brand}</span>
          </h1>
        </div>

        <button
          className="nav__hamburger"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

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
            to="/History"
            className={({ isActive }) =>
              "nav__link" + (isActive ? " is-active" : "")
            }
            onClick={() => setIsMenuOpen(false)}
          >
            History
          </NavLink>

          <NavLink
            to="/Contact"
            className={({ isActive }) =>
              "nav__link" + (isActive ? " is-active" : "")
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </NavLink>

          {!isAuthed ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                "nav__link" + (isActive ? " is-active" : "")
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </NavLink>
          ) : (
            <div className="nav__user-menu" ref={userMenuRef}>
              <button
                className="nav__user-button"
                onClick={toggleUserMenu}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <span className="nav__user-icon">👤</span>
                <span className="nav__user-name">{user?.username || "User"}</span>
                <span className={`nav__user-arrow ${isUserMenuOpen ? "nav__user-arrow--open" : ""}`}>
                  ▼
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="nav__dropdown">
                  <div className="nav__dropdown-header">
                    <div className="nav__dropdown-avatar">👤</div>
                    <div className="nav__dropdown-info">
                      <div className="nav__dropdown-name">{user?.username || "User"}</div>
                      <div className="nav__dropdown-email">{user?.email || "user@example.com"}</div>
                    </div>
                  </div>

                  <div className="nav__dropdown-divider"></div>

                  {/* <button
                    className="nav__dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      nav("/profile");
                    }}
                  >
                    <span className="nav__dropdown-icon">👤</span>
                    <span>Profile</span>
                  </button> */}

                  {/* <button
                    className="nav__dropdown-item"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      nav("/settings");
                    }}
                  >
                    <span className="nav__dropdown-icon">⚙️</span>
                    <span>Settings</span>
                  </button> */}

                  <div className="nav__dropdown-divider"></div>

                  <button
                    className="nav__dropdown-item nav__dropdown-item--danger"
                    onClick={handleLogout}
                  >
                    <span className="nav__dropdown-icon">🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}