import React, { useContext, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Login.css";
import shinchanLogo from "../assets/shinchan.png";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const loc = useLocation();
  const redirect = new URLSearchParams(loc.search).get("redirect") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!username.trim() || !password.trim()) {
      setErr("กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบ");
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password.trim());
      nav(redirect, { replace: true });
    } catch (e2) {
      setErr(e2?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-logo">
        <img src={shinchanLogo} alt="Crayon Shinchan" />
        <div className="brand">CRAYON<br/>SHINCHAN</div>
      </div>

      <div className="auth-card">
        <div className="auth-rule" />
        <h2 className="auth-title">Login to your account</h2>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label className="auth-label">ชื่อผู้ใช้</label>
          <input
            className={`auth-input ${err ? "has-error" : ""}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="โปรดใส่ชื่อผู้ใช้ของท่าน"
            autoComplete="username"
          />

          <label className="auth-label">รหัสผ่าน</label>
          <input
            className={`auth-input ${err ? "has-error" : ""}`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="โปรดใส่รหัสผ่านของท่าน"
            autoComplete="current-password"
          />

          {err && <div className="auth-error">{err}</div>}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading || !username.trim() || !password.trim()}
          >
            {loading ? "Signing in..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="auth-links">
          <span>ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link></span>
          <button className="link-ghost" type="button" onClick={() => alert("กรุณาติดต่อผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่าน")}>
            ลืมรหัสผ่าน?
          </button>
        </div>
      </div>
    </div>
  );
}
