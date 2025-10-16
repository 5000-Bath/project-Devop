describe('Menu Management - Edit Item', () => {
  beforeEach(() => {
    cy.login('admin1', '1234'); // Programmatic login
  });

  it('allows an admin to edit a product via the modal', () => {
    const mockProduct = {
      id: 1,
      name: 'Khao Man Kai (Mock)',
      description: 'Chicken and rice',
      price: 50,
      stock: 10,
    };
    const updatedPrice = 55;

    // 1. Intercept APIs
    cy.intercept('GET', '**/api/products', { body: [mockProduct] }).as('getProducts');
    cy.intercept('PUT', `**/api/products/${mockProduct.id}`, {
      statusCode: 200,
      body: { ...mockProduct, price: updatedPrice }
    }).as('updateProduct');

    // 2. Navigate to the menu page
    cy.visit('http://localhost:3001/admin/menu');
    cy.wait('@getProducts');

    // 3. Open the modal and edit
    cy.contains('tr', mockProduct.name).contains('button', 'More Info').click();
    cy.contains('h3', mockProduct.name).should('be.visible');
    cy.contains('h3', mockProduct.name).parent().find('input[type="number"]').first().clear().type(updatedPrice);
    cy.contains('h3', mockProduct.name).parent().contains('button', 'Update').click();

    // 4. Assert API call and modal close
    cy.wait('@updateProduct').its('request.body').should('deep.include', {
      price: updatedPrice,
    });
    cy.contains('h3', mockProduct.name).should('not.exist');
  });
});