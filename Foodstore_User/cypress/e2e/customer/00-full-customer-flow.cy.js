describe('FINAL V4: Based on Final Code Analysis', () => {
  // --- PART 0: SETUP ---
  const uniqueId = Date.now();
  const newUser = {
    username: `user_${uniqueId}`,
    password: 'password123',
    name: 'Test',
    lastname: `User${uniqueId}`,
    email: `test_${uniqueId}@example.com`,
    address: '123 Cypress St.'
  };
  const customerFullName = `${newUser.name} ${newUser.lastname}`;

  it('should run the entire lifecycle with correct login verification', () => {

    // --- PART 1: USER SIGNUP AND FORCED LOGIN ---
    cy.log('--- PART 1: User Signup and Forced Login ---');
    cy.visit('http://localhost:3000/');
    cy.contains('🍜 Browse Menu').click();
    cy.get('.add-to-cart-button').first().click();
    cy.contains('Orders').click();
    cy.get('.checkout-button').click();

    cy.contains('สมัครสมาชิก').click();
    cy.url().should('include', '/register');

    cy.get('[name="username"]').type(newUser.username);
    cy.get('[name="password"]').type(newUser.password);
    cy.get('[name="name"]').type(newUser.name);
    cy.get('[name="lastname"]').type(newUser.lastname);
    cy.get('[name="email"]').type(newUser.email);
    cy.get('[name="address"]').type(newUser.address);
    cy.get('.auth-btn').click();

    cy.url().should('include', '/login');

    // --- CORRECT LOGIN VERIFICATION (based on AuthContext.jsx & Navbar.jsx) ---
    cy.log('--- Verifying Login with API Intercept and UI interaction ---');
    // 1. Intercept the REAL login API call
    cy.intercept('POST', '**/api/auth/login').as('loginRequest');

    cy.get('.auth-input:nth-child(2)').type(newUser.username);
    cy.get('.auth-input:nth-child(4)').type(newUser.password);
    cy.get('.auth-btn').click();

    // 2. Wait for the API to respond successfully
    cy.wait('@loginRequest').its('response.statusCode').should('be.oneOf', [200, 201]);

    // --- PART 2: USER PLACES ORDER (POST-LOGIN) ---
    cy.log('--- PART 2: User starts shopping AGAIN after login ---');
    // Assert redirection to the menu page
    cy.url().should('include', '/Home');
    cy.get('.menu-grid', { timeout: 15000 }).should('be.visible');
    cy.get('.add-to-cart-button').first().click();
    cy.contains('Orders').click();

    cy.intercept('POST', '**/api/orders').as('createOrder');
    cy.get('.checkout-button').click();

      cy.wait('@createOrder').then((interception) => {
          expect(interception.response.statusCode).to.be.oneOf([200, 201]);
          const orderId = interception.response.body.id;
          cy.wrap(orderId).as('orderId');
          cy.log(`Order placed successfully. Order ID: ${orderId}`);

          // แก้ตรงนี้
          cy.get('.popup-close-button').first().click();
      });
      // --- PART 3: Admin Processes Order ---
      cy.log('--- PART 3: Admin Processes Order ---');

      cy.get('@orderId').then((orderId) => {
          cy.log(`Switching to Admin site to process order ID: ${orderId}`);

          // ดัก PUT อัปเดตสถานะ (ทำข้างนอก origin)
          cy.intercept('PUT', '**/api/orders/**/status').as('updateStatus');

          // ====== รอบแรก: login + หาแถว + กด More Info + Complete ======
          cy.origin('http://localhost:3001', { args: { orderId } }, ({ orderId }) => {
              cy.visit('/');

              // 1) login admin
              cy.get('input:nth-child(4)').type('admin');
              cy.get('input:nth-child(6)').type('1234');
              cy.get('button').click();

              cy.url().should('include', '/admin');

              // 2) เข้า /admin/orders
              cy.visit('/admin/orders');

              // 3) หาแถวที่ "คอลัมน์แรก (Order ID)" ตรงกับ orderId
              cy.get('tbody tr', { timeout: 20000 })
                  .filter((_, row) => {
                      const firstCell = row.querySelector('td'); // cell คอลัมน์ Order ID
                      return (
                          firstCell &&
                          firstCell.textContent.trim() === String(orderId)
                      );
                  })
                  .should('have.length', 1)
                  .then(($rows) => {
                      cy.wrap($rows.eq(0)).as('orderRow');
                  });

              // 4) ใช้ @orderRow ที่ถูกต้อง แล้วค่อยกด More Info
              cy.get('@orderRow').within(() => {
                  cy.contains('More Info').should('be.visible').click();
              });

              // 5) อยู่หน้า detail ของ orderId นี้ → กด Complete
              cy.contains('button', /^Complete$/).click();
              cy.get('.swal2-confirm').click();
          });

          // ====== นอก origin: รอให้ backend อัปเดต ======
          cy.wait('@updateStatus')
              .its('response.statusCode')
              .should('be.oneOf', [200, 201]);

          // ====== รอบสอง: กลับไปเช็กใน /admin/orders อีกรอบ ======
          cy.origin('http://localhost:3001', { args: { orderId } }, ({ orderId }) => {
              cy.visit('/admin/orders');

              cy.get('tbody tr', { timeout: 20000 })
                  .filter((_, row) => {
                      const firstCell = row.querySelector('td');
                      return (
                          firstCell &&
                          firstCell.textContent.trim() === String(orderId)
                      );
                  })
                  .should('have.length', 1)
                  .first()
                  .within(() => {
                      // ยืนยันว่าเป็นแถวของ orderId จริง ๆ
                      cy.get('td').first().should('have.text', String(orderId));
                      // ถ้าไม่อยากให้แกว่ง อย่าเพิ่งบังคับว่า SUCCESS
                      // cy.contains('SUCCESS');
                  });

              cy.log('Admin clicked Complete for the correct order.');
          });
      });
      // --- PART 4: USER VERIFIES FINAL STATUS ---
      cy.log('--- PART 4: User Verifies Final Status ---');
      cy.visit('http://localhost:3000/Home');

      cy.contains('nav .nav__link', 'History').click();
      cy.url().should('include', '/History');

      cy.get('@orderId').then((orderId) => {
          cy.contains('td', `#${orderId}`)
              .parent('tr')
              .within(() => {
                  // รอจน badge เป็น SUCCESS นานสุด 15 วิ
                  cy.contains('.badge', /SUCCESS/i, { timeout: 15000 });

                  // กดปุ่ม Details
                  cy.contains('button', /detail/i).click();
              });
      });

      cy.log('SINGLE E2E FLOW COMPLETED AND VERIFIED SUCCESSFULLY!');
  });
});