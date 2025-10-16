
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

//  Format date/time to Thai style (with +7h & Buddhist year)
function formatThaiDateTime(dateStr) {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    // ➕ Add 7 hours for Thailand timezone
    const local = new Date(date.getTime() + 7 * 60 * 60 * 1000);

    const day = String(local.getDate()).padStart(2, "0");
    const month = String(local.getMonth() + 1).padStart(2, "0");
    const yearBE = local.getFullYear() + 543;

    const hour = String(local.getHours()).padStart(2, "0");
    const minute = String(local.getMinutes()).padStart(2, "0");
    const second = String(local.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${yearBE} ${hour}:${minute}:${second}`;
}

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 🛑 ฟังก์ชันใหม่: กำหนด Style ตามสถานะ
    const getStatusStyle = (status) => {
        const statusKey = (status || 'PENDING').toUpperCase();
        switch (statusKey) {
            case 'PENDING':
                return { backgroundColor: '#fffbe5', color: '#ffc107', fontWeight: 'bold', padding: '4px 8px', borderRadius: 4 }; // เหลืองอ่อน
            case 'SUCCESS':
                return { backgroundColor: '#e8f5e9', color: '#4caf50', fontWeight: 'bold', padding: '4px 8px', borderRadius: 4 }; // เขียวอ่อน
            case 'CANCELLED':
                return { backgroundColor: '#ffebee', color: '#f44336', fontWeight: 'bold', padding: '4px 8px', borderRadius: 4 }; // แดงอ่อน
            default:
                return {};
        }
    };

    // ✅ โหลดข้อมูลจาก backend
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/orders`, {
                    headers: { Accept: "application/json" },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // ✅ ค้นหา (ตาม id หรือ status)
    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchTerm) ||
        (order.status && order.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // ✅ format วันที่
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleString("th-TH", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    if (loading) return <div style={{ padding: 24, textAlign: 'center' }}>⏳ กำลังโหลดข้อมูล...</div>;
    if (error) return <div style={{ padding: 24, color: "red", textAlign: 'center' }}>{error}</div>;

    return (
        <div style={{ padding: 24, background: "#f7f7f7", borderRadius: 12 }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                backgroundColor: 'white',
                padding: '12px 16px',
                borderRadius: 8,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>Order Status</h1>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: 6,
                        width: 250,
                        fontSize: 14
                    }}
                />
            </div>

            {/* Table */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 16,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Order ID</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>User ID</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Status</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Created At</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Info</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <tr key={order.id}
                                style={{
                                    borderBottom: '1px solid #f0f0f0',
                                    transition: 'background 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                            >
                                {/* ✅ Order ID */}
                                <td style={{ padding: '12px 8px', fontWeight: 500 }}>{order.id}</td>

                                {/* ✅ User ID */}
                                <td style={{ padding: '12px 8px' }}>{order.userId ?? '-'}</td>

                                {/* 🛑 Status ที่ถูกแก้ไขให้มีสี */}
                                <td style={{ padding: '12px 8px' }}>
                                    <span style={getStatusStyle(order.status)}>
                                        {order.status || 'PENDING'}
                                    </span>
                                </td>

                                {/* ✅ CreatedAt */}
                                <td style={{ padding: '12px 8px' }}>{formatThaiDateTime(order.createdAt)}</td>

                                {/* ✅ More Info */}
                                <td style={{ padding: '12px 8px' }}>
                                    <button
                                        onClick={() => navigate(`/admin/orders/orders-detail/${order.id}`)}
                                        style={{
                                            backgroundColor: '#e3f2fd',
                                            color: '#1976d2',
                                            border: 'none',
                                            borderRadius: 20,
                                            padding: '4px 12px',
                                            fontSize: 12,
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#bbdefb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e3f2fd'}
                                    >
                                        More Info
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: 16, color: '#777' }}>
                                ไม่มีข้อมูลคำสั่งซื้อ
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}