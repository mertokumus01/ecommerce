import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

// Mock Components for testing
@Component({ template: '' })
class MockHomeComponent { }

@Component({ template: '' })
class MockProductsComponent { }

@Component({ template: '' })
class MockCartComponent { }

@Component({ template: '' })
class MockCheckoutComponent { }

@Component({ template: '' })
class MockLoginComponent { }

describe('Application Routing Tests', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: MockHomeComponent },
          { path: 'products', component: MockProductsComponent },
          { path: 'products/:id', component: MockProductsComponent },
          { path: 'cart', component: MockCartComponent },
          { path: 'checkout', component: MockCheckoutComponent },
          { path: 'auth/login', component: MockLoginComponent }
        ])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to home page', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('');
  });

  it('should navigate to products page', async () => {
    await router.navigate(['/products']);
    expect(location.path()).toBe('/products');
  });

  it('should navigate to product detail', async () => {
    await router.navigate(['/products', 1]);
    expect(location.path()).toBe('/products/1');
  });

  it('should navigate to cart', async () => {
    await router.navigate(['/cart']);
    expect(location.path()).toBe('/cart');
  });

  it('should navigate to checkout', async () => {
    await router.navigate(['/checkout']);
    expect(location.path()).toBe('/checkout');
  });

  it('should navigate to login', async () => {
    await router.navigate(['/auth/login']);
    expect(location.path()).toBe('/auth/login');
  });

  it('should handle navigation from products to cart', async () => {
    await router.navigate(['/products']);
    expect(location.path()).toBe('/products');
    
    await router.navigate(['/cart']);
    expect(location.path()).toBe('/cart');
  });

  it('should handle navigation from cart to checkout', async () => {
    await router.navigate(['/cart']);
    expect(location.path()).toBe('/cart');
    
    await router.navigate(['/checkout']);
    expect(location.path()).toBe('/checkout');
  });

  it('should handle product detail navigation flow', async () => {
    // Homepage
    await router.navigate(['']);
    expect(location.path()).toBe('');
    
    // Browse products
    await router.navigate(['/products']);
    expect(location.path()).toBe('/products');
    
    // View product detail
    await router.navigate(['/products', 5]);
    expect(location.path()).toBe('/products/5');
  });
});
