// import React, { useState } from "react";
// import { useNavigate } from 'react-router-dom';
//
// export default function Orders() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();
//
//   // Mock data for orders
//   const orders = [
//     {
//       id: 1111,
//       date: "23/8/2568",
//       orderId: "1111",
//       dueDate: "24/8/2568",
//       total: 500,
//       status: "Pending"
//     },
//     {
//       id: 1112,
//       date: "22/8/2568",
//       orderId: "1112",
//       dueDate: "24/8/2568",
//       total: 500,
//       status: "Pending"
//     },
//     {
//       id: 1113,
//       date: "21/8/2568",
//       orderId: "1113",
//       dueDate: "24/8/2568",
//       total: 500,
//       status: "Pending"
//     },
//     {
//       id: 1114,
//       date: "20/8/2568",
//       orderId: "1114",
//       dueDate: "24/8/2568",
//       total: 500,
//       status: "Pending"
//     },
//     {
//       id: 1115,
//       date: "19/8/2568",
//       orderId: "1115",
//       dueDate: "24/8/2568",
//       total: 500,
//       status: "Pending"
//     },
//     {
//       id: 1116,
//       date: "18/8/2568",
//       orderId: "1116",
//       dueDate: "24/8/2568",
//       total: 500,
//       status: "Pending"
//     },
//     {
//       id: 1117,
//       date: "17/8/2568",
//       orderId: "1117",
//       dueDate: "24/8/2568",
//       total: 500,
//       status: "Pending"
//     },
//     {
//       id: 1118,
//       date: "16/8/2568",
//       orderId: "1118",
//       dueDate: "24/8/2568",
//       total: 500,
//       status: "Pending"
//     },
//     {
//       id: 1119,
//       date: "15/8/2568",
//       orderId: "1119",
//       dueDate: "24/8/2568",
//       total: 500,
//       status: "Pending"
//     }
//   ];
//
//   // Filter orders based on search term
//   const filteredOrders = orders.filter(order =>
//     order.orderId.toString().includes(searchTerm) ||
//     order.date.includes(searchTerm)
//   );
//
//   // Handle More Info click - navigate to detail page
//   const handleMoreInfoClick = (orderId) => {
//     // In a real app with React Router, you would use:
//     // navigate(`/admin/Orders-detail/${orderId}`);
//
//     // For now, we'll simulate navigation by changing the URL
//     // You should replace this with your actual routing logic
//     console.log(`Navigating to order detail page for order ${orderId}`);
//
//     // Simulate navigation
//     // This would be replaced with actual router navigation in a real app
//     window.location.href = `/admin/Orders-detail/${orderId}`;
//   };
//
//   return (
//     <div style={{ padding: 24, background: "#f7f7f7", borderRadius: 12 }}>
//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 24,
//         backgroundColor: 'white',
//         padding: '12px 16px',
//         borderRadius: 8,
//         boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//       }}>
//         <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>Order Status</h1>
//
//         <div style={{
//           position: 'relative',
//           maxWidth: 250
//         }}>
//
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{
//               paddingLeft: 35,
//               padding: '8px 12px',
//               border: '1px solid #ddd',
//               borderRadius: 6,
//               width: '70%',
//               fontSize: 14
//             }}
//           />
//         </div>
//       </div>
//
//       <div style={{
//         backgroundColor: 'white',
//         borderRadius: 8,
//         padding: 16,
//         boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//       }}>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr style={{ borderBottom: '1px solid #eee' }}>
//               <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>Date</th>
//               <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>Order ID</th>
//               <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>Due Date</th>
//               <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>Total</th>
//               <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>Status</th>
//               <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>Info</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredOrders.map((order) => (
//               <tr
//                 key={order.id}
//                 style={{
//                   borderBottom: '1px solid #f0f0f0',
//                   cursor: 'pointer',
//                   transition: 'background-color 0.2s'
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
//               >
//                 <td style={{ padding: '12px 8px', fontSize: 14, color: '#666' }}>{order.date}</td>
//                 <td style={{ padding: '12px 8px', fontSize: 14, color: '#333', fontWeight: 500 }}>{order.orderId}</td>
//                 <td style={{ padding: '12px 8px', fontSize: 14, color: '#666' }}>{order.dueDate}</td>
//                 <td style={{ padding: '12px 8px', fontSize: 14, color: '#666' }}>{order.total}</td>
//                 <td style={{ padding: '12px 8px', fontSize: 14, color: '#666' }}>{order.status}</td>
//                 <td style={{ padding: '12px 8px' }}>
//                   <button
//                     onClick={() => navigate('/admin/orders/orders-detail')}
//                     style={{
//                       backgroundColor: '#e3f2fd',
//                       color: '#1976d2',
//                       border: 'none',
//                       borderRadius: 20,
//                       padding: '4px 12px',
//                       fontSize: 12,
//                       cursor: 'pointer',
//                       transition: 'background-color 0.2s'
//                     }}
//                     onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#bbdefb'}
//                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e3f2fd'}
//                   >
//                     More Info
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_BASE = "";



export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // รายการสินค้าทั้งหมดในร้าน
    const [products, setProducts] = useState([]);

// โหลด product catalog ครั้งเดียว
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/products`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                // คาดว่า data เป็น array [{id,name,price,...}, ...]
                setProducts(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error("Load products failed", e);
                setProducts([]); // fallback
            }
        };
        fetchProducts();
    }, []);
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

    const [selectedMonth, setSelectedMonth] = useState("");

    const handleDownloadReport = () => {
        if (!selectedMonth) {
            Swal.fire({
                icon: "warning",
                title: "Select month first",
                text: "Please select a month before downloading the report.",
            });
            return;
        }

        // ต้องมี product catalog เพื่อทำรายงานครบทุกสินค้า
        if (!products || products.length === 0) {
            Swal.fire({
                icon: "info",
                title: "No product catalog",
                text: "Cannot load product list. Please check /api/products endpoint.",
            });
            return;
        }

        // Helper
        const getMonthStr = (date) => {
            const d = new Date(date);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        };

        const [year, month] = selectedMonth.split("-").map(Number);
        const prevMonth =
            month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, "0")}`;

        // เฉพาะ SUCCESS (Complete)
        const currentOrders = orders.filter(
            (o) => o.status?.toUpperCase() === "SUCCESS" && getMonthStr(o.createdAt) === selectedMonth
        );
        const prevOrders = orders.filter(
            (o) => o.status?.toUpperCase() === "SUCCESS" && getMonthStr(o.createdAt) === prevMonth
        );

        if (currentOrders.length === 0 && prevOrders.length === 0) {
            Swal.fire({
                icon: "info",
                title: "No data",
                text: "No completed orders in this or the previous month.",
            });
            return;
        }

        // รวมยอดขายต่อสินค้า
        const summarizeProducts = (orderList) => {
            const summary = {};
            orderList.forEach((o) => {
                o.orderItems?.forEach((it) => {
                    const name = it.product?.name || "Unknown";
                    const qty = Number(it.quantity) || 0;
                    const total = (it.product?.price || 0) * qty;
                    if (!summary[name]) summary[name] = { qty, total };
                    else {
                        summary[name].qty += qty;
                        summary[name].total += total;
                    }
                });
            });
            return summary;
        };

        const currentSummary = summarizeProducts(currentOrders);
        const prevSummary = summarizeProducts(prevOrders);

        // ✅ ใช้ “product catalog ทั้งหมด” เป็น master list
        const catalogNames = products.map((p) => p.name); // [ "latte", "brownie", ... ]

        // เทียบสองเดือนสำหรับ “ทุกรายการสินค้าในร้าน”
        const compareProducts = {};
        catalogNames.forEach((name) => {
            const currQty = currentSummary[name]?.qty || 0;
            const prevQty = prevSummary[name]?.qty || 0;
            const currTotal = currentSummary[name]?.total || 0;
            const prevTotal = prevSummary[name]?.total || 0;

            const change =
                prevTotal === 0 && currTotal === 0
                    ? 0
                    : prevTotal === 0
                        ? 100
                        : ((currTotal - prevTotal) / prevTotal) * 100;

            compareProducts[name] = {
                qty: currQty,
                total: currTotal,
                prevQty,
                prevTotal,
                change,
            };
        });

        // ยอดรวมทั้งเดือน
        const currentTotal = Object.values(compareProducts).reduce((s, v) => s + v.total, 0);
        const prevTotal = Object.values(compareProducts).reduce((s, v) => s + v.prevTotal, 0);
        const totalChange = prevTotal === 0 ? 100 : ((currentTotal - prevTotal) / prevTotal) * 100;
        const trend = totalChange >= 0 ? "Uptrend / Expansion" : "Downtrend / Contraction";

        // ---------- PDF ----------
        const doc = new jsPDF({ unit: "pt", format: "a4" });
        doc.setFontSize(16);
        doc.text(`Monthly Sales Report (${selectedMonth})`, 40, 40);

        doc.setFontSize(12);
        const changeText = (totalChange >= 0 ? "+" : "") + totalChange.toFixed(2) + "%";
        doc.setTextColor(totalChange >= 0 ? 46 : 198, totalChange >= 0 ? 125 : 40, totalChange >= 0 ? 50 : 40);
        doc.text(`Overall Trend: ${trend} (${changeText})`, 40, 60);
        doc.setTextColor(0, 0, 0);

        // ตาราง: ครบทุกสินค้าในร้าน
        const tableData = catalogNames.map((name, i) => {
            const d = compareProducts[name];
            return [
                i + 1,
                name,
                d.qty.toLocaleString(),
                d.total.toLocaleString("en-US", { minimumFractionDigits: 2 }),
                d.prevQty.toLocaleString(),
                d.prevTotal.toLocaleString("en-US", { minimumFractionDigits: 2 }),
                (d.change >= 0 ? "+" : "") + d.change.toFixed(2) + "%",
            ];
        });

        autoTable(doc, {
            startY: 80,
            head: [
                [
                    "#",
                    "Product",
                    "Qty (This Month)",
                    "Revenue (This Month)",
                    "Qty (Prev Month)",
                    "Revenue (Prev Month)",
                    "Change (%)",
                ],
            ],
            body: tableData,
            theme: "grid",
            headStyles: { fillColor: [25, 118, 210], textColor: 255, halign: "center" },
            styles: { fontSize: 7 },
            columnStyles: {
                0: { halign: "center", cellWidth: 25 },
                1: { halign: "left", cellWidth: 140 },
                2: { halign: "center", cellWidth: 70 },
                3: { halign: "right", cellWidth: 90 },
                4: { halign: "center", cellWidth: 70 },
                5: { halign: "right", cellWidth: 90 },
                6: { halign: "right", cellWidth: 60 },
            },
            margin: { left: 40, right: 40 },
        });

        const totalY = doc.lastAutoTable.finalY + 25;
        doc.setFontSize(11);
        doc.text(
            `Total Revenue (${selectedMonth}): ${currentTotal.toLocaleString("en-US", {
                minimumFractionDigits: 2,
            })} THB`,
            40,
            totalY
        );
        doc.text(
            `Previous Month (${prevMonth}): ${prevTotal.toLocaleString("en-US", {
                minimumFractionDigits: 2,
            })} THB`,
            40,
            totalY + 16
        );

        doc.save(`Sales_Report_${selectedMonth}.pdf`);
    };




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

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* เลือกเดือน */}
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        style={{
                            padding: '8px 10px',
                            border: '1px solid #ddd',
                            borderRadius: 6,
                            fontSize: 14,
                        }}
                    />

                    {/* ปุ่มดาวน์โหลดรายงาน */}
                    <button
                        onClick={handleDownloadReport}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            padding: '8px 14px',
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: 500,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#43a047'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                    >
                        📊 Download Report
                    </button>

                    {/* ช่องค้นหาเดิม */}
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: 6,
                            width: 180,
                            fontSize: 14
                        }}
                    />
                </div>

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
                                <td style={{ padding: '12px 8px' }}>{formatDate(order.createdAt)}</td>

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
