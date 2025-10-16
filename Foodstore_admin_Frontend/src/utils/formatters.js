export const fmtTH = (d) => new Date(d).toLocaleString("th-TH");

export const money = (n) =>
    `฿${Number(n ?? 0).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const norm = (s) => (s || "").toString().trim().toUpperCase();

export const isPending = (s) =>
    ["PENDING", "AWAITING_PAYMENT", "PROCESSING"].includes(norm(s));

export const isDone = (s) =>
    ["FULFILLED", "COMPLETED", "DELIVERED", "SUCCESS"].includes(norm(s));

export const isCancel = (s) =>
    ["CANCELLED", "CANCELED", "VOID"].includes(norm(s));
