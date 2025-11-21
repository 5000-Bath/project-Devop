// cypress/e2e/Admin/02-admin-orders-flow.cy.js
// Admin Orders – Full lifecycle flow (ใช้ API จริง)
// - Login ด้วย admin / 1234
// - ไปหน้า Orders
// - เปิดดูรายละเอียดจาก list
// - เปลี่ยนสถานะเป็น COMPLETE
// - เปลี่ยนสถานะเป็น CANCELLED
//
// NOTE: ถ้าในระบบจริงปุ่ม / ข้อความไม่ตรง (เช่นชื่อปุ่มไม่ใช่ "More Info" หรือ "Complete")
//       ให้แก้ข้อความใน cy.contains(...) ให้ตรงกับ UI ของนายได้เลย

const BASE_URL = Cypress.config("baseUrl") || "http://localhost:3001";

describe("Admin Orders - Lifecycle Flow (Real API)", () => {
    beforeEach(() => {
        // ใช้ user จริงที่นายให้: admin / 1234
        cy.login("admin", "1234");

        // ดัก GET /api/orders ไว้ใช้รอโหลด (spy เท่านั้น ไม่ได้ mock)
        cy.intercept("GET", "**/api/orders**").as("getOrders");

        // เข้าไปหน้า Orders ทุกครั้งก่อนเริ่มแต่ละ it
        cy.visit(`${BASE_URL}/admin/orders`);
        cy.wait("@getOrders");
    });

    it("opens orders list, searches, and views detail from a PENDING order", () => {
        // ต้องมีอย่างน้อย 1 แถวใน table
        cy.get("table tbody tr").should("have.length.greaterThan", 0);

        // เอาแถวแรกที่มีคำว่า PENDING มาใช้เป็นตัวแทน
        cy.contains("table tbody tr", "PENDING")
            .first()
            .as("pendingRow");

        // ดึง status จากคอลัมน์ที่ 3 (index 2) มาใช้ test search
        cy.get("@pendingRow")
            .find("td")
            .eq(2)
            .invoke("text")
            .then((statusText) => {
                const term = statusText.trim().split(/\s+/)[0];
                if (!term) return;

                // ใส่ลงช่อง Search...
                cy.get('input[placeholder="Search..."]').clear().type(term);

                cy.wait(300);

                // ทุกแถวที่เหลือควรมีคำนี้อยู่
                cy.get("table tbody tr").each(($tr) => {
                    cy.wrap($tr).should("contain.text", term);
                });

                // เคลียร์ search กลับมาเหมือนเดิม
                cy.get('input[placeholder="Search..."]').clear().blur();
            });

        // เปิดหน้ารายละเอียดจากปุ่ม More Info ในแถว PENDING
        cy.get("@pendingRow").within(() => {
            cy.contains("button, a", "More Info").click();
        });

        // URL ควรเป็นหน้า detail ของ order ใดสักอัน
        cy.url().should("match", /\/admin\/orders\/orders-detail\/\d+$/);

        // เช็คว่ามีคำว่า Order / รายละเอียดออเดอร์ โผล่
        cy.contains(/Order/i).should("be.visible");
    });

    it("marks a PENDING order as COMPLETE (SUCCESS)", () => {
        // ดัก PUT /status เพื่อดูว่า UI ส่ง status อะไรจริง ๆ
        cy.intercept("PUT", "**/api/orders/*/status").as("updateStatus");

        // หา PENDING แถวแรกอีกครั้ง (ระบบรีเฟรชใหม่เพราะ beforeEach)
        cy.contains("table tbody tr", "PENDING")
            .first()
            .as("pendingRow");

        // เปิด detail
        cy.get("@pendingRow").within(() => {
            cy.contains("button, a", "More Info").click();
        });

        cy.url().should("match", /\/admin\/orders\/orders-detail\/\d+$/);

        // กดปุ่ม Complete (ถ้าชื่อปุ่มใน UI ต่าง แก้ข้อความใน contains ให้ตรง)
        cy.contains("button", "Complete").click();

        // popup ยืนยันของ SweetAlert2 → กด "ยืนยัน"
        cy.get(".swal2-confirm").contains("ยืนยัน").click();

        // ตรวจว่า request PUT ส่ง status = SUCCESS ไปจริง
        cy.wait("@updateStatus")
            .its("request.body")
            .should("deep.include", { status: "SUCCESS" });

        // มีข้อความสำเร็จ และสถานะบนหน้าจอเปลี่ยนเป็น SUCCESS
        cy.contains("อัปเดตสำเร็จ").should("be.visible");
        cy.contains("span", "SUCCESS").should("be.visible");
    });

    it("marks a PENDING order as CANCELLED", () => {
        cy.intercept("PUT", "**/api/orders/*/status").as("updateStatus");

        // หา PENDING อีกรอบ (คนละรอบกับ it ด้านบน เพราะ beforeEach รีเซ็ต navigation)
        cy.contains("table tbody tr", "PENDING")
            .first()
            .as("pendingRow");

        cy.get("@pendingRow").within(() => {
            cy.contains("button, a", "More Info").click();
        });

        cy.url().should("match", /\/admin\/orders\/orders-detail\/\d+$/);

        // กดปุ่ม Cancel (ถ้าใน UI ใช้คำว่า "Cancel Order" หรือภาษาไทย ให้เปลี่ยนตรงนี้)
        cy.contains("button", "Cancel").click();

        // popup ยืนยัน
        cy.get(".swal2-confirm").contains("ยืนยัน").click();

        // ตรวจ status ที่ส่งไป backend
        cy.wait("@updateStatus")
            .its("request.body")
            .should("deep.include", { status: "CANCELLED" });

        // ตรวจข้อความสำเร็จ + สถานะเปลี่ยนเป็น CANCELLED
        cy.contains("อัปเดตสำเร็จ").should("be.visible");
        cy.contains("span", "CANCELLED").should("be.visible");
    });
});