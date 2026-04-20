/**
 * E2E Test Scenarios for eCommerce Application
 * 
 * These scenarios test the complete user flow from registration to checkout
 * Using Cypress or Playwright for E2E testing
 */

describe('E2E: User Registration and Login Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4201/');
  });

  it('should complete full user registration flow', () => {
    // Step 1: Navigate to register page
    cy.get('[routerLink="/auth/register"]').click();
    cy.url().should('include', '/auth/register');

    // Step 2: Fill registration form
    cy.get('input[name="fullName"]').type('Test User');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('TestPassword123');
    cy.get('input[name="confirmPassword"]').type('TestPassword123');

    // Step 3: Submit form
    cy.get('button[type="submit"]').click();

    // Step 4: Verify success
    cy.url().should('include', '/auth/login');
    cy.get('.alert-success').should('contain', 'Registration successful');
  });

  it('should complete user login flow', () => {
    // Navigate to login
    cy.visit('http://localhost:4201/auth/login');

    // Fill login form
    cy.get('input[name="email"]').type('ahmet@mail.com');
    cy.get('input[name="password"]').type('password123');

    // Submit
    cy.get('button[type="submit"]').click();

    // Verify redirected to dashboard
    cy.url().should('not.include', '/auth/login');
  });

  it('should reject invalid login credentials', () => {
    cy.visit('http://localhost:4201/auth/login');

    cy.get('input[name="email"]').type('ahmet@mail.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.get('.alert-danger').should('be.visible');
  });
});

describe('E2E: Shopping Cart and Checkout Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4201/');
    // Assume user is logged in
    cy.login('ahmet@mail.com', 'password123');
  });

  it('should add product to cart', () => {
    // Navigate to products
    cy.visit('http://localhost:4201/products');

    // Find and click add to cart button
    cy.get('.product-card').first().within(() => {
      cy.get('.btn-primary').click();
    });

    // Verify alert
    cy.on('window:alert', (str) => {
      expect(str).to.include('Added');
    });
  });

  it('should complete shopping flow: browse → cart → checkout', () => {
    // Step 1: Browse products
    cy.visit('http://localhost:4201/products');
    cy.get('.product-card').should('have.length.greaterThan', 0);

    // Step 2: Add item to cart (simulate adding via state/service)
    cy.get('[routerLink="/cart"]').click();
    cy.url().should('include', '/cart');

    // Step 3: Proceed to checkout
    cy.get('.checkout-btn').click();
    cy.url().should('include', '/checkout');

    // Step 4: Fill checkout form
    cy.get('input[name="fullName"]').type('Test Customer');
    cy.get('input[name="email"]').type('customer@example.com');
    cy.get('input[name="phone"]').type('1234567890');
    cy.get('input[name="address"]').type('123 Main St');
    cy.get('input[name="city"]').type('Istanbul');

    // Step 5: Select shipping method
    cy.get('select[name="shipping"]').select('standard');

    // Step 6: Enter payment info
    cy.get('input[name="cardNumber"]').type('4111111111111111');
    cy.get('input[name="expiryDate"]').type('12/25');
    cy.get('input[name="cvv"]').type('123');

    // Step 7: Complete order
    cy.get('button[type="submit"]').contains('Place Order').click();

    // Verify success
    cy.url().should('include', '/orders');
  });

  it('should display cart totals correctly', () => {
    cy.visit('http://localhost:4201/cart');

    cy.get('.subtotal').should('be.visible');
    cy.get('.shipping-fee').should('be.visible');
    cy.get('.tax').should('be.visible');
    cy.get('.total-amount').should('be.visible');
  });

  it('should handle empty cart', () => {
    cy.visit('http://localhost:4201/cart');

    // If cart is empty
    cy.get('body').then(($body) => {
      if ($body.text().includes('Your cart is empty')) {
        cy.get('.empty-cart-message').should('be.visible');
        cy.get('.checkout-btn').should('be.disabled');
      }
    });
  });
});

describe('E2E: Admin Panel Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4201/admin/login');
  });

  it('should login to admin panel', () => {
    cy.get('input[name="email"]').type('admin@ecommerce.com');
    cy.get('input[name="password"]').type('Admin123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/admin/dashboard');
  });

  it('should display dashboard statistics', () => {
    cy.login('admin@ecommerce.com', 'Admin123');
    cy.visit('http://localhost:4201/admin/dashboard');

    cy.get('.stat-card').should('have.length', 4);
    cy.get('.total-sales').should('be.visible');
    cy.get('.total-orders').should('be.visible');
  });

  it('should manage users in admin panel', () => {
    cy.login('admin@ecommerce.com', 'Admin123');
    cy.visit('http://localhost:4201/admin/users');

    // View user list
    cy.get('.user-table').should('be.visible');

    // Test CRUD operations
    cy.get('.add-user-btn').click();
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="fullName"]').type('New User');
    cy.get('button[type="submit"]').click();

    cy.get('.alert-success').should('contain', 'User created');
  });
});

describe('E2E: Error Handling and Edge Cases', () => {
  it('should handle out of stock products', () => {
    cy.visit('http://localhost:4201/products');

    // Find out of stock product
    cy.get('.product-card').contains('4K Webcam').within(() => {
      cy.get('.btn-primary').should('be.disabled');
      cy.get('.out-of-stock').should('be.visible');
    });
  });

  it('should validate required checkout fields', () => {
    cy.login('ahmet@mail.com', 'password123');
    cy.visit('http://localhost:4201/checkout');

    // Try to submit without filling form
    cy.get('button[type="submit"]').click();

    // Should show validation errors
    cy.get('.error-message').should('be.visible');
  });

  it('should handle network errors gracefully', () => {
    cy.intercept('/api/products', { statusCode: 500 }).as('productError');
    
    cy.visit('http://localhost:4201/products');
    cy.wait('@productError');

    cy.get('.error-alert').should('be.visible');
  });

  it('should redirect unauthorized user to login', () => {
    // Try to access protected route without login
    cy.visit('http://localhost:4201/cart');

    // Should redirect to login
    cy.url().should('include', '/auth/login');
  });
});

// Cypress custom commands
Cypress.Commands.add('login', (email, password) => {
  cy.visit('http://localhost:4201/auth/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/auth/login');
});
