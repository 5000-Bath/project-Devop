describe('Menu Management - Add Item', () => {
  beforeEach(() => {
    cy.login('admin1', '1234'); // Programmatic login
  });

  it('allows an admin to add a new product', () => {
    const newProduct = {
      name: 'Krapow Kai (Mock)',
      description: 'Spicy basil chicken with rice',
      price: 70,
      stock: 20,
    };

    // 1. Intercept APIs
    cy.intercept('POST', '**/api/products', { 
      statusCode: 201, 
      body: { id: 3, ...newProduct }
    }).as('addProduct');
    cy.intercept('GET', '**/api/products', { body: [] }).as('getProducts');

    // 2. Navigate and trigger actions
    cy.visit('http://localhost:3001/admin/dashboard'); // Start on a logged-in page
    cy.contains('a', 'Menu').click();
    cy.url().should('include', '/admin/menu');
    cy.wait('@getProducts');

    cy.contains('button', 'Add Item').click();
    cy.url().should('include', '/admin/add-item');

    // 3. Fill form and submit
    cy.get('input[name="name"]').type(newProduct.name);
    cy.get('textarea[name="description"]').type(newProduct.description);
    cy.get('input[name="price"]').type(newProduct.price);
    cy.get('input[name="stock"]').type(newProduct.stock);
    cy.get('button[type="submit"]').contains('Apply').click();

    // 4. Assert API call and navigation
    cy.wait('@addProduct');
    cy.url().should('include', '/admin/menu');
  });
});