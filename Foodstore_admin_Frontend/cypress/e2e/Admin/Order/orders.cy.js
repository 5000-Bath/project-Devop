describe('Order Management', () => {
  const mockOrder = {
    id: 101,
    createdAt: new Date().toISOString(),
    status: 'PENDING',
    totalPrice: 100,
    userId: 'user-123',
    orderItems: [{ id: 1, quantity: 2, product: { id: 1, name: 'Khao Man Kai (Mock)', price: 50 } }],
  };

  beforeEach(() => {
    // Login before each test
    cy.visit('http://localhost:3001/');
    const username = 'admin1'; // Please replace with the actual admin username
    const password = '1234'; // Please replace with the actual admin password
    cy.get('input[placeholder="โปรดใส่ชื่อผู้ใช้ของท่าน"]').type(username);
    cy.get('input[placeholder="โปรดใส่รหัสผ่านของท่าน"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin/dashboard');
  });

  it('navigates to the order detail page when "More" is clicked', () => {
    // Mock the dashboard and order detail API calls
    cy.intercept('GET', '**/api/orders', { body: [mockOrder] }).as('getOrders');
    cy.intercept('GET', `**/api/orders/${mockOrder.id}`, { body: mockOrder }).as('getOrderDetail');

    // Visit dashboard to trigger the first intercept
    cy.visit('http://localhost:3001/admin/dashboard');
    cy.wait('@getOrders');

    // Find the row for our mock order and click "More"
    cy.contains('table.table tbody tr', 'PENDING')
      .find('a.btn')
      .click();

    // Wait for navigation and the second API call
    cy.wait('@getOrderDetail');

    // Assert we are on the correct page
    cy.url().should('include', `/admin/orders/orders-detail/${mockOrder.id}`);
    cy.get('h1').should('contain', `Order #${mockOrder.id}`);

    // Assert some details are shown
    cy.contains('Khao Man Kai (Mock)').should('be.visible');
    cy.contains('user-123').should('be.visible');
  });
});
