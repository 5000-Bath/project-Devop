import React, { useEffect, useMemo, useState } from "react";

const STATUSES = ["ALL", "PENDING", "SUCCESS", "CANCELLED"];

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const ORDERS_URL = `${API_BASE}/api/orders`;

function formatThaiFromLocalInput(inputStr) {
  if (!inputStr) return "-";
  const iso = inputStr.replace(" ", "T") + "Z";
  const d = new Date(iso);
  if (isNaN(d)) return inputStr;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear() + 543;
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

const money = (n) =>
  Number(n || 0).toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const badgeClass = (s) =>
  ({
    SUCCESS: "badge ok",
    PENDING: "badge warn",
    CANCELLED: "badge bad",
  }[String(s).toUpperCase()] || "badge muted");

export default function History() {
  const [status, setStatus] = useState("ALL");
  const [q, setQ] = useState("");
  const [orders, setOrders] = useState([]);
  const [usedUrl, setUsedUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setErr("");

    (async () => {
      try {
        const url = `${ORDERS_URL}`;
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        const list = Array.isArray(raw?.content) ? raw.content : Array.isArray(raw) ? raw : [];
        if (!ignore) {
          setOrders(list);
          setUsedUrl(url);
          setLoading(false);
        }
      } catch (e) {
        if (!ignore) {
          setErr(e?.message || "Load failed");
          setOrders([]);
          setLoading(false);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const byStatus =
      status === "ALL"
        ? orders
        : orders.filter((o) => String(o.status).toUpperCase() === status);

    const bySearch = !needle
      ? byStatus
      : byStatus.filter((o) => {
          const txtItems = (o.orderItems || [])
            .map((it) => it?.product?.name || "")
            .join(" ")
            .toLowerCase();
          return (
            String(o.id ?? "").includes(needle) ||
            String(o.userId ?? "").includes(needle) ||
            String(o.status ?? "").toLowerCase().includes(needle) ||
            txtItems.includes(needle)
          );
        });

    return [...bySearch].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [orders, q, status]);

  const totals = useMemo(() => {
    let totalOrders = filtered.length;
    let totalItems = 0;
    let revenue = 0;
    for (const o of filtered) {
      const items = Array.isArray(o.orderItems) ? o.orderItems : [];
      for (const it of items) {
        const qty = Number(it?.quantity ?? 0);
        const price = Number(it?.product?.price ?? 0);
        totalItems += qty;
        if (String(o.status).toUpperCase() === "SUCCESS") revenue += qty * price;
      }
    }
    return { totalOrders, totalItems, revenue };
  }, [filtered]);

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          background: "#111",
          color: "#fff",
          borderRadius: 12,
          padding: "14px 18px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, letterSpacing: 1 }}>HISTORY</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                style={{
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: status === s ? "#e53935" : "#2f2f2f",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหา: เลขออเดอร์ / สินค้า / สถานะ / userId"
            style={{
              height: 38,
              borderRadius: 10,
              border: "1px solid #333",
              background: "#1a1a1a",
              color: "#fff",
              padding: "0 12px",
              minWidth: 260,
            }}
          />
          <button
            onClick={async () => {
              try {
                setLoading(true);
                const url = `${ORDERS_URL}`;
                const res = await fetch(url, { headers: { Accept: "application/json" } });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const raw = await res.json();
                const list = Array.isArray(raw?.content) ? raw.content : Array.isArray(raw) ? raw : [];
                setOrders(list);
                setUsedUrl(url);
              } catch (e) {
                setErr(e?.message || "Load failed");
              } finally {
                setLoading(false);
              }
            }}
            style={{
              height: 38,
              borderRadius: 10,
              border: "none",
              background: "#444",
              color: "#fff",
              padding: "0 14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0,1fr))",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <Stat title="Total Orders" value={totals.totalOrders} />
        <Stat title="Total Items" value={totals.totalItems} />
        <Stat title="Revenue (SUCCESS)" value={`฿ ${money(totals.revenue)}`} />
      </div>

      {loading && <div style={{ padding: 18 }}>Loading...</div>}
      {err && !loading && (
        <div style={{ padding: 18, color: "crimson", fontWeight: 700, wordBreak: "break-word" }}>
          Error: {String(err)}
        </div>
      )}

      {!loading && !err && (
        <div style={{ overflowX: "auto", background: "#fff", borderRadius: 12 }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: "#f4f5f7", textAlign: "left" }}>
                <TH w={120}>Order ID</TH>
                <TH w={130}>User</TH>
                <TH w={160}>Created</TH>
                <TH w={140}>Status</TH>
                <TH w={120} align="right">
                  Items
                </TH>
                <TH w={140} align="right">
                  Est. Total
                </TH>
                <TH w={100} align="center">
                  More
                </TH>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const items = Array.isArray(o.orderItems) ? o.orderItems : [];
                const totalItems = items.reduce((s, it) => s + Number(it.quantity ?? 0), 0);
                const totalPrice = items.reduce(
                  (s, it) => s + Number(it.quantity ?? 0) * Number(it?.product?.price ?? 0),
                  0
                );
                const opened = openId === o.id;

                return (
                  <React.Fragment key={o.id}>
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                      <TD>#{o.id}</TD>
                      <TD>{o.userId ?? "-"}</TD>
                      <TD>{formatThaiFromLocalInput(o.createdAt)}</TD>
                      <TD>
                        <span className={badgeClass(o.status)}>{o.status || "UNKNOWN"}</span>
                      </TD>
                      <TD align="right">{totalItems}</TD>
                      <TD align="right">฿ {money(totalPrice)}</TD>
                      <TD align="center">
                        <button
                          onClick={() => setOpenId(opened ? null : o.id)}
                          style={{
                            border: "none",
                            background: "#111",
                            color: "#fff",
                            padding: "8px 12px",
                            borderRadius: 8,
                            cursor: "pointer",
                          }}
                        >
                          {opened ? "Hide" : "Details"}
                        </button>
                      </TD>
                    </tr>

                    {opened && (
                      <tr>
                        <td colSpan={7} style={{ background: "#fafbfc", padding: 12 }}>
                          <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                              <colgroup>
                                <col style={{ width: "8%" }} />
                                <col style={{ width: "20%" }} />
                                <col style={{ width: "20%" }} />
                                <col style={{ width: "20%" }} />
                                <col style={{ width: "20%" }} />
                              </colgroup>
                              <thead>
                                <tr style={{ background: "#f0f2f5" }}>
                                  <th style={subTh("center")}>#</th>
                                  <th style={subTh("center")}>Product</th>
                                  <th style={subTh("center")}>Price</th>
                                  <th style={subTh("center")}>Qty</th>
                                  <th style={subTh("center")}>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {items.map((it, idx) => {
                                  const name = it?.product?.name ?? "(unknown)";
                                  const price = Number(it?.product?.price ?? 0);
                                  const qty = Number(it?.quantity ?? 0);
                                  return (
                                    <tr key={it.id || idx} style={{ borderTop: "1px solid #eee" }}>
                                      <td style={subTd("center")}>{idx + 1}</td>
                                      <td style={subTd("center")}>{name}</td>
                                      <td style={subTd("center")}>฿ {money(price)}</td>
                                      <td style={subTd("center")}>{qty}</td>
                                      <td style={subTd("center")}>฿ {money(price * qty)}</td>
                                    </tr>
                                  );
                                })}
                                {!items.length && (
                                  <tr>
                                    <td style={subTd("left")} colSpan={5}>
                                      No items
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          {usedUrl && (
                            <div style={{ marginTop: 8, color: "#888", fontSize: 12 }}>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {!filtered.length && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 24, color: "#888" }}>
                    No orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .badge{display:inline-block;padding:6px 10px;border-radius:8px;font-weight:700;font-size:12px}
        .ok{background:#e6ffed;color:#087443}
        .warn{background:#fff6e5;color:#8a5a00}
        .bad{background:#ffe9e9;color:#b00020}
        .muted{background:#f1f3f5;color:#666}
      `}</style>
    </div>
  );
}

function TH({ children, w, align = "left" }) {
  return (
    <th
      style={{
        padding: "12px 14px",
        fontWeight: 800,
        fontSize: 13,
        color: "#333",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        width: w ? `${w}px` : undefined,
        textAlign: align,
      }}
    >
      {children}
    </th>
  );
}
function TD({ children, align = "left" }) {
  return <td style={{ padding: "12px 14px", fontSize: 14, color: "#222", textAlign: align }}>{children}</td>;
}
function Stat({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "14px 16px",
        border: "1px solid #eee",
        boxShadow: "0 1px 2px rgba(0,0,0,.03)",
      }}
    >
      <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

const subTh = (align = "left") => ({
  padding: "10px 12px",
  fontWeight: 800,
  fontSize: 12,
  color: "#333",
  textAlign: align,
});
const subTd = (align = "left") => ({
  padding: "10px 12px",
  fontSize: 14,
  color: "#222",
  textAlign: align,
  fontVariantNumeric: "tabular-nums",
});