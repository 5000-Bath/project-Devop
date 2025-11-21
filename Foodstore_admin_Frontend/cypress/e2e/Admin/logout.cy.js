// cypress/e2e/logout.cy.js

describe('Admin Logout', () => {
    it('should allow an admin to log out and be redirected to the login page', () => {
        // Mock login
        cy.intercept('POST', '**/auth/login', {
            statusCode: 200,
            body: { message: 'Login successful' },
        }).as('loginRequest');

        // ✅ เพิ่ม mock สำหรับ auth/check
        cy.intercept('GET', '**/auth/check', {
            statusCode: 200,
            body: { user: { name: 'fakeuser', role: 'admin' } },
        }).as('checkAuth');

        // Mock logout
        cy.intercept('POST', '**/auth/logout', {
            statusCode: 200,
            body: { message: 'Logout successful' },
        }).as('logoutRequest');

        // ไปหน้า login
        cy.visit('/');

        // กรอกฟอร์ม
        cy.get('input[placeholder*="ชื่อผู้ใช้"]').type('fakeuser');
        cy.get('input[placeholder*="รหัสผ่าน"]').type('fakepassword');
        cy.get('button[type="submit"]').click();

        // รอ login และ checkAuth
        cy.wait('@loginRequest');
        cy.wait('@checkAuth');

        // ตอนนี้ควร redirect ไป dashboard แล้ว
        cy.location('pathname', { timeout: 10000 }).should('include', '/admin/dashboard');

        // logout
        cy.contains('Logout').should('be.visible').click({ force: true });
        cy.wait('@logoutRequest');
        cy.location('pathname').should('eq', '/');
    });
});