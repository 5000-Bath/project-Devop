import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './Coupons.css';
import { PlusCircle, Trash2, Edit, X, Save } from 'lucide-react';

const API_BASE = "http://localhost:8080";

// ฟังก์ชันสำหรับจัดรูปแบบวันที่
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

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const initialFormState = {
    code: '',
    discountType: 'FIXED_AMOUNT',
    discountValue: '',
    expiryDate: '',
    maxUses: '',
    minPurchaseAmount: '',
    isActive: true,
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
      setCoupons(Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []);
    } catch (err) {
      setError(err.message);
      Swal.fire('เกิดข้อผิดพลาด', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
        maxUses: coupon.maxUses ?? '',
        minPurchaseAmount: coupon.minPurchaseAmount ?? '',
        isActive: coupon.isActive,
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
      Swal.fire('ข้อมูลไม่ครบ', 'กรุณากรอกโค้ดและมูลค่าส่วนลด', 'warning');
      return;
    }

    const url = editingCoupon
      ? `${API_BASE}/api/coupons/${editingCoupon.id}`
      : `${API_BASE}/api/coupons`;
    
    const method = editingCoupon ? 'PUT' : 'POST';

    const body = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      maxUses: formData.maxUses ? parseInt(formData.maxUses, 10) : null,
      minPurchaseAmount: formData.minPurchaseAmount ? parseFloat(formData.minPurchaseAmount) : null,
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

      Swal.fire(
        editingCoupon ? 'อัปเดตสำเร็จ!' : 'เพิ่มสำเร็จ!',
        `คูปอง "${formData.code}" ถูกบันทึกแล้ว`,
        'success'
      );
      closeModal();
      fetchCoupons();
    } catch (err) {
      Swal.fire('เกิดข้อผิดพลาด', err.message, 'error');
    }
  };

  const handleDelete = async (couponId) => {
    const result = await Swal.fire({
      title: 'ต้องการลบคูปองนี้?',
      text: "การกระทำนี้ไม่สามารถย้อนกลับได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE}/api/coupons/${couponId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('ลบไม่สำเร็จ');
        Swal.fire('ลบแล้ว!', 'คูปองถูกลบออกจากระบบแล้ว', 'success');
        fetchCoupons();
      } catch (err) {
        Swal.fire('เกิดข้อผิดพลาด', err.message, 'error');
      }
    }
  };

  return (
    <div className="coupons-page">
      <div className="page-header">
        <h1>จัดการคูปอง</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <PlusCircle size={18} />
          <span>เพิ่มคูปองใหม่</span>
        </button>
      </div>

      {loading && <p className="loading-text">กำลังโหลด...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="table-container">
          <table className="coupons-table">
            <thead>
              <tr>
                <th>โค้ด</th>
                <th>ประเภท</th>
                <th>มูลค่า</th>
                <th>ขั้นต่ำ</th>
                <th>วันหมดอายุ</th>
                <th>ใช้ไป/สูงสุด</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id}>
                  <td className="coupon-code">{coupon.code}</td>
                  <td>{coupon.discountType === 'PERCENTAGE' ? 'เปอร์เซ็นต์' : 'จำนวนเงิน'}</td>
                  <td>{coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `${coupon.discountValue} บาท`}</td>
                  <td>{coupon.minPurchaseAmount ? `${coupon.minPurchaseAmount} บาท` : '-'}</td>
                  <td>{formatDate(coupon.expiryDate)}</td>
                  <td>{coupon.uses} / {coupon.maxUses ?? '∞'}</td>
                  <td>
                    <span className={`status-badge ${coupon.isActive ? 'active' : 'inactive'}`}>
                      {coupon.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => openModal(coupon)} title="แก้ไข">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon btn-danger" onClick={() => handleDelete(coupon.id)} title="ลบ">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="8" className="no-data">ยังไม่มีคูปองในระบบ</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCoupon ? 'แก้ไขคูปอง' : 'เพิ่มคูปองใหม่'}</h2>
              <button onClick={closeModal} className="btn-close"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="coupon-form">
              <div className="form-group">
                <label>โค้ดคูปอง</label>
                <input type="text" name="code" value={formData.code} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ประเภทส่วนลด</label>
                  <select name="discountType" value={formData.discountType} onChange={handleInputChange}>
                    <option value="FIXED_AMOUNT">จำนวนเงิน (บาท)</option>
                    <option value="PERCENTAGE">เปอร์เซ็นต์ (%)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>มูลค่าส่วนลด</label>
                  <input type="number" name="discountValue" value={formData.discountValue} onChange={handleInputChange} required min="0" step="0.01" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ยอดซื้อขั้นต่ำ (ถ้ามี)</label>
                  <input type="number" name="minPurchaseAmount" value={formData.minPurchaseAmount} onChange={handleInputChange} min="0" />
                </div>
                <div className="form-group">
                  <label>จำนวนครั้งที่ใช้ได้ (ถ้ามี)</label>
                  <input type="number" name="maxUses" value={formData.maxUses} onChange={handleInputChange} min="1" />
                </div>
              </div>
              <div className="form-group">
                <label>วันหมดอายุ (ถ้ามี)</label>
                <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} />
              </div>
              <div className="form-group form-group-checkbox">
                <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
                <label htmlFor="isActive">เปิดใช้งานคูปองนี้</label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>ยกเลิก</button>
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
