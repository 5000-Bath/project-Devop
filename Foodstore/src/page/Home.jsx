import { recentOrders, topProducts, inventoryAlerts } from "./mockOrders";

const stats = [
  { label: "Today Orders", value: 276 },
  { label: "Pending Orders", value: 30 },
  { label: "Fulfilled Orders", value: 245 },
  { label: "Cancelled Orders", value: 1 },
  { label: "Total Products", value: 40 },
  { label: "Out of Stock", value: 3 },
];

export default function Home() {
  return (
    <div style={{ background: "#ececec", minHeight: "100vh", padding: 0 }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#ececec",
        borderRadius: 0,
        padding: "8px 16px 0 16px",
        borderBottom: "4px solid #4b4444",
        marginBottom: 0,
        boxShadow: "none",
        height: 56,
      }}>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 20 }}>Dashboard</h2>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Welcome&nbsp; Back!&nbsp; Mr. First</span>
      </div>
      {/* Stat + Chart Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr) 1.2fr",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 22,
          margin: "24px"
        }}
      >
        {/* 6 stat cards */}
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: "28px 18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              fontSize: 20,
              fontWeight: 900,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              gridColumn: ((i % 3) + 1),
              gridRow: Math.floor(i / 3) + 1
            }}
          >
            <span style={{ fontWeight: 700 }}>{s.label}</span>
            <span style={{ fontSize: 24, fontWeight: 600, marginTop: 8 }}>{s.value}</span>
          </div>
        ))}
        {/* Chart (rowSpan 2) */}
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            gridColumn: 4,
            gridRow: "1 / span 2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 230,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <img
            src="https://media.discordapp.net/attachments/1218905628760739851/1411679332702617662/image.png?ex=68b58854&is=68b436d4&hm=fd3cd69c360e3a3484dea01368e36e7bd99b2683ca287f64bdc797c0764b9146&=&format=webp&quality=lossless"
            alt="chart"
            style={{ width: "80%", minHeight: 180, objectFit: "contain" }}
          />
        </div>
      </div>

      {/* Recent Orders & Top Products/Inventory Alerts */}
      <div style={{ display: "grid", gridTemplateColumns: "2.3fr 1fr", gap: 24, margin: "0 32px 32px 32px" }}>
        {/* Recent Orders */}
        <div style={{
          background: "#fff",
          borderRadius: 18,
          padding: 18,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <h3 style={{ marginBottom: 15 }}>Recent Orders</h3>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            <tbody>
              {recentOrders.map((o, idx) => (
                <tr key={idx} style={{ height: 42 }}>
                  <td>
                    <img src={o.avatar} alt="avatar" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                  </td>
                  <td style={{ fontWeight: 600, paddingLeft: 10, whiteSpace: "nowrap" }}>{o.date}</td>
                  <td style={{ fontWeight: 600, paddingLeft: 16 }}>{o.price}</td>
                  <td style={{ fontWeight: 600, color: o.statusColor, paddingLeft: 16 }}>{o.status}</td>
                  <td style={{ paddingLeft: 16 }}>
                    <img src={o.productImg} alt="food" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} />
                  </td>
                  <td>
                    <button style={{
                      background: "none",
                      border: "none",
                      color: "#111",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: 0,
                    }}>more</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Top Products & Inventory Alerts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Top Products */}
          <div style={{
            background: "#fff",
            borderRadius: 18,
            padding: 18,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <h3 style={{ marginBottom: 24 }}>Top Products</h3>
            <ol style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}>
              {topProducts.map((p, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "left",
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  <span style={{
                    fontWeight: 700,
                    fontSize: 22,
                    minWidth: 32,
                    display: "inline-block",
                    textAlign: "right",
                  }}>{i + 1}.</span>
                  <span style={{
                    marginLeft: 20,
                    fontWeight: 700,
                    fontSize: 20,
                  }}>{p}</span>
                </li>
              ))}
            </ol>
          </div>
          {/* Inventory Alerts */}
          <div style={{
            background: "#fff",
            borderRadius: 18,
            padding: 18,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <h3 style={{ marginBottom: 10 }}>Inventory Alerts</h3>
            <table style={{ width: "100%", fontWeight: 700, fontSize: 20, borderCollapse: "separate", borderSpacing: "0 16px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", fontWeight: 700, fontSize: 16, background: "none", border: "none" }}></th>
                  <th style={{ textAlign: "left", fontWeight: 700, fontSize: 16, background: "none", border: "none" }}></th>
                  <th style={{ textAlign: "right", fontWeight: 700, fontSize: 16, background: "none", border: "none" }}>
                    Values
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventoryAlerts.map((item, i) => (
                  <tr key={item.name} style={{ height: 40 }}>
                    <td style={{
                      fontWeight: 700,
                      fontSize: 20,
                      textAlign: "right",
                      width: 30,
                      paddingRight: 10
                    }}>{i + 1}.</td>
                    <td style={{
                      fontWeight: 700,
                      fontSize: 20,
                      paddingLeft: 10,
                      paddingRight: 10,
                      whiteSpace: "nowrap"
                    }}>{item.name}</td>
                    <td style={{
                      color: "#d80000",
                      textAlign: "right",
                      fontWeight: 700,
                      fontSize: 20,
                      width: 40,
                      paddingLeft: 20
                    }}>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}