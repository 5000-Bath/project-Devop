describe('Customer Registration', () => {

  it('should allow a new user to register successfully and then log in', () => {
    const uniqueId = Date.now();
    const newUser = {
      username: `test_user_${uniqueId}`,
      password: 'password123',
      name: 'Test',
      lastname: `User${uniqueId}`,
      email: `test_${uniqueId}@example.com`,
      address: '123 Test St.'
    };

    cy.visit('/register');

    // Fill out the registration form, using selectors from full_order_lifecycle.cy.js
    cy.get('[name="username"]').type(newUser.username);
    cy.get('[name="password"]').type(newUser.password);
    cy.get('[name="name"]').type(newUser.name);
    cy.get('[name="lastname"]').type(newUser.lastname);
    cy.get('[name="email"]').type(newUser.email);
    cy.get('[name="address"]').type(newUser.address);
    cy.get('.auth-btn').click();

    // Assert redirection to the login page, which indicates success.
    // Avoids checking for the success message which may disappear too quickly.
    cy.url().should('include', '/login');

    // Verify that the new account can be used to log in.
    cy.get('.auth-input[autoComplete="username"]').type(newUser.username);
    cy.get('.auth-input[autoComplete="current-password"]').type(newUser.password);
    cy.get('.auth-btn').contains('เข้าสู่ระบบ').click();
    
    // Assert successful login by checking for redirection to the menu page.
    cy.url().should('include', '/Home');
    cy.get('.menu-grid', { timeout: 15000 }).should('be.visible');
  });

  it('should show an error if the username already exists', () => {
    // First, create a user with all required fields to ensure it exists.
    const uniqueId = Date.now();
    const existingUser = {
      username: `existing_user_${uniqueId}`,
      password: 'password123',
      name: 'Existing',
      lastname: `User${uniqueId}`,
      email: `existing_${uniqueId}@example.com`,
      address: '789 Existing Ave.'
    };
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/api/auth/register',
      body: existingUser,
    }).its('status').should('be.oneOf', [200, 201]);

    // Now, attempt to register again with the same username via the UI.
    cy.visit('/register');
    cy.get('[name="username"]').type(existingUser.username);
    cy.get('[name="password"]').type('different_password');
    cy.get('.auth-btn').click();

    // Assert that an error message is displayed, without being specific about the text.
    cy.get('.auth-error').should('be.visible').and('not.be.empty');
  });

  it('should show a validation error for missing required fields', () => {
    cy.visit('/register');

    // Attempt to submit with a password but no username.
    // We use cy.submit() on the form to bypass native HTML5 validation.
    cy.get('.auth-form').within(() => {
      cy.get('[name="password"]').type('password123');
    }).submit();

    // Assert that the client-side validation message is shown.
    cy.get('.auth-error').should('be.visible').and('contain.text', 'กรุณากรอก username และ password');
  });

});