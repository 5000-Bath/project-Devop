import React, { useEffect, useState } from "react";
import { Edit2, Save, X, Mail, Lock, User, Calendar } from "lucide-react";
import Swal from "sweetalert2";

const API_BASE = "";

function Button({ children, onClick, variant = "primary", disabled = false, ...rest }) {
    const baseStyle = {
        padding: "10px 16px",
        borderRadius: "8px",
        border: "none",
        fontWeight: "500",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        justifyContent: "center",
        fontSize: "14px",
        opacity: disabled ? 0.5 : 1,
    };
    const variants = {
        primary: {
            background: "linear-gradient(135deg, #22c55e 0%, #059669 100%)",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
        },
        ghost: {
            background: "#f3f4f6",
            color: "#374151",
            border: "1px solid #d1d5db",
        },
        danger: {
            background: "#ef4444",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
        },
    };
    const style = { ...baseStyle, ...(variants[variant] || variants.primary) };
    const handleMouseOver = (e) => {
        if (!disabled) {
            e.currentTarget.style.boxShadow =
                variant === "ghost" ? "0 2px 8px rgba(0,0,0,0.1)" : "0 6px 20px rgba(34, 197, 94, 0.4)";
            e.currentTarget.style.transform = "translateY(-2px)";
        }
    };
    const handleMouseOut = (e) => {
        if (!disabled) {
            e.currentTarget.style.boxShadow =
                variant === "ghost" ? "none" : "0 4px 15px rgba(34, 197, 94, 0.3)";
            e.currentTarget.style.transform = "translateY(0)";
        }
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={style}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            {...rest}
        >
            {children}
        </button>
    );
}

function Field({ label, error, children }) {
    return (
        <div style={{ marginBottom: "24px" }}>
            <label
                style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                }}
            >
                {label}
            </label>
            {children}
            {error && <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}>{error}</p>}
        </div>
    );
}

function Modal({ title, open, onClose, children, footer }) {
    if (!open) return null;
    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
                padding: "16px",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#fff",
                    borderRadius: "16px",
                    boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
                    maxWidth: "428px",
                    width: "100%",
                    padding: "24px",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#111827", margin: 0 }}>{title}</h3>
                    <button
                        onClick={onClose}
                        style={{
                            border: "none",
                            background: "transparent",
                            fontSize: "24px",
                            color: "#9ca3af",
                            cursor: "pointer",
                            width: "32px",
                            height: "32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "color 0.2s",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.color = "#6b7280")}
                        onMouseOut={(e) => (e.currentTarget.style.color = "#9ca3af")}
                    >
                        ×
                    </button>
                </div>
                <div>{children}</div>
                {footer && <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>{footer}</div>}
            </div>
        </div>
    );
}

export default function Setting() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [admin, setAdmin] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ fullName: "", email: "", password: "" });
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const loadAdminData = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/admins/me`, { credentials: "include" });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setAdmin(data);
                setForm({ fullName: data.username || "", email: data.email || "", password: "" });
            } catch (err) {
                console.error(err);
                Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: "โหลดข้อมูลผู้ใช้ไม่สำเร็จ" });
            } finally {
                setLoading(false);
            }
        };
        loadAdminData();
    }, []);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.fullName.trim()) newErrors.fullName = "กรุณากรอกชื่อจริง";
        if (!form.email.trim()) newErrors.email = "กรุณากรอกอีเมล";
        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const save = async () => {
        if (!validateForm()) return;
        if (!admin?.id) {
            Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: "ไม่พบรหัสผู้ใช้" });
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/admins/${admin.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username: form.fullName, email: form.email, password: form.password || undefined }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || `HTTP ${res.status}`);
            }
            const updated = await res.json();
            setAdmin(updated);
            setForm({ fullName: updated.username, email: updated.email, password: "" });
            setEditMode(false);
            setErrors({});
            Swal.fire({ icon: "success", title: "บันทึกสำเร็จ", text: "ข้อมูลผู้ใช้ถูกอัปเดตเรียบร้อยแล้ว", timer: 2000, showConfirmButton: false });
        } catch (e) {
            console.error(e);
            Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: e.message || "ไม่สามารถบันทึกข้อมูลได้" });
        } finally {
            setSaving(false);
        }
    };

    const confirmAddEmail = () => {
        const email = newEmail.trim();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setErrors({ email: "รูปแบบอีเมลไม่ถูกต้อง" });
            Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: "รูปแบบอีเมลไม่ถูกต้อง" });
            return;
        }
        Swal.fire({
            title: "ยืนยันการเพิ่มอีเมลใหม่",
            text: `คุณต้องการเปลี่ยนอีเมลเป็น ${email} ใช่หรือไม่?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "ใช่",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                setForm((f) => ({ ...f, email }));
                setNewEmail("");
                setEmailModalOpen(false);
                setErrors({});
                Swal.fire({ icon: "success", title: "เพิ่มอีเมลสำเร็จ", timer: 1500, showConfirmButton: false });
            }
        });
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: "48px", height: "48px", border: "4px solid #e5e7eb", borderTop: "4px solid #22c55e", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <p style={{ color: "#4b5563", fontWeight: "500" }}>กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    const displayName = admin?.username || "Admin";
    const today = new Date().toLocaleDateString("th-TH", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f9fafb 0%, #f0f9ff 100%)", padding: "16px" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.07)", padding: "32px", marginBottom: "32px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <h1 style={{ fontSize: "32px", fontWeight: "bold", background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
                            ยินดีต้อนรับ {displayName}
                        </h1>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "14px" }}>
                            <Calendar size={16} />
                            <span>{today}</span>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.07)", padding: "32px" }}>
                    {/* Top Section */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid #f3f4f6" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #22c55e 0%, #059669 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <User size={32} color="#fff" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" }}>{displayName}</h2>
                                <p style={{ color: "#6b7280", fontSize: "14px", margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Mail size={16} />
                                    {form.email}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            {!editMode ? (
                                <Button onClick={() => setEditMode(true)}>
                                    <Edit2 size={16} />
                                    แก้ไข
                                </Button>
                            ) : (
                                <>
                                    <Button onClick={save} disabled={saving}>
                                        <Save size={16} />
                                        {saving ? "กำลังบันทึก..." : "บันทึก"}
                                    </Button>
                                    <Button onClick={() => setEditMode(false)} variant="ghost">
                                        <X size={16} />
                                        ยกเลิก
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Form Section */}
                    {!editMode ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                            <div>
                                <Field label="ชื่อจริง">
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                                        <User size={20} color="#9ca3af" />
                                        <input disabled value={displayName} style={{ background: "transparent", color: "#6b7280", width: "100%", outline: "none", border: "none", fontSize: "14px" }} />
                                    </div>
                                </Field>
                            </div>
                            <div>
                                <Field label="อีเมล">
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                                        <Mail size={20} color="#9ca3af" />
                                        <input disabled value={form.email} style={{ background: "transparent", color: "#6b7280", width: "100%", outline: "none", border: "none", fontSize: "14px" }} />
                                    </div>
                                </Field>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {editMode && (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginTop: "24px" }}>
    <Field label="ชื่อจริง" error={errors.fullName}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
        <User size={20} color="#9ca3af" />
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={onChange}
          style={{ background: "transparent", width: "100%", outline: "none", border: "none", fontSize: "14px", color: "#111827" }}
        />
      </div>
    </Field>

    <Field label="อีเมล" error={errors.email}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
        <Mail size={20} color="#9ca3af" />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          style={{ background: "transparent", width: "100%", outline: "none", border: "none", fontSize: "14px", color: "#111827" }}
        />
      </div>
    </Field>

    <Field label="รหัสผ่าน (ไม่บังคับ)">
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
        <Lock size={20} color="#9ca3af" />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="••••••••"
          style={{ background: "transparent", width: "100%", outline: "none", border: "none", fontSize: "14px", color: "#111827" }}
        />
      </div>
    </Field>
  </div>
)}

                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <Modal
                title="เพิ่มอีเมลใหม่"
                open={emailModalOpen}
                onClose={() => {
                    setEmailModalOpen(false);
                    setErrors({});
                }}
                footer={
                    <>
                        <Button onClick={() => setEmailModalOpen(false)} variant="ghost">
                            ยกเลิก
                        </Button>
                        <Button onClick={confirmAddEmail}>เพิ่ม</Button>
                    </>
                }
            >
                <Field label="ที่อยู่อีเมล" error={errors.email}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", border: "2px solid #e5e7eb", borderRadius: "8px", transition: "all 0.2s" }}>
                        <Mail size={20} color="#9ca3af" />
                        <input
                            autoFocus
                            type="email"
                            value={newEmail}
                            onChange={(e) => {
                                setNewEmail(e.target.value);
                                if (errors.email) setErrors({});
                            }}
                            placeholder="you@example.com"
                            style={{ background: "transparent", width: "100%", outline: "none", border: "none", fontSize: "14px", color: "#111827" }}
                            onFocus={(e) => { e.currentTarget.parentElement.style.borderColor = "#22c55e"; }}
                            onBlur={(e) => { e.currentTarget.parentElement.style.borderColor = "#e5e7eb"; }}
                        />
                    </div>
                </Field>
            </Modal>
        </div>
    );
}
