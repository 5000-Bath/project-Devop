describe('Landing Page', () => {

  // Test Case 1: Smoke Test for initial content
  it('should load and display initial key content', () => {
    cy.visit('/');
    cy.contains('h1', 'Welcome to Crayon Shinchan Foodstore').should('be.visible');
    cy.contains('a', 'Browse Menu').should('be.visible');
    cy.contains('a', 'Go to Orders').should('be.visible');
  });

  // Test Case 2: Test navigation to the Menu page
  it('should navigate to the menu page when "Browse Menu" is clicked', () => {
    cy.visit('/');
    cy.contains('a', 'Browse Menu').click();

    // Assert that the URL is now the Home page
    cy.url().should('include', '/Home');

    // Assert that we see content that is unique to the Home page
    cy.contains('h1', 'ALL MENUS').should('be.visible');
  });

  // Test Case 3: Test navigation to the Order page
  it('should navigate to the order page when "Go to Orders" is clicked', () => {
    cy.visit('/');
    cy.contains('a', 'Go to Orders').click();

    // Assert that the URL is now the Order page
    cy.url().should('include', '/Order');

    // Assert that we see content unique to the Order page (for an empty cart)
    cy.contains('Your cart is empty.').should('be.visible');
  });

});