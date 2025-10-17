describe('Browse Products Functionality', () => {
  beforeEach(() => {
    cy.visit('/Home');
    cy.get('.menu-grid', { timeout: 15000 }).should('be.visible');
    cy.contains('Loading...').should('not.exist');
    cy.get('.menu-card', { timeout: 10000 }).should('have.length.gt', 0);
  });

  it('US-C01: should display product information (name, price, image) for all available items', () => {
    // Find all menu cards that are not sold out
    cy.get('.menu-card').not(':has(.sold-out-overlay)').each(($card) => {
      cy.wrap($card).within(() => {
        // Check for a visible image
        cy.get('img').should('be.visible').and(($img) => {
          // Ensure the image has a source and it's not empty
          expect($img).to.have.attr('src').and.not.be.empty;
        });

        // Check for a non-empty product name
        cy.get('.menu-card-name').invoke('text').should('not.be.empty');

        // Check for a non-empty price and that it follows a certain format (e.g., contains 'THB')
        cy.get('.menu-card-price').invoke('text').should('not.be.empty').and('include', 'THB');
      });
    });
  });

  it('US-C01: should correctly identify and display sold-out items', () => {
    // Check if there are any sold-out items on the page
    cy.get('body').then(($body) => {
      if ($body.find('.menu-card.sold-out').length > 0) {
        // If sold-out items exist, verify the overlay is present
        cy.get('.menu-card.sold-out').first().within(() => {
          cy.get('.sold-out-overlay').should('be.visible').and('contain.text', 'Sold Out');
          // The "Add to Cart" button should not be visible or should be disabled for sold-out items
          cy.get('.add-to-cart-button').should('not.exist');
        });
      } else {
        // If no sold-out items are found, we can skip this test
        cy.log('No sold-out items found to test.');
      }
    });
  });
});