// cypress/e2e/Admin/05-admin-coupons.cy.js
const BASE_URL = Cypress.config("baseUrl") || "http://localhost:3001";

describe("Admin Coupons – CRUD Flow (Create, Update, Delete)", () => {

    beforeEach(() => {
        cy.login("admin", "1234");
        cy.visit(`${BASE_URL}/admin/coupons`);
        cy.wait(1000);
    });

    it("Create -> Update -> Delete Coupon", () => {
        // ==========================================
        // 1. CREATE (สร้าง)
        // ==========================================
        cy.intercept({ url: /coupons/ }).as('apiCheck');

        const ts = Date.now();
        const couponCode = `TEST${ts}`;

        // เปิด Modal
        cy.contains("button", "เพิ่มคูปองใหม่").click({ force: true });
        cy.get('.modal-content, div[role="dialog"]').should("exist");
        cy.wait(1000);

        // กรอกข้อมูล
        cy.get('body').within(() => {
            cy.get("input").eq(0).clear({ force: true }).type(couponCode, { force: true });
            cy.get("input").eq(1).clear({ force: true });
            cy.wait(200);
            cy.get("input").eq(1).type("50", { force: true });

            cy.get("input").eq(2).clear({ force: true });
            cy.wait(200);
            cy.get("input").eq(2).type("5", { force: true });

            cy.get('input[type="date"]').clear({ force: true }).type("2025-12-31", { force: true });
        });

        cy.wait(1000);
        cy.get('button[type="submit"].btn-primary').click({ force: true });

        cy.wait('@apiCheck');
        cy.get('button[type="submit"].btn-primary').should('not.exist');
        cy.wait(2000); // รอ Table โหลด

        // ==========================================
        // 2. UPDATE (แก้ไข)
        // ==========================================
        // --- แก้ตรงนี้: จิ้มปุ่ม (Button) ตัวแรกของแถวเลย ชัวร์กว่าจิ้มไอคอน ---
        cy.get("table tbody tr").first().within(() => {
            cy.get("button").first().click({ force: true }); // ปุ่มแรกคือ Edit เสมอ
        });

        // เช็คว่า Modal ขึ้น (เอาแค่ Text พอ ไม่ต้องระบุ div เผื่อเป็น h3)
        cy.contains("แก้ไขคูปอง").should("exist");
        cy.wait(1000);

        // แก้ไขข้อมูล (Input ตัวที่ 3 คือจำนวนคงเหลือ)
        cy.get('body').within(() => {
            cy.get("input").eq(2).clear({ force: true });
            cy.wait(200);
            cy.get("input").eq(2).type("999", { force: true });
        });

        cy.wait(1000); // รอแป๊บก่อนกด Save
        cy.contains("button", "บันทึกการเปลี่ยนแปลง").click({ force: true });

        cy.wait('@apiCheck');
        cy.contains("button", "บันทึกการเปลี่ยนแปลง").should("not.exist");
        cy.wait(2000);

        // ==========================================
        // 3. DELETE (ลบ)
        // ==========================================
        // จิ้มปุ่ม (Button) ตัวสุดท้ายของแถว (ปุ่มแดง/Delete)
        cy.get("table tbody tr").first().within(() => {
            cy.get("button").last().click({ force: true });
        });

        // กดยืนยันใน Popup
        cy.get("body").then(($body) => {
            if ($body.find("button:contains('ยืนยัน'), button:contains('Yes'), button:contains('Delete')").length > 0) {
                cy.wait(500);
                cy.contains("button", /ยืนยัน|Yes|Delete|ลบ/i).click({ force: true });
            }
        });

        cy.wait('@apiCheck');
        cy.wait(1000);
    });
});