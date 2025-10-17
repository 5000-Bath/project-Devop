describe('Track Order Functionality', () => {

  it('US-C04: should allow a user to place an order and track its PENDING status', () => {
    // This is a full end-to-end test for a real order
    cy.visit('/Home');
    cy.get('.add-to-cart-button:not(:disabled)', { timeout: 10000 }).should('exist');
    cy.get('.add-to-cart-button:not(:disabled)').first().click();
    cy.get('.cart-icon').click();
    cy.url().should('include', '/Order');
    cy.get('button.checkout-button').click();

    cy.get('.popup-content', { timeout: 10000 }).should('be.visible');
    cy.get('.popup-content p').first().invoke('text').then((text) => {
      const match = text.match(/#(\d+)/);
      const orderId = match[1];
      cy.log(`Order placed with ID: ${orderId}`);

      cy.get('.popup-close-button').first().click();
      cy.visit('/Status');

      cy.get('.search-input').type(orderId);
      cy.get('.search-button').click();

      cy.get('h1.status-title', { timeout: 10000 }).should('be.visible').and('contain', 'PENDING');
      cy.get('.order-id').should('be.visible').and('contain', orderId);
    });
  });

  it('US-C04: should display a COMPLETED status correctly', () => {
    const mockOrderId = '123';
    // Intercept the API call and return a mock response with COMPLETED status
    cy.intercept('GET', `/api/orders/${mockOrderId}`, {
      statusCode: 200,
      body: {
        id: mockOrderId,
        status: 'COMPLETED',
        orderItems: [{ productId: 1, name: 'Test Item', price: 100, quantity: 1, imageUrl: null }],
        createdAt: new Date().toISOString(),
      },
    }).as('getOrder');

    cy.visit('/Status');
    cy.get('.search-input').type(mockOrderId);
    cy.get('.search-button').click();

    cy.wait('@getOrder');
    cy.get('h1.status-title').should('be.visible').and('contain', 'COMPLETED');
    cy.get('.order-id').should('contain', mockOrderId);
  });

  it('US-C04: should display a CANCELLED status correctly', () => {
    const mockOrderId = '456';
    // Intercept the API call and return a mock response with CANCELLED status
    cy.intercept('GET', `/api/orders/${mockOrderId}`, {
      statusCode: 200,
      body: {
        id: mockOrderId,
        status: 'CANCELLED',
        orderItems: [{ productId: 2, name: 'Another Item', price: 50, quantity: 2, imageUrl: null }],
        createdAt: new Date().toISOString(),
      },
    }).as('getOrder');

    cy.visit('/Status');
    cy.get('.search-input').type(mockOrderId);
    cy.get('.search-button').click();

    cy.wait('@getOrder');
    cy.get('h1.status-title').should('be.visible').and('contain', 'CANCELLED');
    cy.get('.order-id').should('contain', mockOrderId);
  });

  it('US-C04: should show an error message for a non-existent order ID', () => {
    const nonExistentOrderId = '999999';
    // Intercept the API call to simulate a 404 Not Found error
    cy.intercept('GET', `/api/orders/${nonExistentOrderId}`, {
      statusCode: 404,
      body: { error: 'Order not found' },
    }).as('getNonExistentOrder');

    cy.visit('/Status');
    cy.get('.search-input').type(nonExistentOrderId);
    cy.get('.search-button').click();

    cy.wait('@getNonExistentOrder');

    // Assert that a SweetAlert error popup is shown
    cy.get('.swal2-popup').should('be.visible');
    cy.get('#swal2-title').should('contain', 'ไม่พบออเดอร์');
    cy.get('#swal2-html-container').should('contain', 'หมายเลขออเดอร์นี้ไม่ถูกต้องหรือไม่มีอยู่ในระบบ');
  });

});
