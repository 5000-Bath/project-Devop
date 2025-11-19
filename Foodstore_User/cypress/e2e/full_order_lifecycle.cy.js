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
    cy.contains('🍜 Browse Menu').click();
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

      // --- PART 3: ADMIN PROCESSES ORDER (SWITCHING TO ADMIN SITE) ---
      // --- PART 3: ADMIN PROCESSES ORDER (SWITCHING TO ADMIN SITE) ---
      cy.log('--- PART 3: Admin Processes Order ---');
      cy.get('@orderId').then(orderId => {
          cy.log(`Switching to Admin site to process order ID: ${orderId}`);

          cy.origin('http://localhost:3001', { args: { orderId } }, ({ orderId }) => {
              // 1) login admin
              cy.visit('/');

              cy.get('input:nth-child(4)').type('admin');   // username
              cy.get('input:nth-child(6)').type('1234');    // password
              cy.get('button').click();

              cy.url().should('include', '/admin');

              // 2) เปิดหน้า Order Status
              cy.visit('/admin/orders');

              // 3) หาแถวที่มี orderId (เช่น "23")
              cy.contains('tr', orderId, { timeout: 10000 }).as('orderRow');

              // 4) คลิก More Info ของ order นั้น
              cy.get('@orderRow').within(() => {
                  cy.contains('More Info').click();
              });

              // 5) กด Complete Order
              cy.contains('button', /Complete/i).click();   // <= แก้ตรงนี้บรรทัดเดียว
              cy.get('.swal2-confirm').click();

              // 6) เช็กว่ากลายเป็น SUCCESS แล้ว
              cy.visit('/admin/orders');
              cy.contains('tr', orderId, { timeout: 10000 })
                  .should('contain', 'SUCCESS');

              cy.log('Admin successfully processed the order.');
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
                  // 1) เช็กว่า status เป็น SUCCESS
                  cy.get('.badge.ok').should('contain', 'SUCCESS');

                  // 2) ✅ กดปุ่ม Detail (ปุ่มดำ ๆ) ในแถวเดียวกัน
                  cy.contains('button', /detail/i).click();
              });
      });

      cy.log('SINGLE E2E FLOW COMPLETED AND VERIFIED SUCCESSFULLY!');
  });
});
