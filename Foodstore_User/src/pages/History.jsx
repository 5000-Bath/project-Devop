import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./History.css";

const STATUSES = ["ALL", "PENDING", "SUCCESS", "CANCELLED"];


const ORDERS_URL = `/api/orders`;

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
  const { user, isAuthed, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [status, setStatus] = useState("ALL");
  const [q, setQ] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthed) {
      navigate("/login?redirect=/history");
    }
  }, [isAuthed, authLoading, navigate]);

  const fetchOrders = async () => {
    if (!isAuthed) return;
    
    setLoading(true);
    setErr("");

    try {
      console.log("🔍 Fetching orders for user:", user?.username); 
      
      const res = await fetch(ORDERS_URL, {
        method: "GET",
        credentials: "include", 
        headers: { 
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      
      console.log("📡 Response status:", res.status); 
      
      if (!res.ok) {
        if (res.status === 401) {
          console.error("❌ 401 Unauthorized - redirecting to login");
          navigate("/login?redirect=/history");
          return;
        }
        if (res.status === 403) {
          console.error("❌ 403 Forbidden - access denied");
          throw new Error("Access denied. Please check your permissions.");
        }
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log("📦 Received data:", data); 

      const list = Array.isArray(data) ? data : Array.isArray(data?.orders) ? data.orders : [];
      
      console.log(`✅ Loaded ${list.length} orders for user ${user?.username}`); 

      if (user?.id) {
        const invalidOrders = list.filter(o => o.userId !== user.id);
        if (invalidOrders.length > 0) {
          console.error("⚠️ Warning: Received orders from other users:", invalidOrders);
          const validOrders = list.filter(o => o.userId === user.id);
          setOrders(validOrders);
          return;
        }
      }
      
      setOrders(list);
    } catch (e) {
      console.error("❌ Failed to load orders:", e);
      setErr(e?.message || "Load failed");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthed && user) {
      console.log("🚀 User authenticated, fetching orders..."); 
      fetchOrders();
    }
  }, [isAuthed, user?.id]); 

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

  function writeCartToStorage(items) {
    try {
      localStorage.setItem("cart", JSON.stringify(items || []));
    } catch {}
  }

  function buildCartFromOrder(order) {
    const list = Array.isArray(order?.orderItems) ? order.orderItems : [];
    return list
      .map((it) => ({
        productId: it?.product?.id ?? it?.productId ?? it?.id ?? null,
        name: it?.product?.name ?? "(unknown)",
        price: Number(it?.product?.price ?? 0),
        imageUrl: it?.product?.imageUrl ?? it?.product?.image ?? "",
        quantity: Number(it?.quantity ?? 0),
      }))
      .filter((x) => x.productId && x.quantity > 0);
  }

  function handleReorder(order) {
    const cartItems = buildCartFromOrder(order);
    writeCartToStorage(cartItems);
    try {
      localStorage.setItem("cartMeta", JSON.stringify({ fromOrderId: order?.id }));
    } catch {}
    navigate("/Order");
  }

  if (authLoading) {
    return (
      <div className="history-page">
        <div className="hist-loading">Checking authentication...</div>
      </div>
    );
  }

  if (!isAuthed) {
    return null;
  }

  return (
    <div className="history-page">
      {/* Header */}
      <div className="history-header">
        <div className="history-left">
          <h1>HISTORY</h1>
          <div className="history-tabs">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`hist-tab ${status === s ? "active" : ""}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="history-actions">
          <input
            className="hist-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหา: เลขออเดอร์ / สินค้า / สถานะ"
          />
          <button
            className="btn btn-dark"
            onClick={fetchOrders}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {loading && <div className="hist-loading">Loading...</div>}
      {err && !loading && <div className="hist-error">Error: {String(err)}</div>}

      {!loading && !err && (
        <div className="table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th style={{ width: 120 }}>Order ID</th>
                <th style={{ width: 160 }}>Created</th>
                <th style={{ width: 140 }}>Status</th>
                <th className="ta-right" style={{ width: 120 }}>Items</th>
                <th className="ta-right" style={{ width: 140 }}>Est. Total</th>
                <th className="ta-center" style={{ width: 180 }}>More</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const items = Array.isArray(o.orderItems) ? o.orderItems : [];
                const totalItems = items.reduce((s, it) => s + Number(it.quantity ?? 0), 0);
                const subtotal = items.reduce(
                  (s, it) => s + Number(it.quantity ?? 0) * Number(it?.product?.price ?? 0),
                  0
                );
                const finalAmount = o.finalAmount ?? subtotal;
                const discountAmount = o.discountAmount ?? 0;
                const opened = openId === o.id;

                return (
                  <React.Fragment key={o.id}>
                    <tr>
                      <td>#{o.id}</td>
                      <td>{formatThaiFromLocalInput(o.createdAt)}</td>
                      <td>
                        <span className={badgeClass(o.status)}>{o.status || "UNKNOWN"}</span>
                      </td>
                      <td className="ta-right">{totalItems}</td>
                      <td className="ta-right">
                        {discountAmount > 0 && (
                          <span className="discount-applied" title={`ส่วนลด ${money(discountAmount)} บาท`}>
                            -฿{money(discountAmount)}
                          </span>
                        )}
                        <span className="final-price">฿ {money(finalAmount)}</span>
                      </td>
                      <td className="ta-center">
                        <div className="btn-group">
                          <button
                            className="btn btn-outline"
                            onClick={() => handleReorder(o)}
                            title="เพิ่มสินค้าชุดนี้ลงตะกร้าและไปหน้า Order"
                          >
                            Reorder
                          </button>
                          <button
                            className="btn btn-dark"
                            onClick={() => setOpenId(opened ? null : o.id)}
                          >
                            {opened ? "Hide" : "Details"}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {opened && (
                      <tr>
                        <td colSpan={6} className="details-cell">
                          <div className="details-wrap">
                            <table className="hist-items">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Product</th>
                                  <th className="ta-right">Price</th>
                                  <th className="ta-center">Qty</th>
                                  <th className="ta-right">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {items.map((it, idx) => {
                                  const name = it?.product?.name ?? "(unknown)";
                                  const price = Number(it?.product?.price ?? 0);
                                  const qty = Number(it?.quantity ?? 0);
                                  return (
                                    <tr key={it.id || idx}>
                                      <td>{idx + 1}</td>
                                      <td className="ta-left">{name}</td>
                                      <td className="ta-right">฿ {money(price)}</td>
                                      <td className="ta-center">{qty}</td>
                                      <td className="ta-right">฿ {money(price * qty)}</td>
                                    </tr>
                                  );
                                })}
                                {!items.length && (
                                  <tr>
                                    <td colSpan={5} className="ta-left">No items</td>
                                  </tr>
                                )}
                                {discountAmount > 0 && (
                                  <>
                                    <tr className="summary-row">
                                      <td colSpan="4" className="ta-right">Subtotal</td>
                                      <td className="ta-right">฿ {money(subtotal)}</td>
                                    </tr>
                                    <tr className="summary-row">
                                      <td colSpan="4" className="ta-right">Discount ({o.couponCode})</td>
                                      <td className="ta-right">- ฿ {money(discountAmount)}</td>
                                    </tr>
                                  </>
                                )}
                                <tr className="summary-row total-row">
                                  <td colSpan="4" className="ta-right">Total</td>
                                  <td className="ta-right">฿ {money(finalAmount)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {!filtered.length && (
                <tr>
                  <td colSpan={6} className="hist-empty ta-center">
                    {q.trim() ? "ไม่พบออเดอร์ที่ค้นหา" : "ยังไม่มีออเดอร์"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}