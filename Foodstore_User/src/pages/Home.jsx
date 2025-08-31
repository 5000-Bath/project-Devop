// src/pages/Home.jsx
import { useState } from "react";

const ITEMS = [
  { id: 1, name: "Chicken Rice", price: 49, img: "https://picsum.photos/seed/rice/120/120" },
  { id: 2, name: "Spicy Salad",  price: 59, img: "https://picsum.photos/seed/salad/120/120" },
  { id: 3, name: "Pork Noodle",  price: 45, img: "https://picsum.photos/seed/noodle/120/120" },
  { id: 4, name: "Iced Tea",     price: 25, img: "https://picsum.photos/seed/tea/120/120" },
];

export default function Home() {
  const [cart, setCart] = useState({}); // { [id]: qty }

  const add = (id) =>
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));

  const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = ITEMS.reduce((sum, it) => sum + (cart[it.id] || 0) * it.price, 0);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ margin: "8px 0 16px", fontSize: 28 }}>ALL MENUS</h2>

      {/* Summary */}
      <div style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        marginBottom: 16,
        padding: "10px 12px",
        background: "#f5f5f5",
        borderRadius: 10
      }}>
        <b>Cart:</b>
        <span>{totalQty} item(s)</span>
        <span>•</span>
        <span>Total: ฿{totalPrice}</span>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {ITEMS.map((it) => (
          <div key={it.id} style={{
            border: "1px solid #e6e6e6",
            borderRadius: 12,
            background: "#fff",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}>
            <img
              src={it.img}
              alt={it.name}
              width={200}
              height={200}
              style={{ width: "100%", height: 160, objectFit: "cover" }}
            />
            <div style={{ padding: 12, display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 700 }}>{it.name}</div>
              <div style={{ color: "#444" }}>฿{it.price}</div>

              <button
                onClick={() => add(it.id)}
                style={{
                  marginTop: 6,
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: 8,
                  background: "#e11d48",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                +1 ({cart[it.id] || 0})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
