describe('Landing Page', () => {
  it('successfully loads and displays key content', () => {
    // Visit the root URL, which is http://localhost:3000 as defined in cypress.config.js
    cy.visit('/');

    // Check if the main heading is visible and contains the correct text
    cy.contains('h1', 'Welcome to Crayon Shinchan Foodstore').should('be.visible');

    // Check if the "Browse Menu" button/link is visible
    cy.contains('a', 'Browse Menu').should('be.visible');
  });
});
