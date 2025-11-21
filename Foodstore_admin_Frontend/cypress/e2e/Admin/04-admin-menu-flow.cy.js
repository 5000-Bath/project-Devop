// cypress/e2e/Admin/04-admin-menu-flow.cy.js
// Admin Menu – Flow: Create + Delete (ใช้ API จริง)

const BASE_URL = Cypress.config("baseUrl") || "http://localhost:3001";

describe("Admin Menu - Create & Delete flow (Real API)", () => {
    it("creates a menu item then deletes it from menu list", () => {
        // 1) Login จริง
        cy.login("admin", "1234");

        // 2) เตรียมข้อมูลเมนูใหม่แบบ unique
        const ts = Date.now();
        const newProduct = {
            name: `Test Dish ${ts}`,
            description: "Temporary menu item created by Cypress e2e",
            price: 70,
            stock: 20,
        };

        // 3) ไปหน้าเพิ่มเมนู
        cy.visit(`${BASE_URL}/admin/add-item`);
        cy.url().should("include", "/admin/add-item");

        // 4) กรอกฟอร์มเพิ่มเมนูใหม่
        cy.get('input[name="name"]').clear().type(newProduct.name);
        cy.get('textarea[name="description"]')
            .clear()
            .type(newProduct.description);
        cy.get('input[name="price"]').clear().type(String(newProduct.price));
        cy.get('input[name="stock"]').clear().type(String(newProduct.stock));

        // ถ้ามี category ให้เลือกอย่างน้อย 1 ค่า (ถ้าไม่มีก็ข้ามได้)
        cy.get("body").then(($body) => {
            const select = $body.find('select[name="category"], select').first();
            if (select.length) {
                cy.wrap(select).select(1); // เลือก option ตัวที่ 2
            }
        });

        // 5) กด Apply
        cy.get('button[type="submit"]').contains("Apply").click();

        // 6) popup Swal "เพิ่มเมนูสำเร็จ" → กด "ตกลง"
        cy.get(".swal2-confirm", { timeout: 10000 })
            .contains(/ตกลง|OK|โอเค|ยืนยัน/i)
            .click();

        // หลังปิด popup แล้วควรกลับหน้าเมนู
        cy.url().should("include", "/admin/menu");

        // 7) หาแถวที่เป็นเมนูใหม่ในตาราง
        cy.contains("table tbody tr", newProduct.name, { timeout: 10000 })
            .as("createdRow");

        // 8) เปิด Modal More Info จากแถวนี้
        cy.get("@createdRow").within(() => {
            cy.contains("button, a", /More Info|More/i).click();
        });

        // 9) ใน modal มีชื่อเมนูอยู่ แสดงว่าขึ้น detail ถูกแล้ว
        cy.contains("h3", newProduct.name).should("be.visible");

        // 10) กดปุ่ม Delete ใน modal เลย (ไม่แก้ฟิลด์ไหนทั้งนั้น)
        cy.contains("button", /Delete|ลบ/i).click();

        // 11) ยืนยันลบใน Swal
        cy.get(".swal2-confirm", { timeout: 10000 })
            .contains(/ลบ|ยืนยัน|ตกลง|OK/i)
            .click();

        // 12) ตรวจว่าเมนูที่สร้างเมื่อกี้หายไปจากตารางแล้ว
        cy.contains("table tbody tr", newProduct.name).should("not.exist");
    });
});