import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit, X, Save } from 'lucide-react';

const API_BASE = "http://localhost:8080";

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

// สำหรับ SweetAlert2 - ใช้ window.Swal แทน import
const showAlert = (title, text, icon) => {
  if (window.Swal) {
    window.Swal.fire(title, text, icon);
  } else {
    alert(`${title}: ${text}`);
  }
};

const showConfirm = async (title, text) => {
  if (window.Swal) {
    return await window.Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    });
  } else {
    return { isConfirmed: window.confirm(`${title}\n${text}`) };
  }
};

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const initialFormState = {
    code: '',
    discountValue: '',
    expiryDate: '',
    maxUses: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/coupons`, { credentials: 'include' });
      if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลคูปองได้');
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      showAlert('เกิดข้อผิดพลาด', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code || '',
        discountValue: coupon.discountAmount || '',
        expiryDate: coupon.expirationDate ? coupon.expirationDate.split('T')[0] : '',
        maxUses: coupon.remainingCount || '',
      });
    } else {
      setEditingCoupon(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.discountValue) {
      showAlert('ข้อมูลไม่ครบ', 'กรุณากรอกโค้ดและมูลค่าส่วนลด', 'warning');
      return;
    }

    const url = editingCoupon
      ? `${API_BASE}/api/coupons/${editingCoupon.id}`
      : `${API_BASE}/api/coupons`;
    
    const method = editingCoupon ? 'PUT' : 'POST';

    const body = {
      code: formData.code,
      discountValue: parseFloat(formData.discountValue),
      maxUses: formData.maxUses ? parseInt(formData.maxUses, 10) : 0,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: 'เกิดข้อผิดพลาด' }));
        throw new Error(errData.message || `HTTP ${res.status}`);
      }

      showAlert(
        editingCoupon ? 'อัปเดตสำเร็จ!' : 'เพิ่มสำเร็จ!',
        `คูปอง "${formData.code}" ถูกบันทึกแล้ว`,
        'success'
      );
      closeModal();
      fetchCoupons();
    } catch (err) {
      showAlert('เกิดข้อผิดพลาด', err.message, 'error');
    }
  };

  const handleDelete = async (couponId) => {
    const result = await showConfirm('ต้องการลบคูปองนี้?', 'การกระทำนี้ไม่สามารถย้อนกลับได้!');

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE}/api/coupons/${couponId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('ลบไม่สำเร็จ');
        showAlert('ลบแล้ว!', 'คูปองถูกลบออกจากระบบแล้ว', 'success');
        fetchCoupons();
      } catch (err) {
        showAlert('เกิดข้อผิดพลาด', err.message, 'error');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>จัดการคูปอง</h1>
        <button style={styles.btnPrimary} onClick={() => openModal()}>
          <PlusCircle size={18} />
          <span style={{ marginLeft: '8px' }}>เพิ่มคูปองใหม่</span>
        </button>
      </div>

      {loading && <p style={styles.loadingText}>กำลังโหลด...</p>}
      {error && <p style={styles.errorText}>{error}</p>}

      {!loading && !error && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>โค้ด</th>
                <th style={styles.th}>มูลค่าส่วนลด</th>
                <th style={styles.th}>จำนวนคงเหลือ</th>
                <th style={styles.th}>วันหมดอายุ</th>
                <th style={styles.th}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id} style={styles.tr}>
                  <td style={styles.td}><strong>{coupon.code}</strong></td>
                  <td style={styles.td}>{coupon.discountAmount} บาท</td>
                  <td style={styles.td}>{coupon.remainingCount}</td>
                  <td style={styles.td}>{formatDate(coupon.expirationDate)}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button style={styles.btnIcon} onClick={() => openModal(coupon)} title="แก้ไข">
                        <Edit size={16} />
                      </button>
                      <button style={{...styles.btnIcon, ...styles.btnDanger}} onClick={() => handleDelete(coupon.id)} title="ลบ">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="5" style={styles.noData}>ยังไม่มีคูปองในระบบ</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>{editingCoupon ? 'แก้ไขคูปอง' : 'เพิ่มคูปองใหม่'}</h2>
              <button onClick={closeModal} style={styles.btnClose}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>โค้ดคูปอง</label>
                <input 
                  type="text" 
                  name="code" 
                  value={formData.code} 
                  onChange={handleInputChange} 
                  required 
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>มูลค่าส่วนลด (บาท)</label>
                <input 
                  type="number" 
                  name="discountValue" 
                  value={formData.discountValue} 
                  onChange={handleInputChange} 
                  required 
                  min="0" 
                  step="0.01"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>จำนวนคงเหลือ</label>
                <input 
                  type="number" 
                  name="maxUses" 
                  value={formData.maxUses} 
                  onChange={handleInputChange} 
                  min="0"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>วันหมดอายุ</label>
                <input 
                  type="date" 
                  name="expiryDate" 
                  value={formData.expiryDate} 
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.modalFooter}>
                <button type="button" style={styles.btnGhost} onClick={closeModal}>ยกเลิก</button>
                <button type="submit" style={styles.btnPrimary}>
                  <Save size={18} />
                  <span style={{ marginLeft: '8px' }}>{editingCoupon ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มคูปอง'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#f44336',
  },
  tableContainer: {
    overflowX: 'auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f5f5f5',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    fontWeight: 'bold',
  },
  tr: {
    borderBottom: '1px solid #eee',
  },
  td: {
    padding: '12px',
  },
  noData: {
    textAlign: 'center',
    padding: '20px',
    color: '#999',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  btnIcon: {
    padding: '6px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDanger: {
    backgroundColor: '#f44336',
  },
  modalOverlay: {
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
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #eee',
  },
  btnClose: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
  },
  form: {
    padding: '20px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  btnGhost: {
    padding: '10px 20px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};