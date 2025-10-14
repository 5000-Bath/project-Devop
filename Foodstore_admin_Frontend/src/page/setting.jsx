// import React, { useState } from "react";
//
// export default function setting() {
//   const [user] = useState({
//     name: "my bro Ake",
//     email: "ake@gmail.com",
//     avatar: "https://placehold.co/40x40/ff6b6b/ffffff?text=AK"
//   });
//
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     nickName: "",
//     email: user.email
//   });
//
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };
//
//   const handleEditClick = () => {
//     setEditMode(true);
//     setFormData({
//       fullName: user.name,
//       nickName: "",
//       email: user.email
//     });
//   };
//
//   const handleSaveClick = () => {
//     // In a real app, you would save the data to your backend
//     console.log('Saving user data:', formData);
//     setEditMode(false);
//   };
//
//   const handleCancelClick = () => {
//     setEditMode(false);
//     setFormData({
//       fullName: "",
//       nickName: "",
//       email: user.email
//     });
//   };
//
//   const handleAddEmail = () => {
//     // Create a custom modal similar to Swal
//     const modal = document.createElement('div');
//     modal.style.cssText = `
//       position: fixed;
//       top: 0;
//       left: 0;
//       right: 0;
//       bottom: 0;
//       background-color: rgba(0,0,0,0.5);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       z-index: 1000;
//       font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
//     `;
//
//     const modalContent = document.createElement('div');
//     modalContent.style.cssText = `
//       background: white;
//       border-radius: 8px;
//       padding: 24px;
//       width: 400px;
//       max-width: 90vw;
//       box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
//     `;
//
//     modalContent.innerHTML = `
//       <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
//         <h3 style="font-size: 18px; font-weight: 600; color: #333;">Add Email Address</h3>
//         <button id="closeModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">×</button>
//       </div>
//       <div style="margin-bottom: 16px;">
//         <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #666;">Email Address</label>
//         <input
//           type="email"
//           id="emailInput"
//           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;"
//           placeholder="Enter email address"
//         />
//       </div>
//       <div style="display: flex; gap: 12px; justify-content: flex-end;">
//         <button id="cancelBtn" style="background: transparent; color: #666; border: 1px solid #ddd; border-radius: 6px; padding: 8px 16px; font-size: 14px; cursor: pointer;">Cancel</button>
//         <button id="confirmBtn" style="background: #4CAF50; color: white; border: none; border-radius: 6px; padding: 8px 16px; font-size: 14px; cursor: pointer;">Add</button>
//       </div>
//     `;
//
//     modal.appendChild(modalContent);
//     document.body.appendChild(modal);
//
//     // Close modal functions
//     const closeModal = () => {
//       document.body.removeChild(modal);
//     };
//
//     // Event listeners
//     document.getElementById('closeModal').addEventListener('click', closeModal);
//     document.getElementById('cancelBtn').addEventListener('click', closeModal);
//
//     document.getElementById('confirmBtn').addEventListener('click', () => {
//       const emailInput = document.getElementById('emailInput');
//       const email = emailInput.value.trim();
//
//       if (email) {
//         // In a real app, you would save the email
//         console.log('Added email:', email);
//
//         // Show success message
//         const successModal = document.createElement('div');
//         successModal.style.cssText = `
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background-color: rgba(0,0,0,0.5);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 1001;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
//         `;
//
//         const successContent = document.createElement('div');
//         successContent.style.cssText = `
//           background: white;
//           border-radius: 8px;
//           padding: 24px;
//           width: 350px;
//           text-align: center;
//           box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
//         `;
//
//         successContent.innerHTML = `
//           <div style="color: #4CAF50; font-size: 48px; margin-bottom: 16px;">✓</div>
//           <h3 style="font-size: 18px; font-weight: 600; color: #333; margin-bottom: 8px;">Success!</h3>
//           <p style="color: #666; font-size: 14px; margin-bottom: 16px;">Email address added successfully</p>
//           <button id="okBtn" style="background: #4CAF50; color: white; border: none; border-radius: 6px; padding: 8px 16px; font-size: 14px; cursor: pointer; width: 100%;">OK</button>
//         `;
//
//         successModal.appendChild(successContent);
//         document.body.appendChild(successModal);
//
//         document.getElementById('okBtn').addEventListener('click', () => {
//           document.body.removeChild(successModal);
//           document.body.removeChild(modal);
//         });
//
//       } else {
//         // Show error message
//         const errorModal = document.createElement('div');
//         errorModal.style.cssText = `
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background-color: rgba(0,0,0,0.5);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 1001;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
//         `;
//
//         const errorContent = document.createElement('div');
//         errorContent.style.cssText = `
//           background: white;
//           border-radius: 8px;
//           padding: 24px;
//           width: 350px;
//           text-align: center;
//           box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
//         `;
//
//         errorContent.innerHTML = `
//           <div style="color: #f44336; font-size: 48px; margin-bottom: 16px;">!</div>
//           <h3 style="font-size: 18px; font-weight: 600; color: #333; margin-bottom: 8px;">Error!</h3>
//           <p style="color: #666; font-size: 14px; margin-bottom: 16px;">Please enter a valid email address</p>
//           <button id="errorOkBtn" style="background: #f44336; color: white; border: none; border-radius: 6px; padding: 8px 16px; font-size: 14px; cursor: pointer; width: 100%;">OK</button>
//         `;
//
//         errorModal.appendChild(errorContent);
//         document.body.appendChild(errorModal);
//
//         document.getElementById('errorOkBtn').addEventListener('click', () => {
//           document.body.removeChild(errorModal);
//         });
//       }
//     });
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
//         <div>
//           <h1 style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>Welcome, {user.name}</h1>
//           <p style={{ color: '#666', fontSize: 14 }}>Tue, 07 June 2022</p>
//         </div>
//
//         <div style={{
//           position: 'relative',
//           maxWidth: 250
//         }}>
//           <input
//             type="text"
//             placeholder="Search..."
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
//         {/* User Profile Header */}
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: 24
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <img
//               src={user.avatar}
//               alt="Profile"
//               style={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: 50,
//                 objectFit: 'cover'
//               }}
//             />
//             <div>
//               <h2 style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>{user.name}</h2>
//               <p style={{ color: '#666', fontSize: 14 }}>{user.email}</p>
//             </div>
//           </div>
//
//           <button
//             onClick={handleEditClick}
//             style={{
//               backgroundColor: '#4CAF50',
//               color: 'white',
//               border: 'none',
//               borderRadius: 6,
//               padding: '6px 12px',
//               fontSize: 14,
//               cursor: 'pointer',
//               transition: 'background-color 0.2s'
//             }}
//             onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
//             onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
//           >
//             Edit
//           </button>
//         </div>
//
//         {/* Form Fields */}
//         {editMode ? (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
//             <div style={{ display: 'flex', gap: 24 }}>
//               <div style={{ flex: 1 }}>
//                 <label style={{
//                   display: 'block',
//                   marginBottom: 8,
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#666'
//                 }}>
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleInputChange}
//                   style={{
//                     width: '100%',
//                     padding: '12px 16px',
//                     border: '1px solid #ddd',
//                     borderRadius: 6,
//                     fontSize: 14,
//                     boxSizing: 'border-box'
//                   }}
//                   placeholder="Your First Name"
//                 />
//               </div>
//
//               <div style={{ flex: 1 }}>
//                 <label style={{
//                   display: 'block',
//                   marginBottom: 8,
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#666'
//                 }}>
//                   Nick Name
//                 </label>
//                 <input
//                   type="text"
//                   name="nickName"
//                   value={formData.nickName}
//                   onChange={handleInputChange}
//                   style={{
//                     width: '100%',
//                     padding: '12px 16px',
//                     border: '1px solid #ddd',
//                     borderRadius: 6,
//                     fontSize: 14,
//                     boxSizing: 'border-box'
//                   }}
//                   placeholder="Your First Name"
//                 />
//               </div>
//             </div>
//
//             <div>
//               <label style={{
//                 display: 'block',
//                 marginBottom: 8,
//                 fontSize: 14,
//                 fontWeight: 500,
//                 color: '#666'
//               }}>
//                 My email Address
//               </label>
//               <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 8
//               }}>
//                 <div style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   padding: '12px 16px',
//                   backgroundColor: '#f9f9f9',
//                   borderRadius: 6,
//                   border: '1px solid #eee'
//                 }}>
//                   <svg xmlns="http://www.w3.org/2000/svg"
//                        style={{ width: 16, height: 16, color: '#4CAF50', marginRight: 8 }}
//                        fill="none"
//                        viewBox="0 0 24 24"
//                        stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                   <span style={{ color: '#333', fontSize: 14 }}>{formData.email}</span>
//                 </div>
//                 <button
//                   onClick={handleAddEmail}
//                   style={{
//                     backgroundColor: '#e3f2fd',
//                     color: '#1976d2',
//                     border: 'none',
//                     borderRadius: 6,
//                     padding: '6px 12px',
//                     fontSize: 14,
//                     cursor: 'pointer',
//                     transition: 'background-color 0.2s'
//                   }}
//                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#bbdefb'}
//                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e3f2fd'}
//                 >
//                   + Add Email Address
//                 </button>
//               </div>
//             </div>
//
//             <div style={{
//               display: 'flex',
//               gap: 12,
//               marginTop: 24
//             }}>
//               <button
//                 onClick={handleSaveClick}
//                 style={{
//                   backgroundColor: '#4CAF50',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: 6,
//                   padding: '10px 24px',
//                   fontSize: 14,
//                   cursor: 'pointer',
//                   transition: 'background-color 0.2s'
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
//               >
//                 Save
//               </button>
//               <button
//                 onClick={handleCancelClick}
//                 style={{
//                   backgroundColor: 'transparent',
//                   color: '#666',
//                   border: '1px solid #ddd',
//                   borderRadius: 6,
//                   padding: '10px 24px',
//                   fontSize: 14,
//                   cursor: 'pointer',
//                   transition: 'background-color 0.2s'
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
//             <div style={{ display: 'flex', gap: 24 }}>
//               <div style={{ flex: 1 }}>
//                 <label style={{
//                   display: 'block',
//                   marginBottom: 8,
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#666'
//                 }}>
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   value={user.name}
//                   disabled
//                   style={{
//                     width: '100%',
//                     padding: '12px 16px',
//                     border: '1px solid #ddd',
//                     borderRadius: 6,
//                     fontSize: 14,
//                     boxSizing: 'border-box',
//                     backgroundColor: '#f9f9f9',
//                     cursor: 'not-allowed'
//                   }}
//                   placeholder="Your First Name"
//                 />
//               </div>
//
//               <div style={{ flex: 1 }}>
//                 <label style={{
//                   display: 'block',
//                   marginBottom: 8,
//                   fontSize: 14,
//                   fontWeight: 500,
//                   color: '#666'
//                 }}>
//                   Nick Name
//                 </label>
//                 <input
//                   type="text"
//                   value=""
//                   disabled
//                   style={{
//                     width: '100%',
//                     padding: '12px 16px',
//                     border: '1px solid #ddd',
//                     borderRadius: 6,
//                     fontSize: 14,
//                     boxSizing: 'border-box',
//                     backgroundColor: '#f9f9f9',
//                     cursor: 'not-allowed'
//                   }}
//                   placeholder="Your First Name"
//                 />
//               </div>
//             </div>
//
//             <div>
//               <label style={{
//                 display: 'block',
//                 marginBottom: 8,
//                 fontSize: 14,
//                 fontWeight: 500,
//                 color: '#666'
//               }}>
//                 My email Address
//               </label>
//               <div style={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 8
//               }}>
//                 <div style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   padding: '12px 16px',
//                   backgroundColor: '#f9f9f9',
//                   borderRadius: 6,
//                   border: '1px solid #eee'
//                 }}>
//                   <svg xmlns="http://www.w3.org/2000/svg"
//                        style={{ width: 16, height: 16, color: '#4CAF50', marginRight: 8 }}
//                        fill="none"
//                        viewBox="0 0 24 24"
//                        stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                   <span style={{ color: '#333', fontSize: 14 }}>{user.email}</span>
//                 </div>
//                 <button
//                   onClick={handleAddEmail}
//                   style={{
//                     backgroundColor: '#e3f2fd',
//                     color: '#1976d2',
//                     border: 'none',
//                     borderRadius: 6,
//                     padding: '6px 12px',
//                     fontSize: 14,
//                     cursor: 'pointer',
//                     transition: 'background-color 0.2s'
//                   }}
//                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#bbdefb'}
//                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e3f2fd'}
//                 >
//                   + Add Email Address
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/+$/, "");

/** หัวข้อย่อย: ปุ่ม / input / กล่อง modal เล็กๆ */
function Button({ children, onClick, variant = "primary", ...rest }) {
    const styles = {
        base: {
            border: "none",
            borderRadius: 6,
            padding: "8px 14px",
            fontSize: 14,
            cursor: "pointer",
            transition: "background-color .2s",
        },
        primary: { backgroundColor: "#4CAF50", color: "#fff" },
        ghost: { backgroundColor: "transparent", color: "#666", border: "1px solid #ddd" },
        info: { backgroundColor: "#e3f2fd", color: "#1976d2" },
        danger: { backgroundColor: "#f44336", color: "#fff" },
    };
    const style = { ...styles.base, ...(styles[variant] || styles.primary) };
    return (
        <button onClick={onClick} style={style} {...rest}>
            {children}
        </button>
    );
}

function Field({ label, children }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, color: "#666", fontWeight: 500 }}>
                {label}
            </label>
            {children}
        </div>
    );
}

/** Modal แบบ React */
function Modal({ title = "", open, onClose, children, footer }) {
    if (!open) return null;
    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: 420,
                    maxWidth: "90vw",
                    background: "#fff",
                    borderRadius: 10,
                    padding: 20,
                    boxShadow: "0 10px 20px rgba(0,0,0,.2)",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <h3 style={{ margin: 0, fontSize: 18 }}>{title}</h3>
                    <button onClick={onClose} style={{ border: "none", background: "transparent", fontSize: 22, color: "#999" }}>
                        ×
                    </button>
                </div>
                <div>{children}</div>
                {footer && <div style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "flex-end" }}>{footer}</div>}
            </div>
        </div>
    );
}

/** helper: headers สำหรับ JWT + cookie */
function useAuthHeaders() {
    return useMemo(() => {
        const token =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token") ||
            ""; // ถ้าเก็บใน cookie ฝั่ง server ก็ยังทำงานเพราะเราแนบ credentials
        const h = { Accept: "application/json" };
        if (token) h["Authorization"] = `Bearer ${token}`;
        return h;
    }, []);
}

export default function Setting() {
    const authHeaders = useAuthHeaders();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // โปรไฟล์จริงจาก backend
    const [admin, setAdmin] = useState(null);

    // โหมดแก้ไข + ฟอร์ม
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        fullName: "",
        nickName: "",
        email: "",
        avatarUrl: "",
    });

    // modal เพิ่มอีเมล
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");

    // โหลดโปรไฟล์ Admin
    // โหลดโปรไฟล์ Admin
    useEffect(() => {
        const loadAdminData = async () => {
            try {
                const token =
                    localStorage.getItem("token") || sessionStorage.getItem("token") || "";

                const res = await fetch(`${API_BASE}/api/admins/me`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const data = await res.json();
                console.log("✅ Admin data:", data);

                setAdmin(data);
                setForm({
                    fullName: data.username || data.name || "",
                    nickName: data.nickName || "",
                    email: data.email || "",
                    avatarUrl: data.avatarUrl || data.avatar || "",
                });
            } catch (err) {
                console.error("❌ Error loading admin:", err);
                setError("โหลดข้อมูลผู้ใช้ไม่สำเร็จ");
            } finally {
                setLoading(false);
            }
        };

        loadAdminData();
    }, []); // eslint-disable-line

    // eslint-disable-line

    const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const enterEdit = () => setEditMode(true);

    const cancelEdit = () => {
        if (admin) {
            setForm({
                fullName: admin.fullName ?? admin.name ?? "",
                nickName: admin.nickName ?? "",
                email: admin.email ?? "",
                avatarUrl: admin.avatarUrl || admin.avatar || "",
            });
        }
        setEditMode(false);
    };

    const save = async () => {
        if (!admin?.id) {
            alert("ไม่พบรหัสผู้ใช้");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/admins/${admin.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders },
                credentials: "include",
                body: JSON.stringify({
                    id: admin.id,
                    username: form.fullName, // 👈 ใช้แทน fullName
                    nickName: form.nickName,
                    email: form.email,
                    avatarUrl: form.avatarUrl,
                }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const updated = await res.json();
            setAdmin(updated);
            setEditMode(false);
            alert("บันทึกข้อมูลเรียบร้อย");
        } catch (e) {
            console.error(e);
            alert("บันทึกไม่สำเร็จ");
        } finally {
            setSaving(false);
        }
    };

    const addEmail = () => setEmailModalOpen(true);

    const confirmAddEmail = () => {
        const email = newEmail.trim();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            alert("กรุณากรอกอีเมลให้ถูกต้อง");
            return;
        }
        setForm((f) => ({ ...f, email })); // เดโม: ใช้แทนอีเมลหลักที่แสดง
        setNewEmail("");
        setEmailModalOpen(false);
        // ถ้าต้องการให้เก็บหลายอีเมล แนะนำ admin.emails: string[] แล้ว PUT กลับเป็น array ได้
    };

    if (loading) return <div style={{ padding: 24 }}>⏳ กำลังโหลดข้อมูล...</div>;
    if (error) return <div style={{ padding: 24, color: "red" }}>{error}</div>;
    if (!admin) return <div style={{ padding: 24 }}>ไม่พบข้อมูลผู้ดูแล</div>;

    const displayName = admin.fullName ?? admin.name ?? "Admin";
    const avatar = form.avatarUrl || "https://placehold.co/80x80/4caf50/ffffff?text=A";

    return (
        <div style={{ padding: 24, background: "#f7f7f7", borderRadius: 12 }}>
            {/* header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                    background: "#fff",
                    padding: "12px 16px",
                    borderRadius: 8,
                    boxShadow: "0 1px 3px rgba(0,0,0,.1)",
                }}
            >
                <div>
                    <h1 style={{ fontSize: 20, fontWeight: "bold", color: "#333", margin: 0 }}>Welcome, {displayName}</h1>
                    <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
                        {new Date().toLocaleDateString("th-TH", { dateStyle: "full" })}
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img
                        src={avatar}
                        alt="avatar"
                        style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "1px solid #eee" }}
                    />
                </div>
            </div>

            {/* content card */}
            <div style={{ background: "#fff", borderRadius: 8, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,.1)" }}>
                {/* header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img
                            src={avatar}
                            alt="profile"
                            style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "1px solid #eee" }}
                        />
                        <div>
                            <div style={{ fontWeight: 700, color: "#333" }}>{displayName}</div>
                            <div style={{ color: "#666", fontSize: 14 }}>{form.email}</div>
                        </div>
                    </div>

                    {!editMode ? (
                        <Button onClick={enterEdit}>Edit</Button>
                    ) : (
                        <div style={{ display: "flex", gap: 10 }}>
                            <Button onClick={save} disabled={saving}>
                                {saving ? "Saving..." : "Save"}
                            </Button>
                            <Button onClick={cancelEdit} variant="ghost">
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>

                {/* form */}
                {!editMode ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                        <Field label="Full Name">
                            <input
                                disabled
                                value={displayName}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #ddd",
                                    borderRadius: 6,
                                    background: "#f9f9f9",
                                }}
                            />
                        </Field>
                        <Field label="Nick Name">
                            <input
                                disabled
                                value={admin.nickName || ""}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #ddd",
                                    borderRadius: 6,
                                    background: "#f9f9f9",
                                }}
                            />
                        </Field>
                        <Field label="Avatar URL">
                            <input
                                disabled
                                value={form.avatarUrl}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #ddd",
                                    borderRadius: 6,
                                    background: "#f9f9f9",
                                }}
                            />
                        </Field>
                        <Field label="Email">
                            <div style={{ display: "flex", gap: 10 }}>
                                <input
                                    disabled
                                    value={form.email}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: "1px solid #ddd",
                                        borderRadius: 6,
                                        background: "#f9f9f9",
                                    }}
                                />
                                <Button onClick={addEmail} variant="info">
                                    + Add Email
                                </Button>
                            </div>
                        </Field>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                        <Field label="Full Name">
                            <input
                                name="fullName"
                                value={form.fullName}
                                onChange={onChange}
                                placeholder="Your full name"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #ddd",
                                    borderRadius: 6,
                                }}
                            />
                        </Field>
                        <Field label="Nick Name">
                            <input
                                name="nickName"
                                value={form.nickName}
                                onChange={onChange}
                                placeholder="Nickname"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #ddd",
                                    borderRadius: 6,
                                }}
                            />
                        </Field>
                        <Field label="Avatar URL">
                            <input
                                name="avatarUrl"
                                value={form.avatarUrl}
                                onChange={onChange}
                                placeholder="https://..."
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #ddd",
                                    borderRadius: 6,
                                }}
                            />
                        </Field>
                        <Field label="Email">
                            <div style={{ display: "flex", gap: 10 }}>
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={onChange}
                                    type="email"
                                    placeholder="you@example.com"
                                    style={{ flex: 1, padding: "12px 16px", border: "1px solid #ddd", borderRadius: 6 }}
                                />
                                <Button onClick={addEmail} variant="info">
                                    + Add Email
                                </Button>
                            </div>
                        </Field>
                    </div>
                )}
            </div>

            {/* Modal เพิ่มอีเมล */}
            <Modal
                title="Add Email Address"
                open={emailModalOpen}
                onClose={() => setEmailModalOpen(false)}
                footer={
                    <>
                        <Button onClick={() => setEmailModalOpen(false)} variant="ghost">
                            Cancel
                        </Button>
                        <Button onClick={confirmAddEmail}>Add</Button>
                    </>
                }
            >
                <Field label="Email Address">
                    <input
                        autoFocus
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={{ width: "100%", padding: "12px 16px", border: "1px solid #ddd", borderRadius: 6 }}
                    />
                </Field>
            </Modal>
        </div>
    );
}
