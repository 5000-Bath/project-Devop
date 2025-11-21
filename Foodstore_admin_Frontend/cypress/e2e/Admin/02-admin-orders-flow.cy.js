// cypress/e2e/Admin/02-admin-orders-flow.cy.js
const BASE_URL = Cypress.config("baseUrl") || "http://localhost:3001";
// ชี้ไปที่ /api ตั้งแต่ต้น
const API_URL = "http://localhost:8080/api";

describe("Admin Orders - Lifecycle Flow (Real API)", () => {
    before(() => {
        cy.log("--- Seeding Data: Creating User & Orders via API ---");

        const uniqueId = Date.now();
        const testUser = {
            username: `buyer_${uniqueId}`,
            password: "Password@123", // แก้ Password ให้เข้มขึ้น
            email: `buyer_${uniqueId}@test.com`,
            name: "Test",
            lastname: "Buyer",
            role: "USER", // เพิ่ม role กันเหนียว
        };

        // 1. สมัครสมาชิก (ต้องเช็คว่าผ่าน)
        cy.request({
            method: "POST",
            url: `${API_URL}/auth/register`, // -> http://localhost:8080/api/auth/register
            body: testUser,
            failOnStatusCode: false,
        }).then((res) => {
            // เช็คว่าสมัครผ่านจริงไหม
            if (res.status !== 200 && res.status !== 201) {
                throw new Error(`Register Failed: ${JSON.stringify(res.body)}`);
            }
            cy.log("Register Success");

            // 2. Login เอา Token
            cy.request("POST", `${API_URL}/auth/login`, {
                // -> http://localhost:8080/api/auth/login
                username: testUser.username,
                password: testUser.password,
            }).then((loginRes) => {
                if (loginRes.status !== 200) {
                    throw new Error(`Login Failed: ${JSON.stringify(loginRes.body)}`);
                }
                cy.log("Login Success");

                // 3. สั่งของรัวๆ 3 ออเดอร์
                for (let i = 0; i < 3; i++) {
                    cy.request({
                        method: "POST",
                        url: `${API_URL}/orders`, // -> http://localhost:8080/api/orders
                        body: {
                            totalPrice: 100 + i * 50,
                            shippingAddress: `123 Test Road Soi ${i}, Bangkok`,
                            paymentMethod: "QR_CODE",
                        },
                    });
                }
            });
        });
    });

    beforeEach(() => {
        cy.login("admin", "1234");
        cy.intercept("GET", "**/api/orders**").as("getOrders");
        cy.visit(`${BASE_URL}/admin/orders`);
        cy.wait("@getOrders");
        cy.wait(1000); // เพิ่มเวลารอ Table Render
    });

    it("opens orders list, searches, and views detail from a PENDING order", () => {
        cy.reload();
        cy.wait("@getOrders");

        // รอให้ตารางโหลดจริงๆ (timeout นานหน่อย)
        cy.get("table tbody tr", { timeout: 10000 }).should(
            "have.length.greaterThan",
            0
        );

        cy.contains("table tbody tr", "PENDING").first().as("pendingRow");

        cy.get("@pendingRow")
            .find("td")
            .eq(2)
            .invoke("text")
            .then((statusText) => {
                const term = statusText.trim().split(/\s+/)[0];
                if (term) {
                    cy.get('input[placeholder="Search..."]').clear().type(term);
                    cy.wait(500);
                    cy.get("table tbody tr").each(($tr) => {
                        cy.wrap($tr).should("contain.text", term);
                    });
                    cy.get('input[placeholder="Search..."]').clear().blur();
                }
            });

        cy.get("@pendingRow").within(() => {
            cy.contains("button, a", "More Info").click();
        });

        cy.url().should("include", "/orders-detail");
        cy.contains(/Order|รายละเอียด/i).should("be.visible");
    });

    it("marks a PENDING order as COMPLETE (SUCCESS)", () => {
        cy.intercept("PUT", "**/api/orders/*/status").as("updateStatus");

        cy.contains("table tbody tr", "PENDING", { timeout: 10000 })
            .first()
            .as("pendingRow");

        cy.get("@pendingRow").within(() => {
            cy.contains("button, a", "More Info").click();
        });

        cy.contains("button", /Complete|สำเร็จ|อนุมัติ/i).click();
        cy.get(".swal2-confirm").should("be.visible").click();

        cy.wait("@updateStatus")
            .its("request.body")
            .should("deep.include", { status: "SUCCESS" });
        cy.contains(/SUCCESS|สำเร็จ/i, { timeout: 10000 }).should("be.visible");
    });

    it("marks a PENDING order as CANCELLED", () => {
        cy.intercept("PUT", "**/api/orders/*/status").as("updateStatus");

        cy.contains("table tbody tr", "PENDING", { timeout: 10000 })
            .first()
            .as("pendingRow");

        cy.get("@pendingRow").within(() => {
            cy.contains("button, a", "More Info").click();
        });

        cy.contains("button", /Cancel|ยกเลิก/i).click();
        cy.get(".swal2-confirm").should("be.visible").click();

        cy.wait("@updateStatus")
            .its("request.body")
            .should("deep.include", { status: "CANCELLED" });
        cy.contains(/CANCELLED|ยกเลิก/i, { timeout: 10000 }).should("be.visible");
    });
});