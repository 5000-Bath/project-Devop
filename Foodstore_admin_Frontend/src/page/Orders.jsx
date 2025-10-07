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

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

                                {/* ✅ Status */}
                                <td style={{ padding: '12px 8px' }}>{order.status || 'PENDING'}</td>

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

