import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function About() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

    // อยู่ในฟังก์ชัน Component
    const navigate = useNavigate();

    // Mock data for menu items
    const menuItems = [
        {
            id: 1111,
            name: "飛鶴海雞卵",
            description: "Fringilla Fusce Elit",
            price: 75.00,
            value: 492,
            category: "Appetizer"
        },
        {
            id: 1112,
            name: "星巴克",
            description: "Lorem Ornare",
            price: 43.27,
            value: 154,
            category: "Beverage"
        },
        {
            id: 1113,
            name: "紅油抄手",
            description: "Venenatis Mollis",
            price: 246.00,
            value: 453,
            category: "Main Course"
        },
        {
            id: 1114,
            name: "星巴克",
            description: "Ullamcor per",
            price: 87.00,
            value: 883,
            category: "Beverage"
        },
        {
            id: 1115,
            name: "三高巧福",
            description: "Bibendum",
            price: 82.06,
            value: 922,
            category: "Dessert"
        },
        {
            id: 1116,
            name: "藍家割包",
            description: "Magna Malesuada",
            price: 214.27,
            value: 561,
            category: "Sandwich"
        },
        {
            id: 1117,
            name: "五十嵐",
            description: "Quam",
            price: 54.05,
            value: 540,
            category: "Beverage"
        },
        {
            id: 1118,
            name: "金酷餅餡餅",
            description: "Fringilla Fusce Elit",
            price: 75.00,
            value: 130,
            category: "Snack"
        },
        {
            id: 1119,
            name: "窯烤食堂",
            description: "Ridiculus",
            price: 226.20,
            value: 816,
            category: "Main Course"
        }
    ];

    // Filter items based on search term
    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: 24, background: "#f7f7f7", borderRadius: 12 }}>
            <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>Menu</h1>

            {/* Header with search */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                backgroundColor: 'white',
                padding: '12px 16px',
                borderRadius: 8,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    position: 'relative',
                    flex: 1,
                    maxWidth: 300
                }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            paddingLeft: 35,
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: 6,
                            width: '100%',
                            fontSize: 14
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 16,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>Name</th>
                            <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>ID</th>
                            <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>Description</th>
                            <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>Price Per Menu</th>
                            <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>Value</th>
                            <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 14, color: '#666', fontWeight: 500 }}>Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => (
                            <tr
                                key={item.id}
                                style={{
                                    borderBottom: '1px solid #f0f0f0',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                onClick={() => setSelectedItem(item)}
                            >
                                <td style={{ padding: '12px 8px', fontSize: 14, fontWeight: 500, color: '#333' }}>{item.name}</td>
                                <td style={{ padding: '12px 8px', fontSize: 14, color: '#666' }}>{item.id}</td>
                                <td style={{ padding: '12px 8px', fontSize: 14, color: '#666' }}>{item.description}</td>
                                <td style={{ padding: '12px 8px', fontSize: 14, color: '#666' }}>{item.price.toFixed(2)} บาท</td>
                                <td style={{ padding: '12px 8px', fontSize: 14, color: '#666' }}>{item.value}</td>
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedItem(item);
                                        }}
                                    >
                                        More Info
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Add Item Button at bottom */}
                <div style={{
                    marginTop: 16,
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={() => navigate('/admin/add-item')}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            padding: '8px 16px',
                            fontSize: 14,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            style={{ width: 16, height: 16 }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Item
                    </button>
                </div>
            </div>

            {/* Modal */}
            {selectedItem && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: 8,
                        padding: 24,
                        width: 400,
                        maxWidth: '90vw'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: 16
                        }}>
                            <h3 style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: '#333'
                            }}>{selectedItem.name}</h3>
                            <button
                                onClick={() => setSelectedItem(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: 24,
                                    cursor: 'pointer',
                                    color: '#999'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', marginBottom: 8 }}>
                                <span style={{ color: '#666', width: 80 }}>ID:</span>
                                <span style={{ fontWeight: 500 }}>{selectedItem.id}</span>
                            </div>
                            <div style={{ display: 'flex', marginBottom: 8 }}>
                                <span style={{ color: '#666', width: 80 }}>Description:</span>
                                <span style={{ fontWeight: 500 }}>{selectedItem.description}</span>
                            </div>
                            <div style={{ display: 'flex', marginBottom: 8 }}>
                                <span style={{ color: '#666', width: 80 }}>Price:</span>
                                <span style={{ fontWeight: 500 }}>{selectedItem.price.toFixed(2)} €</span>
                            </div>
                            <div style={{ display: 'flex', marginBottom: 8 }}>
                                <span style={{ color: '#666', width: 80 }}>Value:</span>
                                <span style={{ fontWeight: 500 }}>{selectedItem.value}</span>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <span style={{ color: '#666', width: 80 }}>Category:</span>
                                <span style={{ fontWeight: 500 }}>{selectedItem.category}</span>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: 12
                        }}>
                            <button style={{
                                flex: 1,
                                backgroundColor: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: 6,
                                padding: '10px 16px',
                                fontSize: 14,
                                cursor: 'pointer'
                            }}>
                                Edit
                            </button>
                            <button style={{
                                backgroundColor: '#d32f2f',
                                color: 'white',
                                border: 'none',
                                borderRadius: 6,
                                padding: '10px 16px',
                                fontSize: 14,
                                cursor: 'pointer'
                            }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}