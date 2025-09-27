describe('Status Page - Comprehensive', () => {

  it('should display an initial message on first load', () => {
    cy.visit('/Status');
    cy.contains('p', 'Please enter your Order ID to see the status.').should('be.visible');
  });

  it('should display an error for a non-existent order ID', () => {
    cy.visit('/Status');
    cy.get('.search-input').type('999');
    cy.get('.search-button').click();
    cy.contains('.message-text.error', 'Order with ID "999" not found.').should('be.visible');
  });

  it('should find an order by clicking the search button', () => {
    cy.visit('/Status');
    cy.get('.search-input').type('1');
    cy.get('.search-button').click();
    cy.contains('h1', 'Order Status : Order Received').should('be.visible');
    cy.contains('.item-name', 'ก๋วยเตี๋ยวเรือ').should('be.visible');
  });

  it('should find an order by pressing Enter in the input field', () => {
    cy.visit('/Status');
    cy.get('.search-input').type('2{enter}');
    cy.contains('h1', 'Order Status : Cooking').should('be.visible');
    cy.contains('.item-name', 'ข้าวมันไก่โกเอต').should('be.visible');
  });

  it('should find an order even with leading/trailing whitespace in the ID', () => {
    cy.visit('/Status');
    cy.get('.search-input').type(' 3 '); // Note the spaces
    cy.get('.search-button').click();
    cy.contains('h1', 'Order Status : Finished').should('be.visible');
    cy.contains('.item-name', 'พิซซ่าฮาวายเอี้ยน').should('be.visible');
  });

  it('should load an order directly if an orderId is in the URL query params', () => {
    cy.visit('/Status?orderId=4');
    cy.contains('h1', 'Order Status : Cancelled').should('be.visible');
    cy.contains('.item-name', 'ส้มตำปูปลาร้า').should('be.visible');
  });

});