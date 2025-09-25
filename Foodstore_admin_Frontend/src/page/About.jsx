import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useIsMobile } from './useIsMobile';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const resolveImageUrl = (u) => {
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith('/')) return `${API_BASE}${u}`;
  return `${API_BASE}/${u}`;
};

export default function About() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // ตรวจสอบว่าอยู่ในมือถือหรือไม่
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`, {
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'ลบเมนูนี้?',
      text: 'การลบเมนูจะไม่สามารถกู้คืนได้',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE}/api/products/${id}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete product');
        Swal.fire({ icon: 'success', title: 'ลบเรียบร้อยแล้ว!' });
        setMenuItems(menuItems.filter(item => item.id !== id));
        setSelectedItem(null);
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.message });
      }
    }
  };

  if (loading) return <div style={{ padding: 24, textAlign: 'center' }}>⏳ กำลังโหลด...</div>;
  if (error) return <div style={{ padding: 24, color: "red", textAlign: 'center' }}>{error}</div>;

  return (
    <div style={{ padding: isMobile ? 16 : 24, background: "#f7f7f7", minHeight: '100vh' }}>
      <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', marginBottom: isMobile ? 16 : 20, color: '#333' }}>
        Menu
      </h1>

      {/* Search */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMobile ? 16 : 24,
        backgroundColor: 'white',
        padding: isMobile ? '8px 12px' : '12px 16px',
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            border: '1px solid #ddd',
            borderRadius: 6,
            padding: isMobile ? '6px 12px' : '8px 12px',
            fontSize: isMobile ? 14 : 16,
            width: '100%',
            outline: 'none'
          }}
        />
      </div>

      {/* Content */}
      <div style={{ backgroundColor: 'white', borderRadius: 8, padding: isMobile ? 12 : 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {isMobile ? (
          // ✅ Mobile: Card Layout
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                style={{
                  border: '1px solid #eee',
                  borderRadius: 8,
                  padding: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  gap: 12
                }}
              >
                {resolveImageUrl(item.imageUrl) ? (
                  <img
                    src={resolveImageUrl(item.imageUrl)}
                    alt={item.name}
                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
                  />
                ) : (
                  <div style={{ width: 60, height: 60, background: '#f0f0f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#888' }}>
                    No Image
                  </div>
                )}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>฿{item.price}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>Stock: {item.stockQty}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 💻 Desktop: Table
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
                <tr
                  key={item.id}
                  style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                  onClick={() => setSelectedItem(item)}
                >
                  <td style={{ padding: '12px 8px' }}>
                    {resolveImageUrl(item.imageUrl) ? (
                      <img
                        src={resolveImageUrl(item.imageUrl)}
                        alt={item.name}
                        style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }}
                      />
                    ) : (
                      <span style={{ fontSize: 12, color: "#aaa" }}>No Image</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 8px', fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: '12px 8px' }}>{item.id}</td>
                  <td style={{ padding: '12px 8px' }}>{item.description}</td>
                  <td style={{ padding: '12px 8px' }}>{item.price} บาท</td>
                  <td style={{ padding: '12px 8px' }}>{item.stockQty}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <button
                      style={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        border: 'none',
                        borderRadius: 20,
                        padding: '4px 12px',
                        fontSize: 12,
                        cursor: 'pointer'
                      }}
                      onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                    >
                      More Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => navigate('/admin/add-item')}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              padding: isMobile ? '10px 16px' : '8px 16px',
              fontSize: isMobile ? 16 : 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
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
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: isMobile ? 16 : 0
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: isMobile ? 16 : 24,
              width: isMobile ? '100%' : 400,
              maxWidth: '100%',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              style={{
                position: 'absolute',
                top: isMobile ? 8 : 12,
                right: isMobile ? 8 : 12,
                background: '#d4d4d4',
                border: 'none',
                borderRadius: '50%',
                width: 28,
                height: 28,
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16
              }}
            >
              ×
            </button>

            <h3 style={{ marginBottom: 12, fontSize: isMobile ? 18 : 20 }}>{selectedItem.name}</h3>
            {resolveImageUrl(selectedItem.imageUrl) && (
              <img
                src={resolveImageUrl(selectedItem.imageUrl)}
                alt={selectedItem.name}
                style={{
                  width: "100%",
                  height: isMobile ? 150 : 200,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 12
                }}
              />
            )}
            <p><b>ID:</b> {selectedItem.id}</p>
            <p><b>Description:</b> {selectedItem.description}</p>
            <p><b>Price:</b> {selectedItem.price} บาท</p>
            <p><b>Stock:</b> {selectedItem.stockQty}</p>

            <button
              onClick={() => handleDelete(selectedItem.id)}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '10px 16px',
                fontSize: 16,
                cursor: 'pointer',
                marginTop: 12,
                width: '100%'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}