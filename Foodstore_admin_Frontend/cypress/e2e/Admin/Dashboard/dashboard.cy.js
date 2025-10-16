describe('Admin Dashboard', () => {
  beforeEach(() => {
    // This custom command will programmatically log in and set the session cookie.
    // All subsequent cy.visit() or cy.request() commands will be authenticated.
    cy.login('admin1', '1234'); // Placeholder credentials
  });

  it('displays dashboard with data from mocked API', () => {
    const mockProducts = [
      { id: 1, name: 'Khao Man Kai (Mock)', price: 50, stock: 10 },
      { id: 2, name: 'Pad Thai (Mock)', price: 60, stock: 0 },
    ];
    const mockOrders = [
      { id: 101, createdAt: new Date().toISOString(), status: 'PENDING', totalPrice: 100, orderItems: [] },
      { id: 102, createdAt: new Date().toISOString(), status: 'SUCCESS', totalPrice: 180, orderItems: [] },
    ];

    // 1. Set up intercepts
    cy.intercept('GET', '**/api/products', { body: mockProducts }).as('getProducts');
    cy.intercept('GET', '**/api/orders', { body: mockOrders }).as('getOrders');

    // 2. Visit the page (we are already logged in)
    cy.visit('http://localhost:3001/admin/dashboard');

    // 3. Wait for the API calls
    cy.wait(['@getProducts', '@getOrders']);

    // 4. Assertions
    cy.contains('.card.mini .title', 'Pending Orders').siblings('.value').should('contain', '1');
    cy.contains('.card.mini .title', 'Total Products').siblings('.value').should('contain', '2');
  });

  it('refreshes the dashboard data when the refresh button is clicked', () => {
    // 1. Set up intercepts
    cy.intercept('GET', '**/api/orders').as('getOrders');
    cy.intercept('GET', '**/api/products').as('getProducts');

    // 2. Visit the page
    cy.visit('http://localhost:3001/admin/dashboard');

    // 3. Wait for initial load
    cy.wait(['@getOrders', '@getProducts']);

    // 4. Click the refresh button
    cy.contains('button', 'Refresh').click();

    // 5. Assert that the API calls were made again
    cy.wait(['@getOrders', '@getProducts']);
  });
});