import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import shinchanLogo from "../assets/shinchan.png";
import FoodLogin from "../assets/Food_Login.png";
import { useIsMobile } from "./useIsMobile";

const API_BASE = "http://localhost:3001";

export default function LoginPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [showModal, setShowModal] = useState(false);

    const isMobile = useIsMobile(768);

    useEffect(() => {
        if (err) setErr("");
    }, [user, password]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!user.trim() || !password.trim()) {
            setErr("กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน");
            return;
        }

        try {
            console.log("Calling:", `${API_BASE}/auth/login`); 
            
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.trim(), password: password.trim() }),
                credentials: "include",
            });

            const data = await res.json();
            console.log("Response:", data); 

            if (!res.ok) {
                setErr(data?.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
                return;
            }

            console.log("Login successful!"); 
            navigate("/admin/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            setErr("เกิดข้อผิดพลาดการเชื่อมต่อ Server โปรดรอสักครู่และลองอีกครั้ง");
        }
    };

    const foodImageStyle = useMemo(() => {
        if (isMobile) {
            return {
                width: "80%",
                height: "auto",
                maxWidth: 300,
                marginBottom: 24,
            };
        }
        return {
            width: 500,
            height: 500,
        };
    }, [isMobile]);

    const formContainerStyle = useMemo(() => {
        if (isMobile) {
            return {
                padding: "20px 20px",
                borderLeft: "none",
                borderTop: "2px solid #ececec",
                paddingTop: 30,
            };
        }
        return {
            padding: "40px 40px",
            borderLeft: "2px solid #ececec",
        };
    }, [isMobile]);

    const logoSize = isMobile ? 120 : 200;

    return (
        <div style={{
            minHeight: "100vh",
            background: "#eaf1ff",
            padding: 0,
            margin: 0,
            fontFamily: "Prompt, sans-serif",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
        }}>
            <div style={{
                width: "100%",
                background: "transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: isMobile ? "20px 0 10px" : "32px 0 10px",
            }}>
                <img
                    src={shinchanLogo}
                    alt="Crayon Shinchan"
                    style={{ width: logoSize, height: logoSize, objectFit: "contain" }}
                />
            </div>

            <div style={{
                maxWidth: isMobile ? "100%" : 1200,
                margin: isMobile ? "20px auto" : "40px auto",
                background: "#fff",
                borderRadius: isMobile ? 16 : 24,
                padding: isMobile ? "20px 0" : "30px 0",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                boxSizing: "border-box",
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...(isMobile ? {} : { flex: 1 }),
                }}>
                    <img
                        src={FoodLogin}
                        alt="Food"
                        style={foodImageStyle}
                    />
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    ...(isMobile ? {} : { flex: 1 }),
                    ...formContainerStyle,
                }}>
                    <form
                        onSubmit={handleLogin}
                        style={{ width: "100%", maxWidth: isMobile ? 320 : 380, marginBottom: 30 }}
                        noValidate
                    >
                        <div style={{ borderBottom: "4px solid #2196F3", width: isMobile ? 40 : 60, marginBottom: 8 }} />
                        <h2 style={{
                            fontWeight: 700,
                            fontSize: isMobile ? 24 : 32,
                            margin: 0,
                            textShadow: "2px 2px 0 #eee",
                            marginBottom: isMobile ? 16 : 24,
                            textAlign: "center",
                        }}>
                            Login as a Admin
                        </h2>

                        <label style={{ fontWeight: 500, fontSize: isMobile ? 16 : 18, marginTop: 16 }}>ชื่อผู้ใช้</label>
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
                                fontSize: isMobile ? 14 : 16,
                                marginTop: 6,
                                marginBottom: isMobile ? 16 : 22,
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                        />

                        <label style={{ fontWeight: 500, fontSize: isMobile ? 16 : 18, marginTop: 10 }}>รหัสผ่าน</label>
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
                                fontSize: isMobile ? 14 : 16,
                                marginTop: 6,
                                marginBottom: isMobile ? 10 : 10,
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                        />

                        {err && (
                            <div style={{ color: "#d32f2f", fontSize: isMobile ? 12 : 14, marginBottom: 10, textAlign: "center" }}>
                                {err}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!user.trim() || !password.trim()}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: isMobile ? "80%" : "60%",
                                margin: "12px auto 10px",
                                background: "#90caf9",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: isMobile ? 16 : 20,
                                padding: isMobile ? 10 : 12,
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

                        <div
                            onClick={() => setShowModal(true)}
                            style={{
                                color: "#9aa7b4",
                                textAlign: "center",
                                fontSize: isMobile ? 13 : 15,
                                marginTop: 8,
                                cursor: "pointer",
                                textDecoration: "underline",
                            }}
                        >
                            ลืมรหัสผ่าน?
                        </div>
                    </form>
                </div>
            </div>

            {showModal && (
                <>
                    <div
                        onClick={() => setShowModal(false)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.45)",
                            zIndex: 1000,
                        }}
                    />
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
                        <div style={{
                            width: 60, height: 60, margin: "0 auto 10px",
                            borderRadius: "50%",
                            border: "3px solid #5aa9ff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#5aa9ff", fontWeight: 800, fontSize: 28,
                        }}>
                            i
                        </div>

                        <h3 style={{ margin: "6px 0 6px", fontSize: isMobile ? 20 : 22, fontWeight: 800 }}>ลืมรหัสผ่าน</h3>
                        <p style={{ margin: "0 8px 18px", color: "#4b5563", fontSize: isMobile ? 14 : 16 }}>
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
                                fontSize: isMobile ? 14 : 16,
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