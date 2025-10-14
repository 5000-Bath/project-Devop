import React, { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function Additem() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    stock: 0,
    isActive: true
  });

  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // ✅ สำหรับ preview
  const navigate = useNavigate(); // ✅ สำหรับ redirect

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("📦 File size:", file.size, "bytes");

      const maxSize = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'warning',
          title: 'ไฟล์ใหญ่เกินไป',
          text: 'กรุณาอัปโหลดรูปภาพขนาดไม่เกิน 1MB',
          confirmButtonText: 'ตกลง'
        });
        e.target.value = ''; // reset ค่า input file
        return;
      }

      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบ',
        text: 'กรุณากรอกชื่อเมนูและราคา',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description || '');
    formDataToSend.append('price', parseFloat(formData.price));
    formDataToSend.append('stock', parseInt(formData.stock) || 0);
    formDataToSend.append('isActive', formData.isActive);

    if (coverImage) {
      formDataToSend.append('image', coverImage);
    }

    try {
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        await response.json();
        Swal.fire({
          icon: 'success',
          title: 'เพิ่มเมนูสำเร็จ!',
          text: 'เมนูใหม่ของคุณถูกเพิ่มเข้าสู่ระบบแล้ว',
          confirmButtonText: 'ตกลง'
        });
        setFormData({
          name: '',
          description: '',
          price: '',
          stock: 0,
          isActive: true
        });
        setCoverImage(null);
        setPreviewUrl(null);
        navigate('/admin/menu'); // ✅ redirect ไปหน้า menu
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาด: ' + error.message,
        confirmButtonText: 'ลองอีกครั้ง'
      });
    }
  }

  return (
    <div style={{ padding: 24, background: "#f7f7f7", borderRadius: 12 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>Add New Menu</h1>

      {/* Header image */}
      <div style={{
        width: '100%',
        height: 60,
        backgroundImage: 'url("https://placehold.co/800x60/1a1a1a/ffffff?text=Menu+Cover")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 8,
        marginBottom: 24
      }}></div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 24 }}>
          {/* Left column - Form fields */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#666' }}>
                Menu Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
                placeholder="Enter menu name"
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#666' }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', minHeight: 80 }}
                placeholder="Enter menu description"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#666' }}>
                Price (THB)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
                placeholder="Enter price"
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#666' }}>
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
                placeholder="Enter stock quantity"
              />
            </div>
          </div>

          {/* Right column - Image upload + preview */}
          <div style={{ flex: 1 }}>
            <div style={{
              backgroundColor: '#f9f9f9',
              border: '1px dashed #ddd',
              borderRadius: 6,
              padding: 20,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200
            }}>
              {previewUrl ? (
                <img src={previewUrl} alt="preview" style={{ maxHeight: 150, borderRadius: 8, marginBottom: 12 }} />
              ) : (
                <p style={{ color: '#666', marginBottom: 12 }}>Menu Cover Image</p>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'inline-block',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
              >
                Upload Image
              </label>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              padding: '10px 24px',
              fontSize: 14,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  );
}
