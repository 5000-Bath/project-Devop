import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "../styles/AdminDashboard.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:8080";

// helpers
const fmtTH = (d) => new Date(d).toLocaleString("th-TH");
const money = (n) => `฿${Number(n ?? 0).toLocaleString("th-TH", { maximumFractionDigits: 2 })}`;
const norm = (s) => (s || "").toString().trim().toUpperCase();
const isPending = (s) => ["PENDING","AWAITING_PAYMENT","PROCESSING"].includes(norm(s));
const isDone    = (s) => ["FULFILLED","COMPLETED","DELIVERED","SUCCESS"].includes(norm(s));
const isCancel  = (s) => ["CANCELLED","CANCELED","VOID"].includes(norm(s));

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    const load = async () => {
        try {
            const [o, p] = await Promise.all([
                axios.get(`${API_BASE}/api/orders`),
                axios.get(`${API_BASE}/api/products`),
            ]);
            setOrders(o.data || []);
            setProducts(p.data || []);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { load(); }, []);

    // ===== summary cards =====
    const summary = useMemo(() => {
        const today = new Date();
        const sameDay = (a,b) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
        const todayOrders   = orders.reduce((acc,o)=> acc + (sameDay(new Date(o.createdAt||o.date), today)?1:0), 0);
        const pendingOrders = orders.filter(o=>isPending(o.status)).length;
        const fulfilled     = orders.filter(o=>isDone(o.status)).length;
        const cancelled     = orders.filter(o=>isCancel(o.status)).length;
        const totalProducts = products.length;
        const outOfStock    = products.filter(p => Number(p.stock ?? 0) <= 0).length;
        return { todayOrders, pendingOrders, fulfilled, cancelled, totalProducts, outOfStock };
    }, [orders, products]);

    // ===== recent 10 =====
    const recent10 = useMemo(() => {
        const sorted = [...orders].sort(
            (a,b)=> new Date(b.createdAt||b.date) - new Date(a.createdAt||a.date)
        );
        return sorted.slice(0,10);
    }, [orders]);

    // ===== top 3 products by qty =====
    const top3 = useMemo(() => {
        const tally = new Map();
        const nameById = new Map(products.map(p=>[p.id??p.productId, p.name]));
        orders.forEach(o=>{
            (o.orderItems || o.items || []).forEach(it=>{
                const qty = Number(it.quantity ?? it.qty ?? 0) || 0;
                const pid = it.productId ?? it.product?.id ?? it.product?.productId;
                const name = it.product?.name ?? nameById.get(pid) ?? it.name ?? `#${pid??"unknown"}`;
                const cur = tally.get(name) || 0;
                tally.set(name, cur + qty);
            });
        });
        return [...tally.entries()].sort((a,b)=>b[1]-a[1]).slice(0,3);
    }, [orders, products]);

    // ===== inventory alerts (<3) max 3 =====
    const alerts = useMemo(() => {
        return products
            .map(p=>({ id:p.id??p.productId, name:p.name, stock:Number(p.stock ?? p.quantity ?? 0) || 0 }))
            .filter(p=> p.stock < 3)
            .sort((a,b)=> a.stock - b.stock)
            .slice(0,3);
    }, [products]);

    // ===== chart: orders last 8 points (demo with counts) =====
    const chartData = useMemo(()=>{
        const days = [...Array(8)].map((_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(7-i)); return d;});
        const counts = days.map(d => orders.reduce((acc,o)=>{
            const od = new Date(o.createdAt||o.date);
            const same = od.getFullYear()===d.getFullYear() && od.getMonth()===d.getMonth() && od.getDate()===d.getDate();
            return acc + (same?1:0);
        },0));
        return {
            labels: days.map(d => d.toLocaleDateString("th-TH",{ day:"numeric"})),
            datasets: [{
                label: "จำนวนออเดอร์",
                data: counts,
                borderColor: "#2a68ff",
                backgroundColor: "rgba(42,104,255,0.18)",
                pointBorderWidth: 2,
                tension: 0.35,
                fill: true,
            }],
        };
    },[orders]);

    return (
        <div className="dashboard">
            <div className="dash-head">
                <h2>Dashboard</h2>
                <button className="btn" onClick={load}>Refresh</button>
            </div>

            {/* cards */}
            <div className="cards">
                <Card title="Today Orders" value={summary.todayOrders}/>
                <Card title="Pending Orders" value={summary.pendingOrders}/>
                <Card title="Fulfilled Orders" value={summary.fulfilled}/>
                <Card title="Cancelled Orders" value={summary.cancelled}/>
                <Card title="Total Products" value={summary.totalProducts}/>
                <Card title="Out of Stock" value={summary.outOfStock}/>
            </div>

            {/* chart */}
            <div className="card chart">
                <Line data={chartData} options={{ responsive:true, maintainAspectRatio:false, scales:{y:{beginAtZero:true}} }}/>
            </div>

            {/* bottom layout */}
            <div className="bottom">
                {/* Recent Orders (ซ้าย) */}
                <div className="card wide recent-block">
                    <h4>🧾 Recent Orders</h4>
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>วันที่เวลา</th>
                                <th className="right">ราคารวม</th>
                                <th>สถานะ</th>
                                <th className="center">More</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recent10.map(o => (
                                <tr key={o.id}>
                                    <td>{fmtTH(o.createdAt || o.date)}</td>
                                    <td className="right">{money(o.totalPrice ?? o.total ?? o.amount)}</td>
                                    <td>
                <span
                    className={
                        "badge " +
                        (isPending(o.status)
                            ? "warn"
                            : isDone(o.status)
                                ? "ok"
                                : isCancel(o.status)
                                    ? "bad"
                                    : "muted")
                    }
                >
                  {o.status || "UNKNOWN"}
                </span>
                                    </td>
                                    <td className="center">
                                        <Link
                                            to={`/admin/orders/orders-detail/${o.id}`}
                                            className="btn small"
                                        >
                                            More
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {!recent10.length && (
                                <tr>
                                    <td colSpan="4" className="center muted">
                                        No recent orders
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <p className="footnote">
                        * แสดงเฉพาะ 10 ออเดอร์ล่าสุด — เมื่อมีออเดอร์ใหม่ ลำดับ 11 รายการที่เก่าสุดจะไม่แสดงบน
                        Dashboard
                    </p>
                </div>

                {/* กลุ่มขวา: Top + Inventory Alerts ซ้อนใน column เดียวกัน */}
                <div className="side-column">
                    <div className="card">
                        <h4>🍔 Top Products</h4>
                        <ul className="list">
                            {top3.map(([name, qty], i) => (
                                <li key={name} className="row">
            <span>
              {i + 1}. {name}
            </span>
                                    <span className="muted">{qty} sold</span>
                                </li>
                            ))}
                            {!top3.length && <li className="muted">No data</li>}
                        </ul>
                    </div>

                    <div className="card">
                        <h4>⚠️ Inventory Alerts</h4>
                        <ul className="list">
                            {alerts.map((p, i) => (
                                <li key={p.id} className="row">
            <span>
              {i + 1}. {p.name}
            </span>
                                    <span
                                        className={`stock ${p.stock < 1 ? "danger" : ""}`}
                                    >{`${p.stock} left`}</span>
                                </li>
                            ))}
                            {!alerts.length && (
                                <li className="muted">All stocks are sufficient</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
}

function Card({title,value}) {
    return (
        <div className="card mini">
            <p className="title">{title}</p>
            <div className="value">{Number(value ?? 0).toLocaleString("th-TH")}</div>
        </div>
    );
}
