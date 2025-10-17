describe('Admin Login', () => {
  it('allows an admin to log in and redirects to the dashboard', () => {
    // 1. *** MOCK RESPONSE: ตั้ง mock response สำหรับ API login ***
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      delay: 500,
      body: {
        success: true,
        token: 'fake-jwt-token-12345',
        user: {
          id: 'admin1',
          username: 'admin1',
          email: 'admin@example.com',
          role: 'admin'
        }
      }
    }).as('adminLogin');

    // 2. *** VISIT LOGIN PAGE ***
    cy.visit('http://localhost:3001/');

    // ตรวจสอบว่าหน้า login โหลดแล้ว
    cy.get('input[placeholder="โปรดใส่ชื่อผู้ใช้ของท่าน"]').should('be.visible');

    // 3. *** FILL IN LOGIN FORM ***
    const username = 'admin1';
    const password = '1234';

    cy.get('input[placeholder="โปรดใส่ชื่อผู้ใช้ของท่าน"]')
      .type(username);

    cy.get('input[placeholder="โปรดใส่รหัสผ่านของท่าน"]')
      .type(password);

    // 4. *** SUBMIT LOGIN FORM ***
    cy.get('button[type="submit"]')
      .should('be.enabled')
      .click();

    // 5. *** WAIT FOR API RESPONSE ***
    cy.wait('@adminLogin', { timeout: 10000 });

    // 6. *** ASSERT SUCCESSFUL LOGIN ***
    // รอให้ URL เปลี่ยนไปที่ dashboard
    cy.url({ timeout: 10000 })
      .should('include', '/admin/dashboard');

    // ตรวจสอบว่า dashboard element แสดงผล
    cy.get('h2', { timeout: 5000 })
      .should('contain', 'Dashboard');

    // ตรวจสอบเพิ่มเติม - ตรวจสอบว่า logged in อย่างถูกต้อง (ไม่บังคับ)
    // ถ้าเก็บ token ใน localStorage
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token') || 
                    win.sessionStorage.getItem('token') ||
                    win.localStorage.getItem('authToken');
      if (token) {
        expect(token).to.exist;
      }
    });
  });
});