// cypress/e2e/Admin/02-admin-dashboard.cy.js
// ทดสอบหน้า Dashboard ด้วย API จริง (ไม่ mock data)

describe("Admin Dashboard (Real API)", () => {
    beforeEach(() => {
        // ใช้ custom command ที่มีอยู่แล้วของโปรเจกต์
        // ให้ยิง login ไป backend จริงด้วย user admin / 1234
        cy.login("admin", "1234");
    });

    it("shows key summary cards after loading data from real API", () => {
        // ดัก request ไว้เฉย ๆ (spy) ไม่ได้แก้ response
        cy.intercept("GET", "**/api/products").as("getProducts");
        cy.intercept("GET", "**/api/orders").as("getOrders");

        cy.visit("http://localhost:3001/admin/dashboard");

        // รอให้ดึงข้อมูลจริงจาก backend เสร็จ
        cy.wait(["@getProducts", "@getOrders"]);

        // หัวข้อ Dashboard ต้องโผล่
        cy.contains("h2", "Dashboard").should("be.visible");

        // การ์ดสำคัญควรมี เช่น Pending Orders / Total Products
        cy.contains(".card", "Pending Orders").should("be.visible");
        cy.contains(".card", "Total Products").should("be.visible");

        // เช็คว่าส่วน value ของการ์ดมีตัวเลข (ไม่ว่างเปล่า)
        cy.contains(".card", "Pending Orders")
            .find(".value")
            .invoke("text")
            .then((text) => {
                // แค่เช็คว่ามีเลขสักตัว เช่น "0", "3", "12"
                expect(text.trim()).to.match(/\d/);
            });

        cy.contains(".card", "Total Products")
            .find(".value")
            .invoke("text")
            .then((text) => {
                expect(text.trim()).to.match(/\d/);
            });
    });

    it("keeps dashboard visible after clicking Refresh with real API", () => {
        cy.intercept("GET", "**/api/products").as("getProducts");
        cy.intercept("GET", "**/api/orders").as("getOrders");

        cy.visit("http://localhost:3001/admin/dashboard");

        cy.wait(["@getProducts", "@getOrders"]);

        // กดปุ่ม Refresh แล้วต้องไม่พัง
        cy.contains("button", "Refresh").click();

        // รอ request รอบใหม่ (ใช้จริงจาก backend)
        cy.wait(["@getProducts", "@getOrders"]);

        // หน้า Dashboard ยังต้องอยู่ปกติ
        cy.contains("h2", "Dashboard").should("be.visible");
        cy.contains(".card", "Pending Orders").should("be.visible");
    });
});