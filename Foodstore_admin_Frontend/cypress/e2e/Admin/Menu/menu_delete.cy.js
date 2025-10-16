describe('Menu Management - Delete Item', () => {
  beforeEach(() => {
    cy.login('admin1', '1234'); // Programmatic login
  });

  it('allows an admin to delete a product', () => {
    const mockProduct = {
      id: 1,
      name: 'Khao Man Kai (To Delete)',
      description: 'Chicken and rice',
      price: 50,
      stock: 10,
    };

    // 1. Intercept APIs
    cy.intercept('GET', '**/api/products', { body: [mockProduct] }).as('getProducts');
    cy.intercept('DELETE', `**/api/products/${mockProduct.id}`, { statusCode: 200 }).as('deleteProduct');

    // 2. Navigate to the menu page
    cy.visit('http://localhost:3001/admin/menu');
    cy.wait('@getProducts');

    // 3. Open modal and delete
    cy.contains('tr', mockProduct.name).contains('button', 'More Info').click();
    cy.contains('h3', mockProduct.name).should('be.visible');
    cy.get('div').contains('button', 'Delete').click();
    cy.get('.swal2-confirm').contains('ลบ').click();

    // 4. Assert API call and UI update
    cy.wait('@deleteProduct');
    cy.contains('ลบเรียบร้อยแล้ว!').should('be.visible');
    cy.get('.swal2-confirm').click();
    cy.contains('tr', mockProduct.name).should('not.exist');
  });
});
