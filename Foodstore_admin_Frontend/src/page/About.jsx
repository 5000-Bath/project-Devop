import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useIsMobile } from "./useIsMobile";

const API_BASE = "";
const resolveImageUrl = (u) => {
    if (!u) return null;
    if (/^https?:\/\//i.test(u)) return u;
    if (u.startsWith("/")) return `${API_BASE}${u}`;
    return `${API_BASE}/${u}`;
};

export default function About() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [editData, setEditData] = useState({ description: "", price: 0, stock: 0 });
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/products`, {
                    headers: { Accept: "application/json" },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
                const data = await res.json();
                setMenuItems(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("ไม่สามารถโหลดสินค้าได้");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "ลบเมนูนี้?",
            text: "การลบเมนูจะไม่สามารถกู้คืนได้",
            showCancelButton: true,
            confirmButtonText: "ลบ",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_BASE}/api/products/${id}`, {
                    method: "DELETE",
                });
                if (!res.ok) throw new Error("Failed to delete product");
                Swal.fire({ icon: "success", title: "ลบเรียบร้อยแล้ว!" });
                setMenuItems(menuItems.filter((item) => item.id !== id));
                setSelectedItem(null);
            } catch (err) {
                console.error(err);
                Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: err.message });
            }
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/products/${selectedItem.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description: editData.description,
                    price: parseFloat(editData.price),
                    stock: parseInt(editData.stock),
                }),
            });

            if (!res.ok) throw new Error("Failed to update product");
            const updated = await res.json();

            setMenuItems((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p))
            );

            setSelectedItem(null);
            Swal.fire({ icon: "success", title: "อัปเดตข้อมูลสำเร็จ!" });
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: err.message });
        }
    };

    if (loading)
        return <div style={{ padding: 24, textAlign: "center" }}>กำลังโหลด...</div>;
    if (error)
        return (
            <div style={{ padding: 24, color: "red", textAlign: "center" }}>{error}</div>
        );

    return (
        <div
            style={{
                padding: isMobile ? 16 : 24,
                background: "#f7f7f7",
                minHeight: "100vh",
            }}
        >
            <h1
                style={{
                    fontSize: isMobile ? 20 : 24,
                    fontWeight: "bold",
                    marginBottom: isMobile ? 16 : 20,
                    color: "#333",
                }}
            >
                Menu
            </h1>

            {/* Search */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: isMobile ? 16 : 24,
                    backgroundColor: "white",
                    padding: isMobile ? "8px 12px" : "12px 16px",
                    borderRadius: 8,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: 6,
                        padding: isMobile ? "6px 12px" : "8px 12px",
                        fontSize: isMobile ? 14 : 16,
                        width: "100%",
                        outline: "none",
                    }}
                />
            </div>

            {/* Table */}
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: isMobile ? 12 : 16,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                        <th style={{ textAlign: "left", padding: "12px 8px" }}>Image</th>
                        <th style={{ textAlign: "left", padding: "12px 8px" }}>Name</th>
                        <th style={{ textAlign: "left", padding: "12px 8px" }}>ID</th>
                        <th style={{ textAlign: "left", padding: "12px 8px" }}>Description</th>
                        <th style={{ textAlign: "left", padding: "12px 8px" }}>Price</th>
                        <th style={{ textAlign: "left", padding: "12px 8px" }}>Stock</th>
                        <th style={{ textAlign: "left", padding: "12px 8px" }}>Info</th>
                    </tr>
                    </thead>
                    <tbody>
                    {menuItems
                        .filter(
                            (item) =>
                                item.name
                                    ?.toLowerCase()
                                    .includes(searchTerm.toLowerCase()) ||
                                item.description
                                    ?.toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                        )
                        .map((item) => (
                            <tr
                                key={item.id}
                                style={{
                                    borderBottom: "1px solid #f0f0f0",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    setSelectedItem(item);
                                    setEditData({
                                        description: item.description || "",
                                        price: item.price || 0,
                                        stock: item.stock || 0,
                                    });
                                }}
                            >
                                <td style={{ padding: "12px 8px" }}>
                                  <img
                                    src={resolveImageUrl(item.imageUrl) || "/khao-man-kai.jpg"}
                                    alt={item.name}
                                    style={{
                                      width: 50,
                                      height: 50,
                                      objectFit: "cover",
                                      borderRadius: 6,
                                    }}
                                    loading="lazy" // ✅ lazy load
                                    onError={(e) => {
                                      // ป้องกัน loop ถ้า fallback ก็ยัง error
                                      if (!e.target.dataset.fallback) {
                                        e.target.src = "/khao-man-kai.jpg";
                                        e.target.dataset.fallback = "true";
                                      }
                                    }}
                                  />
                                </td>


                                <td style={{ padding: "12px 8px", fontWeight: 500 }}>
                                    {item.name}
                                </td>
                                <td style={{ padding: "12px 8px" }}>{item.id}</td>
                                <td style={{ padding: "12px 8px" }}>{item.description}</td>
                                <td style={{ padding: "12px 8px" }}>{item.price} บาท</td>
                                <td style={{ padding: "12px 8px" }}>{item.stock}</td>
                                <td style={{ padding: "12px 8px" }}>
                                    <button
                                        style={{
                                            backgroundColor: "#e3f2fd",
                                            color: "#1976d2",
                                            border: "none",
                                            borderRadius: 20,
                                            padding: "4px 12px",
                                            fontSize: 12,
                                            cursor: "pointer",
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedItem(item);
                                            setEditData({
                                                description: item.description || "",
                                                price: item.price || 0,
                                                stock: item.stock || 0,
                                            });
                                        }}
                                    >
                                        More Info
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div
                    style={{
                        marginTop: 16,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <button
                        onClick={() => navigate("/admin/add-item")}
                        style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            padding: isMobile ? "10px 16px" : "8px 16px",
                            fontSize: isMobile ? 16 : 14,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        Add Item
                    </button>
                </div>
            </div>

            {/* Modal */}
            {selectedItem && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: 12,
                            padding: 24,
                            width: 400,
                            position: "relative",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedItem(null)}
                            style={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                background: "#d4d4d4",
                                border: "none",
                                borderRadius: "50%",
                                width: 28,
                                height: 28,
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            ×
                        </button>

                        <h3 style={{ marginBottom: 12 }}>{selectedItem.name}</h3>

                        <label style={{ display: "block", marginBottom: 6 }}>Description</label>
                        <textarea
                            value={editData.description}
                            onChange={(e) =>
                                setEditData((prev) => ({ ...prev, description: e.target.value }))
                            }
                            style={{
                                width: "100%",
                                border: "1px solid #ccc",
                                borderRadius: 6,
                                padding: 8,
                                marginBottom: 10,
                                resize: "none",
                            }}
                        />

                        <label style={{ display: "block", marginBottom: 6 }}>Price</label>
                        <input
                            type="number"
                            value={editData.price}
                            onChange={(e) =>
                                setEditData((prev) => ({ ...prev, price: e.target.value }))
                            }
                            style={{
                                width: "100%",
                                border: "1px solid #ccc",
                                borderRadius: 6,
                                padding: 8,
                                marginBottom: 10,
                            }}
                        />

                        <label style={{ display: "block", marginBottom: 6 }}>Stock</label>
                        <input
                            type="number"
                            value={editData.stock}
                            onChange={(e) =>
                                setEditData((prev) => ({ ...prev, stock: e.target.value }))
                            }
                            style={{
                                width: "100%",
                                border: "1px solid #ccc",
                                borderRadius: 6,
                                padding: 8,
                                marginBottom: 16,
                            }}
                        />

                        <div style={{ display: "flex", gap: 12 }}>
                            <button
                                onClick={() => handleDelete(selectedItem.id)}
                                style={{
                                    flex: 1,
                                    backgroundColor: "#f44336",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "10px 16px",
                                    fontSize: 16,
                                    cursor: "pointer",
                                }}
                            >
                                Delete
                            </button>
                            <button
                                onClick={handleUpdate}
                                style={{
                                    flex: 1,
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "10px 16px",
                                    fontSize: 16,
                                    cursor: "pointer",
                                }}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
