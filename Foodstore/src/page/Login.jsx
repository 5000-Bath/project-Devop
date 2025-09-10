import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import shinchanLogo from "../assets/shinchan.png";
import FoodLogin from "../assets/Food_Login.png";

// ---- Mock credentials ----
const MOCK = { user: "admin", password: "123456" };

export default function LoginPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");           // ข้อความ error ใต้ฟอร์ม
  const [showModal, setShowModal] = useState(false); // modal “ลืมรหัสผ่าน”

  // ปิด error เมื่อพิมพ์ใหม่
  useEffect(() => {
    if (err) setErr("");
  }, [user, password]);

  const handleLogin = (e) => {
    e.preventDefault();

    // 1) กันช่องว่าง
    if (!user.trim() || !password.trim()) {
      setErr("กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน");
      return;
    }

    // 2) ตรวจ Mock
    if (user.trim() !== MOCK.user || password.trim() !== MOCK.password) {
      setErr("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    // 3) ผ่าน -> ล็อกอิน
    localStorage.setItem("auth", "true");
    navigate("/home");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#eaf1ff",
      padding: 0,
      margin: 0,
      fontFamily: "Prompt, sans-serif",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{
        width: "100%",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 0 10px 0",
      }}>
        <img src={shinchanLogo} alt="Crayon Shinchan" style={{ width: 200, height: 200 }} />
      </div>

      {/* Card */}
      <div style={{
        maxWidth: 1200,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 24,
        padding: "30px 0",
        display: "flex",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      }}>
        {/* Left - Food Image */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 500,
        }}>
          <img src={FoodLogin} alt="Food" style={{ width: 500, height: 500 }} />
        </div>

        {/* Right - Form */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderLeft: "2px solid #ececec",
          padding: "40px 40px",
        }}>
          <form
            onSubmit={handleLogin}
            style={{ width: "100%", maxWidth: 380, marginBottom: 30 }}
            noValidate
          >
            <div style={{ borderBottom: "4px solid #2196F3", width: 60, marginBottom: 8 }} />
            <h2 style={{
              fontWeight: 700,
              fontSize: 32,
              margin: 0,
              textShadow: "2px 2px 0 #eee",
              marginBottom: 24,
            }}>
              Login as a Admin
            </h2>

            {/* user */}
            <label style={{ fontWeight: 500, fontSize: 18 }}>ชื่อผู้ใช้</label>
            <input
              type="text"
              placeholder="โปรดใส่ชื่อผู้ใช้ของท่าน"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                border: `2px solid ${err ? "#d32f2f" : "#888"}`,
                borderRadius: 12,
                fontSize: 16,
                marginTop: 6,
                marginBottom: 22,
                outline: "none",
              }}
            />

            {/* password */}
            <label style={{ fontWeight: 500, fontSize: 18 }}>รหัสผ่าน</label>
            <input
              type="password"
              placeholder="โปรดใส่รหัสผ่านของท่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                border: `2px solid ${err ? "#d32f2f" : "#888"}`,
                borderRadius: 12,
                fontSize: 16,
                marginTop: 6,
                marginBottom: 10,
                outline: "none",
              }}
            />

            {/* error text */}
            {err && (
              <div style={{ color: "#d32f2f", fontSize: 14, marginBottom: 10 }}>
                {err}
              </div>
            )}

            {/* login button */}
            <button
              type="submit"
              disabled={!user.trim() || !password.trim()} // กันคลิกตอนว่าง
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "60%",
                margin: "12px auto 10px",
                background: "#90caf9",
                color: "#fff",
                fontWeight: 600,
                fontSize: 20,
                padding: 12,
                border: "none",
                borderRadius: 10,
                boxShadow: "0 2px 8px #e3f2fd",
                cursor: (!user.trim() || !password.trim()) ? "not-allowed" : "pointer",
                opacity: (!user.trim() || !password.trim()) ? 0.6 : 1,
                textAlign: "center",
                transition: "opacity .15s ease",
              }}
            >
              เข้าสู่ระบบ
            </button>

            {/* Forgot Link -> open modal */}
            <div
              onClick={() => setShowModal(true)}
              style={{
                color: "#9aa7b4",
                textAlign: "center",
                fontSize: 15,
                marginTop: 8,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              For get your password?
            </div>
          </form>
        </div>
      </div>

      {/* ===== Modal: ลืมรหัสผ่าน ===== */}
      {showModal && (
        <>
          {/* overlay */}
          <div
            onClick={() => setShowModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 1000,
            }}
          />
          {/* dialog */}
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              width: "min(92vw, 480px)",
              borderRadius: 12,
              boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
              zIndex: 1001,
              padding: "22px 22px 16px",
              textAlign: "center",
            }}
          >
            {/* icon */}
            <div style={{
              width: 60, height: 60, margin: "0 auto 10px",
              borderRadius: "50%",
              border: "3px solid #5aa9ff",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#5aa9ff", fontWeight: 800, fontSize: 28,
            }}>
              i
            </div>

            <h3 style={{ margin: "6px 0 6px", fontSize: 22, fontWeight: 800 }}>ลืมรหัสผ่าน</h3>
            <p style={{ margin: "0 8px 18px", color: "#4b5563" }}>
              กรุณาติดต่อผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่าน
            </p>

            <button
              onClick={() => setShowModal(false)}
              autoFocus
              style={{
                padding: "10px 20px",
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                minWidth: 110,
                cursor: "pointer",
              }}
            >
              ตกลง
            </button>
          </div>
        </>
      )}
    </div>
  );
}
