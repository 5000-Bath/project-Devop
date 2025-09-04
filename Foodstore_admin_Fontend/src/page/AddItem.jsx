import React, { useState } from "react";

export default function Additem() {
  const [formData, setFormData] = useState({
    menuName: '',
    description: '',
    price: '',
    coverImage: null
  });

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
      setFormData(prev => ({
        ...prev,
        coverImage: file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // In a real app, you would send this data to your backend
  };

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
              <label style={{ 
                display: 'block', 
                marginBottom: 8, 
                fontSize: 14, 
                fontWeight: 500, 
                color: '#666'
              }}>
                Menu Name
              </label>
              <input
                type="text"
                name="menuName"
                value={formData.menuName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  fontSize: 14,
                  boxSizing: 'border-box'
                }}
                placeholder="Enter menu name"
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 8, 
                fontSize: 14, 
                fontWeight: 500, 
                color: '#666'
              }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  fontSize: 14,
                  boxSizing: 'border-box',
                  minHeight: 80
                }}
                placeholder="Enter menu description"
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 8, 
                fontSize: 14, 
                fontWeight: 500, 
                color: '#666'
              }}>
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  fontSize: 14,
                  boxSizing: 'border-box'
                }}
                placeholder="Enter price"
                required
              />
            </div>
          </div>

          {/* Right column - Image upload */}
          <div style={{ flex: 1 }}>
            <div style={{
              backgroundColor: '#f9f9f9',
              border: '1px dashed #ddd',
              borderRadius: 6,
              padding: 40,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 200
            }}>
              <div style={{
                width: 60,
                height: 60,
                backgroundColor: '#e0e0e0',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" 
                     style={{ width: 24, height: 24, color: '#666' }} 
                     fill="none" 
                     viewBox="0 0 24 24" 
                     stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p style={{ 
                color: '#666', 
                fontSize: 14, 
                marginBottom: 8 
              }}>
                Menu Covers
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ 
                  display: 'none' 
                }}
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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          marginTop: 24
        }}>
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