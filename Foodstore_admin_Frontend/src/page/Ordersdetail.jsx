import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import Swal
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const API_BASE = "";

export default function Ordersdetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ โหลดข้อมูลจาก backend
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/orders/${id}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setOrder(data);
            } catch (err) {
                console.error("Error fetching order:", err);
                setError("ไม่สามารถโหลดข้อมูลคำสั่งซื้อนี้ได้");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    // ✅ ฟังก์ชันอัปเดตสถานะ
    const updateOrderStatus = async (newStatus) => {
        if (!order) return;

        try {
            const result = await Swal.fire({
                title: `ยืนยันการเปลี่ยนสถานะเป็น ${newStatus}?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "ยืนยัน",
                cancelButtonText: "ยกเลิก",
                reverseButtons: true,
            });

            if (!result.isConfirmed) return;

            const res = await fetch(`${API_BASE}/api/orders/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                const errMsg = await res.text();
                Swal.fire({
                    icon: "error",
                    title: "อัปเดตสถานะไม่สำเร็จ",
                    text: errMsg || `ไม่สามารถอัปเดตสถานะได้ (HTTP ${res.status})`,
                });
                throw new Error(`HTTP ${res.status}`);
            }

            const updated = await res.json();
            setOrder(updated);

            Swal.fire({
                icon: "success",
                title: "อัปเดตสำเร็จ",
                text: `คำสั่งซื้อ #${order.id} ได้รับการอัปเดตเป็น "${newStatus}" แล้ว`,
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error("Error updating status:", err);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถติดต่อเซิร์ฟเวอร์เพื่ออัปเดตสถานะได้",
            });
        }
    };

    const handleDownloadInvoice = async () => {
        if (!order) return;

        // ✅ ตรวจสถานะก่อนดาวน์โหลด
        const status = order.status?.toUpperCase() || "PENDING";

        if (status === "PENDING") {
            Swal.fire({
                icon: "warning",
                title: "Order still pending",
                text: "This order is not completed yet. Please complete it before downloading the invoice.",
                confirmButtonText: "OK",
            });
            return; // ❌ หยุด ไม่ให้ดาวน์โหลด
        }

        if (status === "CANCELLED") {
            Swal.fire({
                icon: "error",
                title: "Order cancelled",
                text: "This order has been cancelled. Invoice cannot be generated.",
                confirmButtonText: "OK",
            });
            return; // ❌ หยุด ไม่ให้ดาวน์โหลด
        }

        // ✅ ถ้าผ่านเงื่อนไข (status = SUCCESS หรือ COMPLETE) → ทำต่อได้เลย
        const doc = new jsPDF({ unit: "pt", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = { left: 40, top: 45, right: 40 };

        // ---- Font setup ----
        const ensureFont = async () => {
            if (window.__fontReady) return;
            const res = await fetch("/fonts/THSarabunNew.ttf");
            const buf = await res.arrayBuffer();
            const bytes = new Uint8Array(buf);
            let binary = "";
            const chunk = 0x8000;
            for (let i = 0; i < bytes.length; i += chunk)
                binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
            const base64 = btoa(binary);
            doc.addFileToVFS("THSarabunNew.ttf", base64);
            doc.addFont("THSarabunNew.ttf", "THSarabunNew", "normal");
            window.__fontReady = true;
        };

        await ensureFont();
        doc.setFont("THSarabunNew", "normal");

        // ---------- HEADER ----------
        doc.setFontSize(18);
        doc.text("TAX INVOICE", pageWidth / 2, margin.top, { align: "center" });

        doc.setFontSize(11);
        const headerY = margin.top + 25;
        const metaStartX = pageWidth - margin.right - 230;

        const store = {
            name: "FOODSTORE CO., LTD.",
            address: "123/45 Example Road, Bangkok 10110",
            taxId: "Tax ID: 0123456789012",
            phone: "Tel: 02-123-4567",
        };

        const companyLines = [store.name, store.address, store.taxId, store.phone];
        companyLines.forEach((t, i) => doc.text(t, margin.left, headerY + i * 14));

        const createdAtStr = order.createdAt
            ? new Date(order.createdAt).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
            })
            : "-";

        const meta = [
            `Invoice No: INV-${String(order.id).padStart(5, "0")}`,
            `Issue Date: ${createdAtStr}`,
            `Order ID: #${order.id}`,
            `User ID: ${order.userId}`,
            `Status: ${order.status || "PENDING"}`,
        ];
        meta.forEach((t, i) => doc.text(t, metaStartX, headerY + i * 14));

        // ---------- TABLE ----------
        const items = (order.orderItems || []).map((it, idx) => {
            const unit = it.product?.price || 0;
            const qty = it.quantity || 0;
            const total = unit * qty;
            return [
                idx + 1,
                it.product?.name || "-",
                qty,
                unit.toLocaleString("en-US", { minimumFractionDigits: 2 }),
                total.toLocaleString("en-US", { minimumFractionDigits: 2 }),
            ];
        });

        const tableY = headerY + 14 * Math.max(companyLines.length, meta.length) + 20;

        autoTable(doc, {
            startY: tableY,
            head: [["#", "Product", "Qty", "Unit Price", "Total (THB)"]],
            body: items,
            styles: {
                font: "THSarabunNew",
                fontSize: 10,
                cellPadding: 4,
                lineWidth: 0.1,
            },
            headStyles: {
                fillColor: [69, 90, 100],
                textColor: 255,
                halign: "center",
                font: "THSarabunNew",
                fontSize: 9,
            },
            columnStyles: {
                0: { halign: "center", cellWidth: 40 },
                1: { halign: "left", cellWidth: 180 },
                2: { halign: "center", cellWidth: 70 },
                3: { halign: "right", cellWidth: 100 },
                4: { halign: "right", cellWidth: 100 },
            },
            theme: "grid",
            margin: { left: margin.left, right: margin.right },
        });

        // ---------- SUMMARY BOX ----------
        const y = doc.lastAutoTable.finalY + 15;
        const subTotal = (order.orderItems || []).reduce(
            (s, it) => s + (it.product?.price || 0) * (it.quantity || 0),
            0
        );
        const vatRate = 0.07;
        const vat = subTotal * vatRate;
        const grand = subTotal + vat;
        const formatMoney = (n) =>
            n.toLocaleString("en-US", { minimumFractionDigits: 2 });

        const tableRightEdge = pageWidth - margin.right;
        const boxW = 240;
        const boxH = 65;

        doc.setDrawColor(210);
        doc.rect(tableRightEdge - boxW, y - 8, boxW, boxH);

        const lines = [
            ["Subtotal", `${formatMoney(subTotal)} THB`],
            ["VAT (7%)", `${formatMoney(vat)} THB`],
            ["Total Amount", `${formatMoney(grand)} THB`],
        ];

        const textOffsetY = 6;
        doc.setFontSize(10.5);
        lines.forEach((row, i) => {
            const yy = y + textOffsetY + i * 20;
            doc.text(row[0], tableRightEdge - boxW + 10, yy);
            doc.text(row[1], tableRightEdge - 8, yy, { align: "right" });
        });

        // ---------- SIGNATURE AREA ----------
        const rightX = pageWidth - margin.right;
        const signY = y + boxH + 45;
        doc.setFontSize(11);
        doc.text("Prepared by", margin.left, signY);
        doc.text("Received by", rightX - 180, signY);

        const lineLength = 160;
        doc.line(margin.left, signY + 18, margin.left + lineLength, signY + 18);
        doc.line(rightX - 180, signY + 18, rightX - 180 + lineLength, signY + 18);

        doc.setFontSize(9);
        doc.text("(Signature)", margin.left + 60, signY + 34);
        doc.text("(Signature)", rightX - 115, signY + 34);

        // ---------- FOOTER ----------
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.text(
                `Page ${i} of ${pageCount}`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 20,
                { align: "center" }
            );
        }

        // ✅ ดาวน์โหลด PDF
        doc.save(`Invoice_Order#${order.id}.pdf`);
    };




    if (loading) return <div style={{ padding: 24 }}>⏳ กำลังโหลดข้อมูล...</div>;
    if (error) return <div style={{ padding: 24, color: "red" }}>{error}</div>;
    if (!order) return <div style={{ padding: 24 }}>ไม่พบข้อมูลคำสั่งซื้อ</div>;

    const filteredItems =
        order.orderItems?.filter((item) =>
            item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

    const totalPrice = filteredItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <div style={{ padding: 24, background: "#f7f7f7", borderRadius: 12 }}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                    backgroundColor: "white",
                    padding: "12px 16px",
                    borderRadius: 8,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#333" }}>
                    Order #{order.id}
                </h1>

                <div style={{ position: "relative", maxWidth: 250 }}>
                    <input
                        type="text"
                        placeholder="Search product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            paddingLeft: 35,
                            padding: "8px 12px",
                            border: "1px solid #ddd",
                            borderRadius: 6,
                            width: "70%",
                            fontSize: 14,
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 16,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{ borderBottom: "1px solid #eee" }}>
                        <th style={{ textAlign: "left", padding: "12px 8px" }}>Product</th>
                        <th style={{ textAlign: "left", padding: "12px 8px" }}>Quantity</th>
                        <th style={{ textAlign: "left", padding: "12px 8px" }}>Price</th>
                        <th style={{ textAlign: "left", padding: "12px 8px" }}>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                <td style={{ padding: "12px 8px", fontSize: 14 }}>
                                    {item.product?.name || "-"}
                                </td>
                                <td style={{ padding: "12px 8px", fontSize: 14 }}>
                                    {item.quantity}
                                </td>
                                <td style={{ padding: "12px 8px", fontSize: 14 }}>
                                    {item.product?.price?.toLocaleString()} บาท
                                </td>
                                <td style={{ padding: "12px 8px", fontSize: 14 }}>
                                    {(item.product?.price * item.quantity).toLocaleString()} บาท
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center", padding: 16 }}>
                                ไม่มีสินค้าในคำสั่งซื้อนี้
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* Order Summary */}
                <div
                    style={{
                        marginTop: 24,
                        padding: 24,
                        backgroundColor: "#f9f9f9",
                        borderRadius: 8,
                        border: "1px solid #eee",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666", fontSize: 14 }}>User ID</span>
                            <span style={{ color: "#333", fontSize: 14 }}>{order.userId}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666", fontSize: 14 }}>Created At</span>
                            <span style={{ color: "#333", fontSize: 14 }}>
                {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("th-TH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })
                    : "-"}
              </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666", fontSize: 14 }}>Status</span>
                            <span
                                style={{
                                    color:
                                        order.status === "SUCCESS"
                                            ? "#4CAF50"
                                            : order.status === "CANCELLED"
                                                ? "#FF6B6B"
                                                : "#FFA500",
                                    fontSize: 14,
                                    fontWeight: 500,
                                }}
                            >
                {order.status || "PENDING"}
              </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666", fontSize: 14 }}>Total</span>
                            <span style={{ color: "#333", fontSize: 14, fontWeight: 500 }}>
                {totalPrice.toLocaleString()} บาท
              </span>
                        </div>

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                            <button
                                onClick={() => navigate("/admin/orders")}
                                style={{
                                    backgroundColor: "transparent",
                                    color: "#1976d2",
                                    border: "1px solid #1976d2",
                                    borderRadius: 6,
                                    padding: "6px 12px",
                                }}
                            >
                                ← Back
                            </button>

                            <button
                                onClick={() => updateOrderStatus("SUCCESS")}
                                style={{
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "6px 12px",
                                }}
                            >
                                Complete
                            </button>

                            <button
                                onClick={() => updateOrderStatus("CANCELLED")}
                                style={{
                                    backgroundColor: "#FF6B6B",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "6px 12px",
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDownloadInvoice}
                                style={{
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "6px 12px",
                                }}
                            >
                                 Download Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
