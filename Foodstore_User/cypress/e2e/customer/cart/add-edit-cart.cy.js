describe('Add & Edit Cart Functionality', () => {

  beforeEach(() => {
    cy.visit('/Home');
    cy.get('.menu-grid', { timeout: 15000 }).should('be.visible');
    cy.contains('Loading...').should('not.exist');
    cy.get('.menu-card', { timeout: 10000 }).should('have.length.gt', 0);
  });

  // Test Case 1: ลูกค้าเข้าหน้า Menu แล้วกดเพิ่มสินค้าลงตะกร้าได้หรือไม่
  it('should allow a customer to add an item to the cart from the menu page', () => {
    // Find the first menu card that has an enabled button and click it
    cy.get('.menu-card:has(.add-to-cart-button:not(:disabled))')
      .first()
      .within(() => {
        cy.get('.add-to-cart-button').click();
      });

    // Assert that the cart count icon updates to 1
    cy.get('.cart-count', { timeout: 5000 }).should('have.text', '1');
  });

  // Test Case 2: สามารถเพิ่มหรือลดจำนวนสินค้าได้หรือไม่
  it('should allow increasing and decreasing item quantity in the cart', () => {
    cy.get('.add-to-cart-button:not(:disabled)').then(($buttons) => {
      expect($buttons.length).to.be.gt(0, 'Expected to find at least one available product to test quantity changes');
      cy.wrap($buttons).first().click();
    });
    
    cy.get('.cart-count').should('have.text', '1');

    cy.get('.cart-icon').click();
    cy.url().should('include', '/Order');

    cy.get('.order-item').first().find('.qty-display').should('have.text', '1');

    cy.get('.order-item').first().contains('button', '+').click();
    cy.get('.order-item').first().find('.qty-display').should('have.text', '2');

    cy.get('.order-item').first().contains('button', '−').click();
    cy.get('.order-item').first().find('.qty-display').should('have.text', '1');
  });

  // Test Case 3: สามารถกดลบรายการสินค้าจำนวนทั้งหมดได้หรือไม่
  it('US-C02: should allow removing an item from the cart', () => {
    // Get all available products and ensure there are at least two
    cy.get('.add-to-cart-button:not(:disabled)').then(($buttons) => {
      expect($buttons.length).to.be.gte(2, 'Expected to find at least two available products to test removing multiple items');

      // Add two different items to the cart
      cy.wrap($buttons).eq(0).click();
      cy.get('.cart-count').should('have.text', '1');
      cy.wrap($buttons).eq(1).click();
      cy.get('.cart-count').should('have.text', '2');

      // Go to the Order page
      cy.get('.cart-icon').click();
      cy.url().should('include', '/Order');
      cy.get('.order-item').should('have.length', 2);

      // Remove the first item
      cy.get('.order-item').first().find('.remove-item-btn').click();
      cy.get('.order-item').should('have.length', 1);

      // Remove the last item
      cy.get('.order-item').first().find('.remove-item-btn').click();
      cy.get('.order-item').should('not.exist');
      cy.contains('Your cart is empty.').should('be.visible');
    });
  });

});
