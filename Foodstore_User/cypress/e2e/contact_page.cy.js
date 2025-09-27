describe('Contact Page', () => {

  it('should load the contact page and display key information', () => {
    // Step 1: Visit the contact page
    cy.visit('/contact');

    // Step 2: Assert that the main heading is visible
    cy.contains('h1', 'Contact Us').should('be.visible');

    // Step 3: Assert that the contact image is loaded and visible
    cy.get('.contact-image').should('be.visible').and(($img) => {
      // A good practice is to also check that the image has a natural width, 
      // which means the file itself isn't broken.
      expect($img[0].naturalWidth).to.be.greaterThan(0);
    });

    // Step 4: Assert that the contact information is displayed
    cy.get('.contact-info').within(() => {
      cy.contains('KONGPHOP').should('be.visible');
      cy.contains('"THE PSYCHO"').should('be.visible');
      cy.contains('KAOCHOT').should('be.visible');
    });
  });

});
