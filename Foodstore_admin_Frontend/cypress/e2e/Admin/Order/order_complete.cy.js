describe('Order Management - Complete Order', () => {
  const mockOrder = {
    id: 101,
    createdAt: new Date().toISOString(),
    status: 'PENDING',
    totalPrice: 100,
    userId: 'user-123',
    orderItems: [{ id: 1, quantity: 1, product: { id: 1, name: 'Khao Man Kai (Mock)', price: 50, stock: 10 } }],
  };

  beforeEach(() => {
    cy.login('admin1', '1234'); // Programmatic login
  });

  it('allows an admin to mark an order as Complete', () => {
    // 1. Intercept APIs
    cy.intercept('GET', '**/api/orders', { body: [mockOrder] }).as('getOrders');
    cy.intercept('GET', `**/api/orders/${mockOrder.id}`, { body: mockOrder }).as('getOrderDetail');
    cy.intercept('PUT', `**/api/orders/${mockOrder.id}/status`, { 
      statusCode: 200,
      body: { ...mockOrder, status: 'SUCCESS' }
    }).as('updateStatus');

    // 2. Navigate to the order detail page
    cy.visit('http://localhost:3001/admin/dashboard');
    cy.wait('@getOrders'); // This wait is on the dashboard load
    cy.contains('table.table tbody tr', 'PENDING').find('a.btn').click();
    cy.wait('@getOrderDetail');

    // 3. Click the complete button
    cy.contains('button', 'Complete').click();

    // 4. Handle the confirmation dialog
    cy.get('.swal2-confirm').contains('ยืนยัน').click();

    // 5. Assert the API call is made with the correct status
    cy.wait('@updateStatus').its('request.body').should('deep.equal', {
      status: 'SUCCESS'
    });

    // 6. Assert success message is shown and status updates
    cy.contains('อัปเดตสำเร็จ').should('be.visible');
    cy.contains('span', 'SUCCESS').should('be.visible');
  });
});
