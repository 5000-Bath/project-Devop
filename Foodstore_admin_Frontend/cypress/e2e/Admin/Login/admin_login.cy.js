describe('Admin Login', () => {
  it('allows an admin to log in and redirects to the dashboard', () => {
    // Visit the login page
    cy.visit('http://localhost:3001/');

    // Get the username and password from the user
    // For now, using placeholders.
    const username = 'admin1'; // Please replace with the actual admin username
    const password = '1234'; // Please replace with the actual admin password

    // Find and fill in the username
    cy.get('input[placeholder="โปรดใส่ชื่อผู้ใช้ของท่าน"]').type(username);

    // Find and fill in the password
    cy.get('input[placeholder="โปรดใส่รหัสผ่านของท่าน"]').type(password);

    // Find and click the login button
    cy.get('button[type="submit"]').click();

    // Assert that the URL is now the admin dashboard
    cy.url().should('include', '/admin/dashboard');

    // Assert that a dashboard element is visible
    // We'll need to know what element to look for on the dashboard page.
    // For now, let's assume there's an H1 with the text "Dashboard".
    cy.get('h2').should('contain', 'Dashboard');
  });
});
