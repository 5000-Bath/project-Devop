describe('Track Order Functionality', () => {

  let testUser;

  // Create a single test user for the entire suite
  before(() => {
    const uniqueId = Date.now();
    testUser = {
      username: `customer_${uniqueId}`,
      password: 'password123',
      name: 'Test',
      lastname: `Customer${uniqueId}`,
      email: `customer_${uniqueId}@example.com`,
      address: '123 Test Lane'
    };
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/api/auth/register',
      body: testUser,
    }).its('status').should('be.oneOf', [200, 201]);
  });

  // Log in via UI before each test
  beforeEach(() => {
    cy.visit('/login');
    cy.get('.auth-input[autoComplete="username"]').type(testUser.username);
    cy.get('.auth-input[autoComplete="current-password"]').type(testUser.password);
    cy.get('.auth-btn').contains('เข้าสู่ระบบ').click();
    cy.url().should('include', '/Home');
    cy.get('.menu-grid', { timeout: 15000 }).should('be.visible');
  });

  it('should allow a user to place an order and track its PENDING status', () => {
    cy.visit('/Home');
    cy.get('.add-to-cart-button:not(:disabled)', { timeout: 10000 }).should('exist').first().click();
    cy.get('.cart-icon').click();
    cy.url().should('include', '/Order');
    cy.get('button.checkout-button').click();

    cy.get('.popup-content', { timeout: 10000 }).should('be.visible');
    cy.get('.popup-content p').first().invoke('text').then((text) => {
      const orderId = text.match(/#(\d+)/)[1];
      cy.get('.popup-close-button').first().click();
      
      cy.visit('/Status');
      cy.get('.search-input').type(orderId);
      cy.get('.search-button').click();

      cy.get('h1.status-title', { timeout: 10000 }).should('be.visible').and('contain', 'PENDING');
      cy.get('.order-id').should('contain', orderId);
    });
  });

  it('should display a new order in history and handle Details/Reorder actions', () => {
    let productName;

    // 1. Create a new order and get the product name
    cy.visit('/Home');
    cy.get('.add-to-cart-button:not(:disabled)', { timeout: 10000 }).should('exist').first()
      .parents('.menu-card')
      .find('.menu-card-name')
      .invoke('text')
      .then(name => {
        productName = name;
        cy.log(`Product to order: ${productName}`);
        cy.get('.add-to-cart-button:not(:disabled)').first().click();
      });

    cy.get('.cart-icon').click();
    cy.url().should('include', '/Order');
    cy.get('button.checkout-button').click();

    // 2. Extract the orderId
    cy.get('.popup-content', { timeout: 10000 }).should('be.visible');
    cy.get('.popup-content p').first().invoke('text').then((text) => {
      const orderId = text.match(/#(\d+)/)[1];
      cy.get('.popup-close-button').first().click();
      
      // 3. Navigate to the History page
      cy.visit('/History');
      cy.get('.history-table', { timeout: 10000 }).should('be.visible');
      
      // 4. Find the order row
      cy.contains('td', `#${orderId}`).parent('tr').as('orderRow');
      
      cy.get('@orderRow').within(() => {
        cy.get('.badge.warn').should('contain', 'PENDING');
        
        // 5. Test Details button
        cy.contains('button', 'Details').click();
      });

      // Assert details are shown
      cy.get('@orderRow').next('tr').find('.details-cell').should('be.visible').and('contain.text', productName);

      cy.get('@orderRow').within(() => {
        // The button text might change to "Hide"
        cy.contains('button', /Hide|Details/i).click();
      });

      // Assert details are hidden again
      cy.get('@orderRow').next('tr').find('.details-cell').should('not.exist');

      // 6. Test Reorder button
      cy.get('@orderRow').within(() => {
        cy.contains('button', 'Reorder').click();
      });

      // Assert navigation and that the order page now has the item
      cy.url().should('include', '/Order');
      cy.get('.order-summary').should('contain.text', productName);
    });
  });

});
