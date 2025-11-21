// cypress/e2e/Admin/01-admin-auth.cy.js
// ใช้ login จริงจาก backend ไม่ mock ไม่ intercept

describe("Admin Authentication (Real API)", () => {

    it("logs in with real admin credentials and goes to dashboard", () => {
        // เข้าไปหน้า login
        cy.visit("http://localhost:3001/");

        // กรอกข้อมูลจริง
        cy.get('input[placeholder="โปรดใส่ชื่อผู้ใช้ของท่าน"]').type("admin");
        cy.get('input[placeholder="โปรดใส่รหัสผ่านของท่าน"]').type("1234");

        // กดปุ่มเข้าสู่ระบบ
        cy.get("button[type='submit']").click();

        // Dashboard ต้องโหลดสำเร็จ
        cy.url({ timeout: 10000 }).should("include", "/admin/dashboard");

        cy.get("h2", { timeout: 5000 }).should("contain", "Dashboard");
    });

    it("logs out correctly using real backend", () => {
        // 1) ล็อกอินจริงก่อน
        cy.visit("http://localhost:3001/");
        cy.get('input[placeholder="โปรดใส่ชื่อผู้ใช้ของท่าน"]').type("admin");
        cy.get('input[placeholder="โปรดใส่รหัสผ่านของท่าน"]').type("1234");
        cy.get("button[type='submit']").click();

        cy.url().should("include", "/admin/dashboard");

        // 2) กดปุ่ม Logout
        cy.contains("Logout").click({ force: true });

        // 3) หลัง logout แล้วควรกลับมาอยู่หน้า login
        cy.url().should("eq", "http://localhost:3001/");
    });
});