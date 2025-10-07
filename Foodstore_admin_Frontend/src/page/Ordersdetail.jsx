// import React, { useState } from "react";
//
// export default function Ordersdetail() {
//   const [searchTerm, setSearchTerm] = useState("");
//
//   // Mock data for orders
//   const orders = [
//     {
//       id: 1111,
//       menuName: "飛鶴海雞卵 (ไข่ไก่ทะเลเฟยเหอ)",
//       imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgZBypfo02O-IK4ysqPn3SunqA52JZNaXiXA&s",
//       dueDate: "24/8/2568 3:41",
//       price: 50,
//       status: "Complete"
//     },
//     {
//       id: 1112,
//       menuName: "紅油抄手 (เกี๊ยวน้ำมันแดง)",
//       imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQtOxpDDZaXvIz-mI-w__2W4ey4C_PhYe2zQ&s",
//       dueDate: "24/8/2568 3:41",
//       price: 100,
//       status: "Pending"
//     },
//     {
//       id: 1113,
//       menuName: "藍家割包 (หลานเจีย กัวเปา)",
//       imageUrl: "https://leafyeh.com/wp-content/uploads/flickr/45130313464_ef2fa0e346_b.jpg",
//       dueDate: "24/8/2568 3:41",
//       price: 100,
//       status: "Pending"
//     },
//     {
//       id: 1114,
//       menuName: "金酷餅餡餅 (พายเค้กโกลเด้นคูล)",
//       imageUrl: "https://lordcat.net/wp-content/uploads/2025/05/1746337926-f259a76deb0cd8cb6de087f3bbb60126.jpg",
//       dueDate: "24/8/2568 3:41",
//       price: 100,
//       status: "Pending"
//     },
//     {
//       id: 1115,
//       menuName: "窯烤食堂 (โรงอาหารอบเตาเผา)",
//       imageUrl: "https://images.ctee.com.tw/newsphoto/2024-08-29/1024/20240829701488.jpg",
//       dueDate: "24/8/2568 3:41",
//       price: 100,
//       status: "Pending"
//     }
//   ];
//
//   // Filter orders based on search term
//   const filteredOrders = orders.filter(order =>
//     order.menuName.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//
//   const handleStatusChange = (orderId, newStatus) => {
//     // In a real app, you would update the order status in your database
//     console.log(`Order ${orderId} status changed to ${newStatus}`);
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
//         <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>Orders</h1>
//
//         <div style={{
//           position: 'relative',
//           maxWidth: 250
//         }}>
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
//               <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>Menu</th>
//               <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>Due Date</th>
//               <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>Price</th>
//               <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>Status</th>
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
//                 <td style={{ padding: '12px 8px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
//                   <img
//                     src={order.imageUrl}
//                     alt={order.menuName}
//                     style={{
//                       width: 40,
//                       height: 40,
//                       borderRadius: 8,
//                       objectFit: 'cover'
//                     }}
//                   />
//                   <span style={{ fontWeight: 500, color: '#333' }}>{order.menuName}</span>
//                 </td>
//                 <td style={{ padding: '12px 8px', fontSize: 14, color: '#666' }}>{order.dueDate}</td>
//                 <td style={{ padding: '12px 8px', fontSize: 14, color: '#666' }}>{order.price}</td>
//                 <td style={{ padding: '12px 8px', fontSize: 14 }}>
//                   <button
//                     onClick={() => handleStatusChange(order.id, order.status === 'Complete' ? 'Pending' : 'Complete')}
//                     style={{
//                       backgroundColor: order.status === 'Complete' ? '#4CAF50' : '#FFA500',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: 12,
//                       padding: '4px 12px',
//                       fontSize: 12,
//                       cursor: 'pointer',
//                       transition: 'background-color 0.2s'
//                     }}
//                     onMouseEnter={(e) => {
//                       if (order.status === 'Complete') {
//                         e.currentTarget.style.backgroundColor = '#45a049';
//                       } else {
//                         e.currentTarget.style.backgroundColor = '#ff8c00';
//                       }
//                     }}
//                     onMouseLeave={(e) => {
//                       if (order.status === 'Complete') {
//                         e.currentTarget.style.backgroundColor = '#4CAF50';
//                       } else {
//                         e.currentTarget.style.backgroundColor = '#FFA500';
//                       }
//                     }}
//                   >
//                     {order.status}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//
//         {/* Order details */}
//         {orders.length > 0 && (
//           <div style={{
//             marginTop: 24,
//             padding: 24,
//             backgroundColor: '#f9f9f9',
//             borderRadius: 8,
//             border: '1px solid #eee'
//           }}>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <span style={{ color: '#666', fontSize: 14 }}>Date</span>
//                 <span style={{ color: '#333', fontSize: 14 }}>23/8/2568</span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <span style={{ color: '#666', fontSize: 14 }}>Order ID #</span>
//                 <span style={{ color: '#333', fontSize: 14 }}>1111</span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <span style={{ color: '#666', fontSize: 14 }}>Status</span>
//                 <span style={{ color: '#FFA500', fontSize: 14, fontWeight: 500 }}>Pending</span>
//               </div>
//               <div style={{ display: 'flex', gap: 12 }}>
//                 <button
//                   style={{
//                     backgroundColor: 'transparent',
//                     color: '#FF6B6B',
//                     border: '1px solid #FF6B6B',
//                     borderRadius: 6,
//                     padding: '6px 12px',
//                     fontSize: 14,
//                     cursor: 'pointer',
//                     transition: 'background-color 0.2s'
//                   }}
//                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffebee'}
//                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   style={{
//                     backgroundColor: '#4CAF50',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: 6,
//                     padding: '6px 12px',
//                     fontSize: 14,
//                     cursor: 'pointer',
//                     transition: 'background-color 0.2s'
//                   }}
//                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
//                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
//                 >
//                   Complete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

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

    // ✅ ฟังก์ชันอัปเดตสถานะ
    const updateOrderStatus = async (newStatus) => {
        try {
            const res = await fetch(`${API_BASE}/api/orders/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...order,
                    status: newStatus,
                }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const updated = await res.json();
            setOrder(updated);
            alert(`อัปเดตสถานะเป็น "${newStatus}" สำเร็จ`);
        } catch (err) {
            console.error("Error updating status:", err);
            alert("ไม่สามารถอัปเดตสถานะได้");
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
                            width: "100%",
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
                                        order.status === "COMPLETE"
                                            ? "#4CAF50"
                                            : order.status === "CANCEL"
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
                                onClick={() => updateOrderStatus("COMPLETE")}
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
                                onClick={() => updateOrderStatus("CANCEL")}
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