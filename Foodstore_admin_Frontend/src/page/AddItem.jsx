import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './AddItem.css';

export default function Additem() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [category, setCategory] = useState('');

  const CATEGORY_OPTIONS = ['อาหารคาว', 'ของหวาน', 'เครื่องดื่ม', 'เมนูพิเศษ'];

  const onFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setPreviewUrl(file ? window.URL.createObjectURL(file) : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !price.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบ',
        text: 'กรุณากรอกชื่อเมนูและราคา',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('description', desc.trim());
    formData.append('price', price.trim());
      const safeStock = Math.max(0, Number(stock) || 0);
      formData.append('stock', safeStock);
      if (category) formData.append('category', category);
    if (image) formData.append('image', image);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Request failed');

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
      <div className="wrapper">
        <h1 className="page-title">Add New Menu</h1>

        <div className="header-cover">Menu Cover</div>

        <form className="add-item-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="left-col">
              <div className="field">
                <label>Menu Name</label>
                <input
                  className="form-input"
                  name="name"
                  placeholder="Enter menu name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Description</label>
                <textarea
                  className="form-textarea"
                  name="description"
                  placeholder="Enter menu description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Price (THB)</label>
                <input
                  className="form-input"
                  name="price"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  inputMode="decimal"
                />
              </div>

                <div className="field">
                    <label>Stock Quantity</label>
                    <input
                        className="form-input"
                        name="stock"
                        placeholder="Enter stock quantity"
                        value={stock}
                        onChange={(e) => {
                            const value = Math.max(0, Number(e.target.value));
                            setStock(value);
                        }}
                        inputMode="numeric"
                        type="number"
                        min="0"
                    />
                </div>



                <div className="field">
                <label>Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  aria-label="Category"
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="right-col">
              <div className="upload-box">
                <div className="upload-inner">
                  <div className="upload-label">Menu Cover Image</div>

                  <input
                    id="img"
                    type="file"
                    accept="image/*"
                    className="file-input"
                    onChange={onFileChange}
                  />
                  <label htmlFor="img" className="btn btn-primary">
                    Upload Image
                  </label>

                  {previewUrl && (
                    <div className="preview">
                      <img src={previewUrl} alt="preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="apply-wrap">
            <button type="submit" className="btn btn-success">
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}