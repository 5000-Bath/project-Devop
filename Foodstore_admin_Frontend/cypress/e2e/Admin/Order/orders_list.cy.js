describe('Orders Page - List and Search', () => {
  beforeEach(() => {
    cy.login('admin1', '1234'); // Programmatic login
  });

  it('displays a list of all orders and allows searching and navigation', () => {
    const mockOrders = [
      { id: 101, userId: 'user-123', status: 'PENDING', createdAt: new Date().toISOString() },
      { id: 102, userId: 'user-456', status: 'SUCCESS', createdAt: new Date().toISOString() },
    ];

    // 1. Intercept the API calls
    cy.intercept('GET', '**/api/orders', { body: mockOrders }).as('getOrders');
    cy.intercept('GET', `**/api/orders/102`, { body: mockOrders[1] }).as('getOrderDetail');

    // 2. Navigate to the orders page
    cy.visit('http://localhost:3001/admin/dashboard'); // Start from a logged-in page
    cy.contains('a', 'Orders').click();
    cy.url().should('include', '/admin/orders');
    cy.wait('@getOrders');

    // 3. Assert table is displayed correctly
    cy.contains('h1', 'Order Status').should('be.visible');
    cy.get('table tbody tr').should('have.length', 2);

    // 4. Test search and navigate
    cy.get('input[placeholder="Search..."]').type('SUCCESS');
    cy.get('table tbody tr').should('have.length', 1);
    cy.contains('tr', '102').contains('button', 'More Info').click();

    // 5. Assert navigation to the detail page
    cy.wait('@getOrderDetail');
    cy.url().should('include', '/admin/orders/orders-detail/102');
    cy.contains('h1', 'Order #102').should('be.visible');
  });
});