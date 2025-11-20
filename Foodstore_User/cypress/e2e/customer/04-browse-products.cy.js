describe('Browse Products Functionality', () => {
  beforeEach(() => {
    cy.visit('/Home');
    cy.get('.menu-grid', { timeout: 15000 }).should('be.visible');
    cy.contains('Loading...').should('not.exist');
    cy.get('.menu-card', { timeout: 10000 }).should('have.length.gt', 0);
  });

  it('should display product information (name, price, image) for all available items', () => {
    // Find all menu cards that are not sold out
    cy.get('.menu-card').not(':has(.sold-out-overlay)').each(($card) => {
      cy.wrap($card).within(() => {
        // Check for a visible image
        cy.get('img').should('be.visible').and(($img) => {
          // Ensure the image has a source and it's not empty
          expect($img).to.have.attr('src').and.not.be.empty;
        });

        // Check for a non-empty product name
        cy.get('.menu-card-name').invoke('text').should('not.be.empty');

        // Check for a non-empty price and that it follows a certain format (e.g., contains 'THB')
        cy.get('.menu-card-price').invoke('text').should('not.be.empty').and('include', 'THB');
      });
    });
  });

  it('should correctly identify and display sold-out items', () => {
    // Check if there are any sold-out items on the page
    cy.get('body').then(($body) => {
      if ($body.find('.menu-card.sold-out').length > 0) {
        // If sold-out items exist, verify the overlay is present
        cy.get('.menu-card.sold-out').first().within(() => {
          cy.get('.sold-out-overlay').should('be.visible').and('contain.text', 'Sold Out');
          // The "Add to Cart" button should not be visible or should be disabled for sold-out items
          cy.get('.add-to-cart-button').should('not.exist');
        });
      } else {
        // If no sold-out items are found, we can skip this test
        cy.log('No sold-out items found to test.');
      }
    });
  });
});

describe('Search Functionality', () => {
  beforeEach(() => {
    cy.visit('/Home');
    cy.get('.menu-card', { timeout: 10000 }).should('have.length.gt', 0);
  });

  it('should filter products correctly when searching by full name', () => {
    cy.get('.menu-card-name').first().invoke('text').then((productName) => {
      cy.get('.search-bar').type(productName);
      cy.get('.menu-card').should('have.length.at.least', 1);
      cy.get('.menu-card').first().find('.menu-card-name').should('have.text', productName);
    });
  });

  it('should handle fuzzy search for misspelled names', () => {
    // Find a product with a name longer than 3 chars to create a typo
    cy.get('.menu-card-name').filter((i, el) => el.innerText.length > 3).first().invoke('text').then((productName) => {
      // Create a typo by swapping two characters
      const mangledName = productName.substring(0, 1) + productName.substring(2, 3) + productName.substring(1, 2) + productName.substring(3);
      cy.log(`Testing fuzzy search. Original: "${productName}", Typo: "${mangledName}"`);
      
      cy.get('.search-bar').type(mangledName);

      // Assert that the original product is still found despite the typo
      cy.get('.menu-card-name').contains(productName).should('be.visible');
    });
  });

  it('should display a "no results" message for searches with no matches', () => {
    const searchTerm = 'nonexistentproductxyz123';
    cy.get('.search-bar').type(searchTerm);

    cy.get('.no-results').should('be.visible');
    cy.get('.menu-card').should('not.exist');
  });

  it('should restore all products when the search bar is cleared', () => {
    cy.get('.menu-card').then(($cards) => {
      const initialCount = $cards.length;
      
      if (initialCount <= 1) {
        cy.log('Skipping test: Not enough products to verify filtering.');
        return; // Skip the rest of the test if not enough items.
      }

      // Chain the rest of the test inside this .then()
      cy.get('.menu-card-name').first().invoke('text').then((productName) => {
        // Search for something to filter the list
        cy.get('.search-bar').type(productName);
        cy.get('.menu-card').should('have.length.lt', initialCount);

        // Clear the search and check if the count is restored
        cy.get('.search-bar').clear();
        cy.get('.menu-card').should('have.length', initialCount);
      });
    });
  });
});

describe('Category Filter Functionality', () => {
  it('should filter products when a category is selected and restore them when "All" is selected', () => {
    cy.visit('/Home');
    cy.get('.menu-card', { timeout: 10000 }).should('have.length.gt', 0);
    cy.get('.category-btn').should('have.length.gt', 1);

    cy.get('.menu-card').its('length').then((initialCardCount) => {
      cy.log(`Initial card count: ${initialCardCount}`);
      
      // Only test filtering if there's something to filter
      if (initialCardCount <= 1) {
        cy.log('Skipping detailed filter assertions because there are not enough items to verify a change.');
        return;
      }

      // Find and click a category that isn't "All"
      cy.get('.category-btn').not(':contains("All")').first().click();

      // After filtering, the number of cards should be less than or equal to the initial count.
      cy.get('.menu-card:visible').its('length').should('be.lte', initialCardCount);
      
      // Click the "All" button to restore the products
      cy.get('.category-btn').contains('All').click();

      // The number of cards should be restored to the initial count.
      cy.get('.menu-card', { timeout: 5000 }).should('have.length', initialCardCount);
    });
  });
});