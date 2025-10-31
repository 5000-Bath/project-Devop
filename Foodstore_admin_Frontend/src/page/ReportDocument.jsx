// ReportDocument.jsx (ฉบับแก้ไขความปลอดภัยเรื่อง border)
import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font,
} from "@react-pdf/renderer";
import { fmtTH, money } from "../utils/formatters"; 

Font.register({
    family: "THSarabunNew",
    src: "/fonts/THSarabunNew.ttf", 
});

// 2. กำหนดสไตล์สำหรับ PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#fff",
        padding: 30,
        fontFamily: "THSarabunNew", 
        fontSize: 10,
    },
    header: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center",
        textDecoration: "underline",
    },
    subheader: {
        fontSize: 14,
        marginBottom: 8,
        marginTop: 15,
        borderBottomWidth: 1, // ✅ ใช้ borderWidth/BottomWidth/RightWidth สำหรับตัวเลข
        borderBottomStyle: "solid", // ✅ ใช้ borderStyle/BottomStyle/RightStyle สำหรับ String
        paddingBottom: 4,
    },
    summaryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 15,
    },
    summaryCard: {
        width: "33.33%",
        padding: 5,
    },
    cardTitle: {
        fontSize: 10,
        color: "#555",
        marginBottom: 2,
    },
    cardValue: {
        fontSize: 14,
        fontWeight: "bold",
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid", 
        borderWidth: 1,       // ความหนาขอบโดยรวม
        borderRightWidth: 0,  
        borderBottomWidth: 0, 
        marginBottom: 15,
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row",
    },
    tableColHeader: {
        width: "25%",
        borderStyle: "solid", 
        borderBottomWidth: 1, 
        borderRightWidth: 1,  
        backgroundColor: "#f0f0f0",
        padding: 5,
        textAlign: "center",
        fontWeight: "bold",
    },
    tableCol: {
        width: "25%",
        borderStyle: "solid", 
        borderBottomWidth: 1, 
        borderRightWidth: 1,  
        padding: 5,
        textAlign: "center",
    },
    chartImage: {
        marginVertical: 10,
        width: "100%",
        height: 250, 
    },
    sideContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    listBlock: {
        width: "48%",
        borderWidth: 1,      // ✅ ใช้ borderWidth สำหรับตัวเลข
        borderStyle: "solid",// ✅ ใช้ borderStyle สำหรับ String
        borderColor: "#ccc",
        padding: 10,
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
});

// Component สำหรับ Card สรุปย่อ
const PdfCard = ({ title, value }) => (
    <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>
            {Number(value ?? 0).toLocaleString("th-TH")}
        </Text>
    </View>
);

// Component หลักสำหรับ PDF
export const ReportDocument = ({ summary, recent10, top3, alerts, chartImage }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>สรุปยอดรวมแดชบอร์ดผู้ดูแลระบบ</Text>

            {/* ส่วนสรุปย่อ (Cards) */}
            <Text style={styles.subheader}>ภาพรวมสถิติ</Text>
            <View style={styles.summaryGrid}>
                <PdfCard title="คำสั่งซื้อวันนี้" value={summary.todayOrders} />
                <PdfCard title="คำสั่งซื้อรอดำเนินการ" value={summary.pendingOrders} />
                <PdfCard title="คำสั่งซื้อสำเร็จ" value={summary.fulfilled} />
                <PdfCard title="คำสั่งซื้อยกเลิก" value={summary.cancelled} />
                <PdfCard title="สินค้ารวม" value={summary.totalProducts} />
                <PdfCard title="สินค้าหมดสต็อก" value={summary.outOfStock} />
            </View>

            {/* แผนภูมิ (จากรูปภาพที่แปลงแล้ว) */}
            {chartImage && (
                <>
                    <Text style={styles.subheader}>สถิติคำสั่งซื้อ 7 วันย้อนหลัง</Text>
                    <Image style={styles.chartImage} src={chartImage} />
                </>
            )}

            {/* Top Products และ Inventory Alerts */}
            <View style={styles.sideContainer}>
                {/* Top Products */}
                <View style={styles.listBlock}>
                    <Text style={styles.subheader}>ผลิตภัณฑ์ขายดี 3 อันดับแรก</Text>
                    {(top3.length > 0) ? top3.map(([name, qty], i) => (
                        <View key={name} style={styles.listItem}>
                            <Text>{`${i + 1}. ${name}`}</Text>
                            <Text>{`${qty} ขายไป`}</Text>
                        </View>
                    )) : <Text style={{ color: '#888' }}>ไม่มีข้อมูล</Text>}
                </View>

                {/* Inventory Alerts */}
                <View style={styles.listBlock}>
                    <Text style={styles.subheader}>การแจ้งเตือนสต็อก</Text>
                    {(alerts.length > 0) ? alerts.map((p, i) => (
                        <View key={p.id} style={styles.listItem}>
                            <Text>{`${i + 1}. ${p.name}`}</Text>
                            <Text style={{ color: p.stock < 1 ? 'red' : '#333' }}>
                                {`${p.stock} เหลือ`}
                            </Text>
                        </View>
                    )) : <Text style={{ color: '#888' }}>สินค้ามีสต็อกเพียงพอ</Text>}
                </View>
            </View>

            {/* ตารางคำสั่งซื้อล่าสุด (Recent Orders) */}
            <Text style={styles.subheader}>คำสั่งซื้อล่าสุด 10 รายการ</Text>
            <View style={styles.table}>
                {/* Header */}
                <View style={styles.tableRow} fixed>
                    <View style={styles.tableColHeader}><Text>DateTime</Text></View>
                    <View style={styles.tableColHeader}><Text>Total</Text></View>
                    <View style={styles.tableColHeader}><Text>Status</Text></View>
                    <View style={styles.tableColHeader}><Text>ID</Text></View>
                </View>
                {/* Data */}
                {(recent10.length > 0) ? recent10.map((o) => (
                    <View style={styles.tableRow} key={o.id}>
                        <View style={styles.tableCol}>
                            <Text>{fmtTH(o.createdAt || o.date)}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={{ textAlign: 'right' }}>
                                {money(
                                    o.totalPrice ?? o.total ?? o.amount ?? 0
                                )}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text>
                                {o.status || "UNKNOWN"}
                            </Text>
                        </View>
                        <View style={styles.tableCol}>
                            {/* แก้ไขปัญหา o.id.slice is not a function */}
                            <Text>{String(o.id || '').slice(0, 8)}...</Text>
                        </View>
                    </View>
                )) : (
                    <View style={styles.tableRow}>
                        <View style={{ ...styles.tableCol, width: "100%", borderRightWidth: 0, padding: 10, color: '#888' }}>
                            <Text style={{ textAlign: 'center' }}>ไม่มีคำสั่งซื้อล่าสุด</Text>
                        </View>
                    </View>
                )}
            </View>
        </Page>
    </Document>
);