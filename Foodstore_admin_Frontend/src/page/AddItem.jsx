// src/page/AddItem.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function Additem() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const onFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setPreviewUrl(file ? window.URL.createObjectURL(file) : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===== Manual validation (ตรงกับ test) =====
    if (!name.trim() || !price.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบ',
        text: 'กรุณากรอกชื่อเมนูและราคา',
        confirmButtonText: 'ตกลง'
      });
      return; // สำคัญ: ไม่เรียก fetch ถ้าไม่ผ่าน
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('description', desc.trim());
    formData.append('price', price.trim());
    formData.append('stock', stock.trim());
    if (image) formData.append('image', image);

    try {
      // ===== สำคัญ: URL ต้องเป็นสตริง '/api/menu' ตรงตัว =====
      const res = await fetch('/api/menu', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      await Swal.fire({
        icon: 'success',
        title: 'เพิ่มเมนูสำเร็จ!',
        text: 'เมนูใหม่ของคุณถูกเพิ่มเข้าสู่ระบบแล้ว',
        confirmButtonText: 'ตกลง'
      });

      navigate('/admin/menu');
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'บันทึกเมนูไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  return (
    <div className="add-item-page">
      <h1>Add New Menu</h1>

      {/* ปิด HTML5 validation เพื่อให้ onSubmit ทำงานตามที่ test คาด */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label>Menu Name</label>
          <input
            placeholder="Enter menu name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea
            placeholder="Enter menu description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Price</label>
          <input
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="decimal"
          />
        </div>

        <div className="field">
          <label>Stock</label>
          <input
            placeholder="Enter stock quantity"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            inputMode="numeric"
          />
        </div>

        <div className="field">
          <label htmlFor="img">Upload Image</label>
          <input
            id="img"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onFileChange}
          />
          <label htmlFor="img" role="button">Upload Image</label>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              style={{ maxWidth: 200, display: 'block', marginTop: 8 }}
            />
          )}
        </div>

        <button type="submit">Apply</button>
      </form>
    </div>
  );
}