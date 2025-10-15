import React, { useContext, useEffect, useState } from 'react';
import './Home.css';
import placeholder from '../assets/menupic/khao-man-kai.jpg';
import { CartContext } from '../context/CartContext';
import { listProducts } from '../api/products';

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
                                <div className="image-wrapper">
                                    <img
                                        src={item.imageUrl ?? placeholder}
                                        alt={item.name}
                                        className="product-image"
                                    />

                                    {item.stock <= 0 && (
                                        <div className="sold-out-overlay">
                                            <span
                                                className="sold-out-text"
                                                style={{
                                                    color: "red",
                                                    fontWeight: 800,
                                                    fontSize: 20,
                                                    border: "2px solid red",
                                                    padding: "6px 12px",
                                                    borderRadius: "8px",
                                                    backgroundColor: "rgba(255,255,255,0.85)",
                                                }}
                                            >
                                                SOLD OUT
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="menu-card-name">{item.name}</div>
                                <div className="menu-card-price">{item.price} THB</div>
                                <button
                                    className="add-to-cart-button"
                                    onClick={() => handleAdd(item)}
                                    disabled={item.stock <= 0}
                                >
                                    +1
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
