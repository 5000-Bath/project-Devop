describe('Order Management', () => {
  const mockOrder = {
    id: 101,
    createdAt: new Date().toISOString(),
    status: 'PENDING',
    totalPrice: 100,
    userId: 'user-123',
    orderItems: [
      {
        id: 1,
        quantity: 2,
        product: { id: 1, name: 'Khao Man Kai (Mock)', price: 50 }
      }
    ]
  };

  const mockOrders = [mockOrder];

  beforeEach(() => {
    // Mock the login API response
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
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

    // Login before each test
    cy.visit('http://localhost:3001/');
    cy.get('input[placeholder="โปรดใส่ชื่อผู้ใช้ของท่าน"]').type('admin1');
    cy.get('input[placeholder="โปรดใส่รหัสผ่านของท่าน"]').type('1234');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@adminLogin', { timeout: 10000 });
    cy.url({ timeout: 10000 }).should('include', '/admin/dashboard');
  });

  it('navigates to the order detail page when "More" is clicked', () => {
    // Mock the orders list API call
    cy.intercept('GET', '**/api/orders', {
      statusCode: 200,
      body: mockOrders,
      delay: 300
    }).as('getOrders');

    // Mock the order detail API call
    cy.intercept('GET', `**/api/orders/${mockOrder.id}`, {
      statusCode: 200,
      body: mockOrder,
      delay: 300
    }).as('getOrderDetail');

    // Visit dashboard to trigger the first intercept
    cy.visit('http://localhost:3001/admin/dashboard');
    
    // Wait for orders list to load
    cy.wait('@getOrders', { timeout: 10000 });

    // ตรวจสอบว่า table มีข้อมูล
    cy.get('table.table tbody', { timeout: 5000 }).should('exist');

    // Find the row for our mock order and click "More"
    cy.contains('table.table tbody tr', 'PENDING')
      .should('be.visible')
      .find('a.btn, button.btn')
      .first()
      .click();

    // Wait for navigation and the second API call
    cy.wait('@getOrderDetail', { timeout: 10000 });

    // Assert we are on the correct page
    cy.url({ timeout: 10000 })
      .should('include', `/admin/orders/orders-detail/${mockOrder.id}`);

    // Assert order detail is displayed
    cy.get('h1, h2', { timeout: 5000 })
      .should('contain', mockOrder.id);

    // Assert some details are shown
    cy.contains('Khao Man Kai (Mock)', { timeout: 5000 })
      .should('be.visible');

    cy.contains('user-123', { timeout: 5000 })
      .should('be.visible');
  });

  it('displays order list on dashboard', () => {
    // Mock the orders list API
    cy.intercept('GET', '**/api/orders', {
      statusCode: 200,
      body: mockOrders,
      delay: 300
    }).as('getOrders');

    cy.visit('http://localhost:3001/admin/dashboard');
    cy.wait('@getOrders', { timeout: 10000 });

    // Verify orders are displayed
    cy.get('table.table tbody tr', { timeout: 5000 }).should('have.length', 1);
    cy.contains('PENDING').should('be.visible');
    cy.contains('100').should('be.visible');
  });
});