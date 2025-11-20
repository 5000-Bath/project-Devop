describe('Cart and Order Functionality', () => {

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
  it('should allow removing an item from the cart', () => {
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

  // --- Tests from order-summary.cy.js ---

  it('should display the order summary correctly for a single item', () => {
    // This test already visits /Home, so the beforeEach is slightly redundant but harmless.
    cy.visit('/Home');
    cy.get('.add-to-cart-button:not(:disabled)', { timeout: 10000 }).should('exist');

    // Add a single item
    cy.get('.add-to-cart-button:not(:disabled)').first().click();
    cy.get('.cart-icon').click();
    
    cy.url().should('include', '/Order');
    cy.get('.order-item').should('have.length', 1);
    cy.get('.checkout-summary').should('be.visible').and('contain', 'ราคาสุทธิ');
    cy.get('button.checkout-button').should('be.visible');
  });

  it('should calculate the total price correctly with multiple items', () => {
    // This test already visits /Home, so the beforeEach is slightly redundant but harmless.
    cy.visit('/Home');
    cy.get('.add-to-cart-button:not(:disabled)', { timeout: 10000 }).should('have.length.gte', 2, 'Test requires at least 2 available items');

    // Add two items
    cy.get('.add-to-cart-button:not(:disabled)').eq(0).click();
    cy.get('.add-to-cart-button:not(:disabled)').eq(1).click();

    // Go to the order page
    cy.get('.cart-icon').click();
    cy.url().should('include', '/Order');
    cy.get('.order-item').should('have.length', 2);

    // Calculate the total price from the items on the page
    let calculatedTotal = 0;
    cy.get('.order-item').each(($item) => {
      cy.wrap($item).find('.item-price').invoke('text').then((priceText) => {
        const price = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
        cy.wrap($item).find('.qty-display').invoke('text').then((qtyText) => {
          const qty = parseInt(qtyText, 10);
          calculatedTotal += price * qty;
        });
      });
    });

    // Get the displayed total and compare
    cy.get('.summary-line.total > span').last().invoke('text').then((totalText) => {
      const displayedTotal = parseFloat(totalText.replace(/[^0-9.-]+/g, ""));
      cy.then(() => {
        expect(displayedTotal).to.equal(calculatedTotal);
      });
    });
  });

  it('should apply an existing coupon from the admin panel', () => {
    // This test reads an existing coupon from the admin panel and applies it on the customer side.
    // It assumes at least one coupon has been created by the user/admin beforehand.

    // --- PART 1: ADMIN READS EXISTING COUPON ---
    cy.log('--- Admin reads existing coupon code ---');
    cy.origin('http://localhost:3001', () => {
      // 1. Log in as admin
      cy.visit('/');
      cy.get('input:nth-child(4)').type('admin');
      cy.get('input:nth-child(6)').type('1234');
      cy.get('button').click();
      cy.url().should('include', '/admin');

      // 2. Navigate to coupon page
      cy.visit('/admin/coupons');

      // 3. Read the first coupon code from the list and assert it's a non-empty string
      return cy.get('tbody tr:first-child td:first-child', { timeout: 10000 })
        .invoke('text')
        .should('be.a', 'string')
        .and('not.be.empty');
    }).then((couponCode) => {
      expect(couponCode).to.be.a('string').and.not.be.empty;
      cy.log(`--- Using coupon code from admin: ${couponCode} ---`);

      // --- PART 2: CUSTOMER USES COUPON ---
      cy.visit('/Home');

      // 1. Add an item to the cart
      cy.get('.add-to-cart-button:not(:disabled)').first().click();
      cy.get('.cart-icon').click();
      cy.url().should('include', '/Order');

      // 2. Get initial total
      let initialTotal;
      cy.get('.summary-line.total > span').last().invoke('text').then((totalText) => {
        initialTotal = parseFloat(totalText.replace(/[^0-9.-]+/g, ''));
        expect(initialTotal).to.be.gt(0);
      });

      // 3. Apply the admin-created coupon
      cy.get('input[placeholder="กรอกโค้ดส่วนลด"]').type(couponCode.trim());
      cy.get('button:contains("ใช้คูปอง")').click();

      // 4. Verify discount is applied
      cy.get('.summary-line.discount', { timeout: 5000 }).should('be.visible');

      // 5. Verify final price is reduced
      cy.get('.summary-line.total > span').last().invoke('text').then((finalTotalText) => {
        const finalTotal = parseFloat(finalTotalText.replace(/[^0-9.-]+/g, ''));
        expect(finalTotal).to.be.lessThan(initialTotal);
      });
    });
  });

});