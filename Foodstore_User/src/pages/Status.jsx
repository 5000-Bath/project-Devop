// src/pages/Menu.jsx
// export default function Menu() {
//     return (
//       <div style={{ padding: 24, background: "#f7f7f7", borderRadius: 12 }}>
//         <h1>Menu</h1>
//         <p>รายการอาหารจะมาอยู่ตรงนี้</p>
//       </div>
//     );
//   }
  
// src/pages/Status.jsx
export default function Status() {
    const order = {
      id: "MYBROAKE<3RRQ",
      status: "Pending",
      events: [
        { icon: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png", title: "Order Received", time: "Feb 2, 2025 19:28" },
        { icon: "https://cdn-icons-png.flaticon.com/512/3480/3480527.png", title: "Cooking Order", time: "Feb 2, 2025 19:40" },
        { icon: "https://cdn-icons-png.flaticon.com/512/845/845646.png",   title: "Order Finished", time: "" },
      ],
      items: [
        { name: "ข้าวมันไก่โกเอต", price: 50,  img: "https://picsum.photos/seed/chicken/120/90" },
        { name: "เป็ดย่างโสโลโก้อง", price: 120, img: "https://picsum.photos/seed/duck/120/90" },
      ],
      deliveryFee: 40,
      discount: 0,
      currency: "THB",
    };
  
    const subtotal = order.items.reduce((s, it) => s + it.price, 0);
    const total = subtotal + order.deliveryFee - order.discount;
  
    const styles = {
      page:   { maxWidth: 1200, margin: "0 auto", padding: 24 },
      grid:   { display: "grid", gridTemplateColumns: "1fr 420px", gap: 24, alignItems: "start" },
      // left
      head:   { display: "flex", alignItems: "center", gap: 10, marginBottom: 6 },
      bar:    { width: 6, height: 28, background: "#f59e0b", borderRadius: 6 },
      sub:    { color: "#4b5563", fontWeight: 700, marginTop: 6 },
      event:  { display: "grid", gridTemplateColumns: "48px 1fr", gap: 16, alignItems: "center", margin: "26px 0" },
      icon:   { width: 40, height: 40, objectFit: "contain", opacity: 0.8 },
      // right summary
      card:   { background: "#f2e4b3", borderRadius: 12, padding: 24, border: "1px solid #eadca1", position: "sticky", top: 16 },
      title:  { margin: 0, fontSize: 26, fontWeight: 800 },
      line:   { height: 1, background: "#e6d99e", margin: "16px 0" },
      row:    { display: "grid", gridTemplateColumns: "84px 1fr auto", gap: 12, alignItems: "center", padding: "10px 0" },
      thumb:  { width: 84, height: 64, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" },
      price:  { fontWeight: 800 },
      meta:   { display: "grid", gridTemplateColumns: "1fr auto", gap: 8, rowGap: 10, color: "#111" },
      label:  { color: "#374151" },
      total:  { fontWeight: 900, fontSize: 18 },
    };
  
    return (
      <div style={styles.page}>
        <div style={styles.grid}>
  
          {/* LEFT: timeline */}
          <section>
            <div style={styles.head}>
              <div style={styles.bar}></div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>
                Order Status : {order.status}
              </h1>
            </div>
            <div style={styles.sub}>
              #Your Order ID : {order.id}
            </div>
  
            <div style={{ marginTop: 18 }}>
              {order.events.map((ev, i) => (
                <div key={i} style={styles.event}>
                  <img src={ev.icon} alt="" style={styles.icon} />
                  <div>
                    <div style={{ fontWeight: 800 }}>{ev.title}</div>
                    {ev.time && <div style={{ color: "#374151", fontWeight: 700 }}>{ev.time}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
  
          {/* RIGHT: summary */}
          <aside style={styles.card}>
            <h2 style={styles.title}>Order Summary</h2>
            <div style={styles.line}></div>
  
            {/* Items */}
            <div>
              {order.items.map((it, i) => (
                <div key={i} style={styles.row}>
                  <img src={it.img} alt={it.name} style={styles.thumb} />
                  <div>{it.name}</div>
                  <div style={styles.price}>{it.price} {order.currency}</div>
                </div>
              ))}
            </div>
  
            <div style={styles.line}></div>
  
            {/* Totals */}
            <div style={styles.meta}>
              <div style={styles.label}>Delivery Fee</div>
              <div>{order.deliveryFee} {order.currency}</div>
  
              <div style={styles.label}>Discount</div>
              <div>{order.discount} {order.currency}</div>
  
              <div style={{ ...styles.label, fontWeight: 900 }}>Total Price</div>
              <div style={styles.total}>{total} {order.currency}</div>
            </div>
          </aside>
        </div>
      </div>
    );
  }
  