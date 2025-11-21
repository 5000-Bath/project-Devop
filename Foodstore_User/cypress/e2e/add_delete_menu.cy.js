const ADMIN_URL = 'http://localhost:3001';
const USER_URL  = 'http://localhost:3000';

const uniqueId = Date.now();
const menuName = `TestMenu_${uniqueId}`;
const price    = '55';
const stock    = '10';
const desc     = 'Cypress test menu';

describe('Admin adds & deletes menu, user verifies', () => {
    it('full add + delete flow', () => {

        // ===== PART 1: Admin เพิ่มเมนู =====
        cy.origin(
            ADMIN_URL,
            { args: { menuName, price, stock, desc } },
            ({ menuName, price, stock, desc }) => {
                cy.visit('/');

                cy.get('input:nth-child(4)').type('admin');
                cy.get('input:nth-child(6)').type('1234');
                cy.get('button').click();

                cy.url().should('include', '/admin');

                cy.visit('/admin/menu');

                cy.contains('button', 'Add Item').click();

                cy.get('input[name="name"]').type(menuName);
                cy.get('input[name="price"]').type(price);
                cy.get('input[name="stock"]').type(stock);
                cy.get('textarea[name="description"]').type(desc);

                cy.contains('button', 'Apply').click();

                // 2) รอ Swal "เพิ่มเมนูสำเร็จ" โผล่ แล้วกด ตกลง
                cy.get('.swal2-confirm', { timeout: 10000 }).should('be.visible');
                cy.get('.swal2-confirm').click();

                // 3) รอให้ redirect ไป /admin/menu
                cy.url({ timeout: 10000 }).should('include', '/admin/menu');

                // 4) เช็กว่ามีเมนูใหม่จริงในตาราง
                cy.contains('td', menuName, { timeout: 15000 }).should('exist');
            }
        );

        // ===== PART 2: User เห็นเมนู =====
        cy.visit(`${USER_URL}/Home`);
        cy.reload();

        cy.contains('.card, .menu-card, .product-card', menuName, { timeout: 15000 })
            .should('be.visible');

        // ===== PART 3: Admin ลบเมนู =====
        cy.origin(
            ADMIN_URL,
            { args: { menuName } },
            ({ menuName }) => {
                cy.visit('/admin/menu');

                cy.contains('tr', menuName, { timeout: 15000 }).within(() => {
                    cy.contains('More Info').click();
                });

                cy.contains('button', /delete/i).click();
                cy.get('.swal2-confirm').click();

                cy.contains('td', menuName).should('not.exist');
            }
        );

        // ===== PART 4: User ไม่เห็นเมนูแล้ว =====
        cy.visit(`${USER_URL}/Home`);
        cy.reload();

        cy.contains('.card, .menu-card, .product-card', menuName).should('not.exist');
    });
});