// src/pages/Home.jsx  (หรือไฟล์ที่เป็นหน้า Home ของคุณ)
import React, { useContext, useEffect, useState } from 'react';
import './Home.css';
import placeholder from '../assets/menupic/khao-man-kai.jpg'; // รูปสำรองถ้าไม่มี imageUrl จาก API
import { CartContext } from '../context/CartContext';
import { listProducts } from '../api/products'; // 👉 ใช้ API จริง

const Home = () => {
    const { addToCart } = useContext(CartContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        let ignore = false;
        listProducts()
            .then(data => { if (!ignore) setItems(Array.isArray(data) ? data : []); })
            .catch(e => { if (!ignore) setErr(e.message || 'Fetch failed'); })
            .finally(() => { if (!ignore) setLoading(false); });
        return () => { ignore = true; };
    }, []);

    const handleAdd = (p) => {
        // ทำให้ข้อมูลที่ส่งเข้า Cart เป็นฟอร์แมตเดียวกันเสมอ
        const cartItem = {
            id: p.id ?? p.productId ?? p.menuId,
            name: p.name,
            price: Number(p.price ?? 0),
            imageUrl: p.imageUrl ?? p.img ?? placeholder,
            quantity: 1,
        };
        addToCart(cartItem);
    };

    return (
        <div className="home-container">
            <div className="all-menus-header">
                <h1>ALL MENUS</h1>
            </div>

            <div className="menu-grid-container">
                {loading && <div style={{ padding: 24 }}>Loading...</div>}
                {err && !loading && <div style={{ padding: 24, color: 'red' }}>Error: {err}</div>}

                {!loading && !err && (
                    <div className="menu-grid">
                        {items.map((item) => (
                            <div className="menu-card" key={item.id ?? item.name}>
                                <img src={item.imageUrl ?? placeholder} alt={item.name} />
                                <div className="menu-card-name">{item.name}</div>
                                <div className="menu-card-price">{item.price} THB</div>
                                <button className="add-to-cart-button" onClick={() => handleAdd(item)}>+1</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
