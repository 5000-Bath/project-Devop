describe('Order Summary Functionality', () => {

  it('US-C03: should display the order summary correctly for a single item', () => {
    cy.visit('/Home');
    cy.get('.add-to-cart-button:not(:disabled)', { timeout: 10000 }).should('exist');

    // Add a single item
    cy.get('.add-to-cart-button:not(:disabled)').first().click();
    cy.get('.cart-icon').click();
    
    cy.url().should('include', '/Order');
    cy.get('.order-item').should('have.length', 1);
    cy.get('.checkout-summary').should('be.visible').and('contain', 'Total Price');
    cy.get('button.checkout-button').should('be.visible');
  });

  it('US-C03: should calculate the total price correctly with multiple items', () => {
    cy.visit('/Home');
    cy.get('.add-to-cart-button:not(:disabled)', { timeout: 10000 }).should('have.length.gte', 2, 'Test requires at least 2 available items');

    // Add two items
    cy.get('.add-to-cart-button:not(:disabled)').eq(0).click();
    cy.get('.add-to-cart-button:not(:disabled)').eq(1).click();

    // Go to the order page
    cy.get('.cart-icon').click();
    cy.url().should('include', '/Order');
    cy.get('.order-item').should('have.length', 2);

    // Calculate the total price from the items on the page
    let calculatedTotal = 0;
    cy.get('.order-item').each(($item) => {
      cy.wrap($item).find('.item-price').invoke('text').then((priceText) => {
        const price = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
        cy.wrap($item).find('.qty-display').invoke('text').then((qtyText) => {
          const qty = parseInt(qtyText, 10);
          calculatedTotal += price * qty;
        });
      });
    });

    // Get the displayed total and compare
    cy.get('.summary-line.total > span').last().invoke('text').then((totalText) => {
      const displayedTotal = parseFloat(totalText.replace(/[^0-9.-]+/g, ""));
      cy.then(() => {
        expect(displayedTotal).to.equal(calculatedTotal);
      });
    });
  });

});
