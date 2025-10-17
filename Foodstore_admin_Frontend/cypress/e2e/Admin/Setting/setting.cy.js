describe('Settings Page', () => {
  const mockAdmin = {
    id: 1,
    username: 'Admin User',
    email: 'admin@example.com',
  };

  beforeEach(() => {
    cy.login('admin1', '1234'); // Programmatic login
  });

  it('allows an admin to edit their own profile', () => {
    const newName = 'Updated Admin Name';

    // 1. Intercept APIs
    cy.intercept('GET', '**/api/admins/me', { body: mockAdmin }).as('getAdmin');
    cy.intercept('PUT', `**/api/admins/${mockAdmin.id}`, { 
      statusCode: 200,
      body: { ...mockAdmin, username: newName }
    }).as('updateAdmin');

    // 2. Navigate to the settings page
    cy.visit('http://localhost:3001/admin/setting');
    cy.wait('@getAdmin');

    // 3. Assert initial data, edit, and save
    cy.contains('h2', mockAdmin.username).should('be.visible');
    cy.contains('button', 'แก้ไข').click();
    cy.get('input[name="fullName"]').clear().type(newName);
    cy.contains('button', 'บันทึก').click();

    // 4. Assert API call and UI update
    cy.wait('@updateAdmin').its('request.body').should('deep.include', {
      username: newName
    });
    cy.contains('บันทึกสำเร็จ').should('be.visible');
    cy.contains('h2', newName).should('be.visible');
  });
});
