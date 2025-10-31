import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import Swal

const API_BASE = "";

export default function Ordersdetail() {
    const { id } = useParams(); // ✅ รับ order id จาก URL
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ โหลดข้อมูลจาก backend
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/orders/${id}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setOrder(data);
            } catch (err) {
                console.error("Error fetching order:", err);
                setError("ไม่สามารถโหลดข้อมูลคำสั่งซื้อนี้ได้");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    // ✅ ฟังก์ชันอัปเดตสถานะ (แก้ path และ body ให้ตรงกับ backend)
    const updateOrderStatus = async (newStatus) => {
        if (!order) return;

        // ----------------------------------------------------------------------
        // ❌ ส่วนที่ถูกลบออก: การตรวจสอบสต็อกสินค้า (ตามคำขอ)
        // ----------------------------------------------------------------------
        /*
        if (newStatus === "SUCCESS") {
            const insufficient = order.orderItems.find(
                (item) => item.quantity > item.product.stock
            );
            if (insufficient) {
                Swal.fire({
                    icon: 'warning',
                    title: 'สินค้าในสต็อกไม่เพียงพอ',
                    text: `Stock สำหรับ "${insufficient.product.name}" มีไม่พอ`,
                    confirmButtonText: 'ตกลง'
                });
                return; 
            }
        }
        */
        // ----------------------------------------------------------------------

        try {
            // 1. ✅ SweetAlert2 Confirmation ก่อนส่ง request
            const result = await Swal.fire({
                title: `ยืนยันการเปลี่ยนสถานะเป็น **${newStatus}**?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
                reverseButtons: true
            });

            if (!result.isConfirmed) {
                return; // ❌ ยกเลิกการอัปเดต
            }

            const res = await fetch(`${API_BASE}/api/orders/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                const errMsg = await res.text();
                Swal.fire({
                    icon: 'error',
                    title: 'อัปเดตสถานะไม่สำเร็จ',
                    text: errMsg || `ไม่สามารถอัปเดตสถานะได้ (HTTP ${res.status})`,
                });
                throw new Error(`HTTP ${res.status}`);
            }

            const updated = await res.json();
            setOrder(updated);

            // 2. ✅ SweetAlert2 Success
            Swal.fire({
                icon: 'success',
                title: 'อัปเดตสำเร็จ',
                text: `คำสั่งซื้อ #${order.id} ได้รับการอัปเดตเป็น "${newStatus}" เรียบร้อยแล้ว`,
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error("Error updating status:", err);
            // แสดง SweetAlert2 สำหรับ Network Error หรือ Error ที่ไม่ได้มาจาก HTTP response (res.ok)
            if (err.message.indexOf("HTTP") === -1) {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถติดต่อเซิร์ฟเวอร์เพื่ออัปเดตสถานะได้',
                });
            }
        }
    };

    if (loading) return <div style={{ padding: 24 }}>⏳ กำลังโหลดข้อมูล...</div>;
    if (error) return <div style={{ padding: 24, color: "red" }}>{error}</div>;
    if (!order) return <div style={{ padding: 24 }}>ไม่พบข้อมูลคำสั่งซื้อ</div>;

    const filteredItems =
        order.orderItems?.filter((item) =>
            item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

    const totalPrice = filteredItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <div style={{ padding: 24, background: "#f7f7f7", borderRadius: 12 }}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                    backgroundColor: "white",
                    padding: "12px 16px",
                    borderRadius: 8,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#333" }}>
                    Order #{order.id}
                </h1>

                <div style={{ position: "relative", maxWidth: 250 }}>
                    <input
                        type="text"
                        placeholder="Search product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            paddingLeft: 35,
                            padding: "8px 12px",
                            border: "1px solid #ddd",
                            borderRadius: 6,
                            width: "70%",
                            fontSize: 14,
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 16,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee" }}>
                            <th style={{ textAlign: "left", padding: "12px 8px" }}>Product</th>
                            <th style={{ textAlign: "left", padding: "12px 8px" }}>Quantity</th>
                            <th style={{ textAlign: "left", padding: "12px 8px" }}>Price</th>
                            <th style={{ textAlign: "left", padding: "12px 8px" }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <tr
                                    key={item.id}
                                    style={{
                                        borderBottom: "1px solid #f0f0f0",
                                        cursor: "pointer",
                                        transition: "background-color 0.2s",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor = "#f8f9fa")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor = "white")
                                    }
                                >
                                    <td style={{ padding: "12px 8px", fontSize: 14 }}>
                                        {item.product?.name || "-"}
                                    </td>
                                    <td style={{ padding: "12px 8px", fontSize: 14 }}>
                                        {item.quantity}
                                    </td>
                                    <td style={{ padding: "12px 8px", fontSize: 14 }}>
                                        {item.product?.price?.toLocaleString()} บาท
                                    </td>
                                    <td style={{ padding: "12px 8px", fontSize: 14 }}>
                                        {(item.product?.price * item.quantity).toLocaleString()} บาท
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center", padding: 16 }}>
                                    ไม่มีสินค้าในคำสั่งซื้อนี้
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Order Summary */}
                <div
                    style={{
                        marginTop: 24,
                        padding: 24,
                        backgroundColor: "#f9f9f9",
                        borderRadius: 8,
                        border: "1px solid #eee",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666", fontSize: 14 }}>User ID</span>
                            <span style={{ color: "#333", fontSize: 14 }}>
                                {order.userId}
                            </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666", fontSize: 14 }}>Created At</span>
                            <span style={{ color: "#333", fontSize: 14 }}>
                                {order.createdAt
                                    ? new Date(order.createdAt).toLocaleString("th-TH", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })
                                    : "-"}
                            </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666", fontSize: 14 }}>Status</span>
                            <span
                                style={{
                                    color:
                                        order.status === "SUCCESS"
                                            ? "#4CAF50"
                                            : order.status === "CANCELLED"
                                                ? "#FF6B6B"
                                                : "#FFA500",
                                    fontSize: 14,
                                    fontWeight: 500,
                                }}
                            >
                                {order.status || "PENDING"}
                            </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666", fontSize: 14 }}>Total</span>
                            <span style={{ color: "#333", fontSize: 14, fontWeight: 500 }}>
                                {totalPrice.toLocaleString()} บาท
                            </span>
                        </div>

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                            <button
                                onClick={() => navigate("/admin/orders")}
                                style={{
                                    backgroundColor: "transparent",
                                    color: "#1976d2",
                                    border: "1px solid #1976d2",
                                    borderRadius: 6,
                                    padding: "6px 12px",
                                    fontSize: 14,
                                    cursor: "pointer",
                                    transition: "background-color 0.2s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#e3f2fd")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = "transparent")
                                }
                            >
                                ← Back
                            </button>

                            <button
                                onClick={() => updateOrderStatus("SUCCESS")} // ✅ ใช้ enum ตรงกับ backend
                                style={{
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "6px 12px",
                                    fontSize: 14,
                                    cursor: "pointer",
                                    transition: "background-color 0.2s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#45a049")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#4CAF50")
                                }
                            >
                                Complete
                            </button>

                            <button
                                onClick={() => updateOrderStatus("CANCELLED")} // ✅ ใช้ enum ตรงกับ backend
                                style={{
                                    backgroundColor: "#FF6B6B",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "6px 12px",
                                    fontSize: 14,
                                    cursor: "pointer",
                                    transition: "background-color 0.2s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#e53935")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#FF6B6B")
                                }
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
