// import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
//
// export default function About() {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [menuItems, setMenuItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//
//     const navigate = useNavigate();
//
//     // ✅ โหลดสินค้า
//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const res = await fetch("http://localhost:8080/products");
//                 if (!res.ok) throw new Error("Failed to fetch products");
//                 const data = await res.json();
//                 setMenuItems(data);
//             } catch (err) {
//                 console.error("Error fetching products:", err);
//                 setError("ไม่สามารถโหลดสินค้าได้");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProducts();
//     }, []);
//
//     const filteredItems = menuItems.filter(item =>
//         (item.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (item.description?.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//
//     if (loading) return <div style={{ padding: 24 }}>⏳ กำลังโหลด...</div>;
//     if (error) return <div style={{ padding: 24, color: "red" }}>{error}</div>;
//
//     return (
//         <div style={{ padding: 24, background: "#f7f7f7", borderRadius: 12 }}>
//             <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>Menu</h1>
//
//             {/* Search */}
//             <div style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 marginBottom: 24,
//                 backgroundColor: 'white',
//                 padding: '12px 16px',
//                 borderRadius: 8,
//                 boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//             }}>
//                 <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
//                     <input
//                         type="text"
//                         placeholder="Search..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         style={{
//                             paddingLeft: 35,
//                             padding: '8px 12px',
//                             border: '1px solid #ddd',
//                             borderRadius: 6,
//                             width: '100%',
//                             fontSize: 14
//                         }}
//                     />
//                 </div>
//             </div>
//
//             {/* Table */}
//             <div style={{
//                 backgroundColor: 'white',
//                 borderRadius: 8,
//                 padding: 16,
//                 boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//             }}>
//                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                     <thead>
//                         <tr style={{ borderBottom: '1px solid #eee' }}>
//                             <th style={{ textAlign: 'left', padding: '12px 8px' }}>Image</th>
//                             <th style={{ textAlign: 'left', padding: '12px 8px' }}>Name</th>
//                             <th style={{ textAlign: 'left', padding: '12px 8px' }}>ID</th>
//                             <th style={{ textAlign: 'left', padding: '12px 8px' }}>Description</th>
//                             <th style={{ textAlign: 'left', padding: '12px 8px' }}>Price</th>
//                             <th style={{ textAlign: 'left', padding: '12px 8px' }}>Stock</th>
//                             <th style={{ textAlign: 'left', padding: '12px 8px' }}>Info</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredItems.map((item) => (
//                             <tr key={item.id}
//                                 style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
//                                 onClick={() => setSelectedItem(item)}
//                             >
//                                 <td style={{ padding: '12px 8px' }}>
//                                     {item.imageUrl ? (
//                                         <img
//                                             src={item.imageUrl.startsWith("http") ? item.imageUrl : `http://localhost:8080/${item.imageUrl}`}
//                                             alt={item.name}
//                                             style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }}
//                                         />
//                                     ) : (
//                                         <span style={{ fontSize: 12, color: "#aaa" }}>No Image</span>
//                                     )}
//                                 </td>
//                                 <td style={{ padding: '12px 8px', fontWeight: 500 }}>{item.name}</td>
//                                 <td style={{ padding: '12px 8px' }}>{item.id}</td>
//                                 <td style={{ padding: '12px 8px' }}>{item.description}</td>
//                                 <td style={{ padding: '12px 8px' }}>{item.price} บาท</td>
//                                 <td style={{ padding: '12px 8px' }}>{item.stockQty}</td>
//                                 <td style={{ padding: '12px 8px' }}>
//                                     <button
//                                         style={{
//                                             backgroundColor: '#e3f2fd',
//                                             color: '#1976d2',
//                                             border: 'none',
//                                             borderRadius: 20,
//                                             padding: '4px 12px',
//                                             fontSize: 12,
//                                             cursor: 'pointer'
//                                         }}
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             setSelectedItem(item);
//                                         }}
//                                     >
//                                         More Info
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//
//                 {/* Add Item Button */}
//                 <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
//                     <button
//                         onClick={() => navigate('/admin/add-item')}
//                         style={{
//                             backgroundColor: '#4CAF50',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: 6,
//                             padding: '8px 16px',
//                             fontSize: 14,
//                             cursor: 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: 6
//                         }}>
//                         ➕ Add Item
//                     </button>
//                 </div>
//             </div>
//
//             {/* Modal */}
//             {selectedItem && (
//                 <div style={{
//                     position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
//                     backgroundColor: 'rgba(0,0,0,0.5)',
//                     display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
//                 }}>
//                     <div style={{ backgroundColor: 'white', borderRadius: 8, padding: 24, width: 400 }}>
//                         <h3>{selectedItem.name}</h3>
//                         {selectedItem.imageUrl && (
//                             <img
//                                 src={selectedItem.imageUrl.startsWith("http") ? selectedItem.imageUrl : `http://localhost:8080/${selectedItem.imageUrl}`}
//                                 alt={selectedItem.name}
//                                 style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8, marginBottom: 12 }}
//                             />
//                         )}
//                         <p><b>ID:</b> {selectedItem.id}</p>
//                         <p><b>Description:</b> {selectedItem.description}</p>
//                         <p><b>Price:</b> {selectedItem.price} บาท</p>
//                         <p><b>Stock:</b> {selectedItem.stockQty}</p>
//                         <button onClick={() => setSelectedItem(null)}>Close</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
// (ถ้ามีรูปสำรองก็ import มาใช้ได้)
// import placeholder from '../assets/placeholder.jpg';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const resolveImageUrl = (u) => {
    if (!u) return null;
    if (/^https?:\/\//i.test(u)) return u;        // เป็น URL เต็มอยู่แล้ว
    if (u.startsWith('/')) return `${API_BASE}${u}`; // /uploads/.. → http://.../uploads/..
    return `${API_BASE}/${u}`;                       // uploads/.. → http://.../uploads/..
};

export default function About() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE}/products`, {
                    headers: { Accept: 'application/json' },
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

    const filteredItems = menuItems.filter(item =>
        (item.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div style={{ padding: 24 }}>⏳ กำลังโหลด...</div>;
    if (error) return <div style={{ padding: 24, color: "red" }}>{error}</div>;

    return (
        <div style={{ padding: 24, background: "#f7f7f7", borderRadius: 12 }}>
            <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>Menu</h1>

            {/* Search */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 24, backgroundColor: 'white', padding: '12px 16px',
                borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
                    <input
                        type="text" placeholder="Search..." value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: 35, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, width: '100%', fontSize: 14 }}
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{ backgroundColor: 'white', borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Image</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>ID</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Description</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Price</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Stock</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Info</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredItems.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                            onClick={() => setSelectedItem(item)}>
                            <td style={{ padding: '12px 8px' }}>
                                {resolveImageUrl(item.imageUrl)
                                    ? <img src={resolveImageUrl(item.imageUrl)} alt={item.name}
                                           style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }} />
                                    : <span style={{ fontSize: 12, color: "#aaa" }}>No Image</span> /* หรือใช้ placeholder */}
                            </td>
                            <td style={{ padding: '12px 8px', fontWeight: 500 }}>{item.name}</td>
                            <td style={{ padding: '12px 8px' }}>{item.id}</td>
                            <td style={{ padding: '12px 8px' }}>{item.description}</td>
                            <td style={{ padding: '12px 8px' }}>{item.price} บาท</td>
                            <td style={{ padding: '12px 8px' }}>{item.stockQty}</td>
                            <td style={{ padding: '12px 8px' }}>
                                <button
                                    style={{ backgroundColor: '#e3f2fd', color: '#1976d2', border: 'none', borderRadius: 20, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}
                                    onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}>
                                    More Info
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => navigate('/admin/add-item')}
                            style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        ➕ Add Item
                    </button>
                </div>
            </div>

            {selectedItem && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', borderRadius: 8, padding: 24, width: 400 }}>
                        <h3>{selectedItem.name}</h3>
                        {resolveImageUrl(selectedItem.imageUrl) && (
                            <img src={resolveImageUrl(selectedItem.imageUrl)} alt={selectedItem.name}
                                 style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8, marginBottom: 12 }} />
                        )}
                        <p><b>ID:</b> {selectedItem.id}</p>
                        <p><b>Description:</b> {selectedItem.description}</p>
                        <p><b>Price:</b> {selectedItem.price} บาท</p>
                        <p><b>Stock:</b> {selectedItem.stockQty}</p>
                        <button onClick={() => setSelectedItem(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
