import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { PlusCircle, Trash2, Edit, X, Save } from 'lucide-react';

/* ---------------------- Format Date ---------------------- */
const formatDate = (dateString) => {
  if (!dateString) return '–';
  try {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

/* -------------------- SweetAlert2 Wrapper -------------------- */
const showAlert = (title, text, icon = 'info') => {
  return Swal.fire({
    title,
    text,
    icon,
    timer: 2000,
    showConfirmButton: false,
  });
};

const showConfirm = async (title, text) => {
  return await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e53e3e',
    cancelButtonColor: '#3182ce',
    confirmButtonText: 'ใช่, ลบเลย!',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true,
  });
};

/* --------------------------- Component --------------------------- */
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

  /* ---------------------- Load Coupons ---------------------- */
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/coupons`, { credentials: 'include' });
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

  /* ---------------------- Form Change ---------------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------------- Open/Close Modal ---------------------- */
  const openModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code || '',
        discountValue: coupon.discountAmount || '',
        expiryDate: coupon.expirationDate?.split('T')[0] || '',
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

  /* ---------------------- Submit ---------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code.trim() || !formData.discountValue) {
      showAlert('ข้อมูลไม่ครบ', 'กรุณากรอกโค้ดและมูลค่าส่วนลด', 'warning');
      return;
    }

    const url = editingCoupon
      ? `/api/coupons/${editingCoupon.id}`
      : `/api/coupons`;

    const method = editingCoupon ? 'PUT' : 'POST';

    const body = {
      code: formData.code,
      discountAmount: parseFloat(formData.discountValue),
      remainingCount: formData.maxUses ? parseInt(formData.maxUses, 10) : 0,
      expirationDate: formData.expiryDate
        ? new Date(formData.expiryDate).toISOString()
        : null,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'เกิดข้อผิดพลาด' }));
        throw new Error(err.message);
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

  /* ---------------------- Delete ---------------------- */
  const handleDelete = async (couponId) => {
    const result = await showConfirm(
      'ต้องการลบคูปองนี้?',
      'การกระทำนี้ไม่สามารถย้อนกลับได้!'
    );

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/coupons/${couponId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('ลบไม่สำเร็จ');

      showAlert('ลบแล้ว!', 'คูปองถูกลบออกจากระบบแล้ว', 'success');
      fetchCoupons();
    } catch (err) {
      showAlert('เกิดข้อผิดพลาด', err.message, 'error');
    }
  };

  /* --------------------------- JSX --------------------------- */
  return (
    <div className="coupons-container">
      <div className="coupons-header">
        <h1 className="coupons-title">จัดการคูปอง</h1>

        <button className="btn btn-primary" onClick={() => openModal()}>
          <PlusCircle size={18} />
          <span>เพิ่มคูปองใหม่</span>
        </button>
      </div>

      {loading && <p className="loading">กำลังโหลด...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="table-container">
          <table className="coupons-table">
            <thead>
              <tr>
                <th>โค้ด</th>
                <th>มูลค่าส่วนลด</th>
                <th>จำนวนคงเหลือ</th>
                <th>วันหมดอายุ</th>
                <th>จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td><strong>{coupon.code}</strong></td>
                    <td>{coupon.discountAmount} บาท</td>
                    <td>{coupon.remainingCount || '–'}</td>
                    <td>{formatDate(coupon.expirationDate)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => openModal(coupon)}
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDelete(coupon.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">ยังไม่มีคูปองในระบบ</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------------- Modal ---------------------- */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCoupon ? 'แก้ไขคูปอง' : 'เพิ่มคูปองใหม่'}</h2>
              <button className="btn-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>โค้ดคูปอง</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>มูลค่าส่วนลด (บาท)</label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>จำนวนคงเหลือ</label>
                <input
                  type="number"
                  name="maxUses"
                  value={formData.maxUses}
                  onChange={handleInputChange}
                  min="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>วันหมดอายุ</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={18} />
                  <span>{editingCoupon ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มคูปอง'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ใช้ <style> แทน inline styles เพื่อให้จัดการง่าย + ใส่ animation
const style = document.createElement('style');
style.textContent = `
  .coupons-container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
    color: #333;
  }

  .coupons-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .coupons-title {
    font-size: 28px;
    font-weight: 700;
    color: #2d3748;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .btn-primary {
    background-color: #3182ce;
    color: white;
  }

  .btn-primary:hover {
    background-color: #2c5282;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(49, 130, 206, 0.3);
  }

  .btn-ghost {
    background-color: #f7fafc;
    color: #4a5568;
  }

  .btn-ghost:hover {
    background-color: #edf2f7;
  }

  .loading, .error {
    text-align: center;
    font-size: 16px;
    padding: 20px;
  }

  .error {
    color: #e53e3e;
  }

  .table-container {
    overflow-x: auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  .coupons-table {
    width: 100%;
    border-collapse: collapse;
  }

  .coupons-table th {
    background-color: #f8fafc;
    padding: 16px 12px;
    text-align: left;
    font-weight: 600;
    color: #4a5568;
    border-bottom: 1px solid #e2e8f0;
  }

  .coupons-table td {
    padding: 14px 12px;
    border-bottom: 1px solid #edf2f7;
  }

  .coupons-table tr:last-child td {
    border-bottom: none;
  }

  .no-data {
    text-align: center;
    color: #a0aec0;
    padding: 32px;
    font-style: italic;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .btn-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-edit {
    background-color: #4299e1;
    color: white;
  }

  .btn-edit:hover {
    background-color: #2b6cb0;
  }

  .btn-delete {
    background-color: #e53e3e;
    color: white;
  }

  .btn-delete:hover {
    background-color: #c53030;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #edf2f7;
  }

  .modal-header h2 {
    font-size: 20px;
    font-weight: 600;
    color: #2d3748;
  }

  .btn-close {
    background: none;
    border: none;
    color: #718096;
    cursor: pointer;
    padding: 4px;
  }

  .btn-close:hover {
    color: #1a202c;
  }

  .modal-form {
    padding: 20px;
  }

  .form-group {
    margin-bottom: 18px;
  }

  .form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    color: #2d3748;
  }

  .form-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 15px;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .form-input:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (max-width: 768px) {
    .coupons-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .btn {
      width: 100%;
      justify-content: center;
    }
  }
`;

// เพิ่ม style เข้าไปใน document
if (!document.getElementById('coupons-styles')) {
  style.id = 'coupons-styles';
  document.head.appendChild(style);
}