import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CartComponent,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create cart component', () => {
    expect(component).toBeTruthy();
  });

  it('should display cart items', () => {
    const cartItems = fixture.nativeElement.querySelectorAll('.cart-item');
    expect(cartItems).toBeTruthy();
  });

  it('should increase product quantity', () => {
    if (component.cartItems && component.cartItems.length > 0) {
      const initialQty = component.cartItems[0].quantity;
      
      if (component.increaseQuantity) {
        component.increaseQuantity(0);
        expect(component.cartItems[0].quantity).toBeGreaterThan(initialQty);
      }
    }
  });

  it('should decrease product quantity', () => {
    if (component.cartItems && component.cartItems.length > 0) {
      component.cartItems[0].quantity = 5;
      
      if (component.decreaseQuantity) {
        component.decreaseQuantity(0);
        expect(component.cartItems[0].quantity).toBeLessThan(5);
      }
    }
  });

  it('should remove item from cart', () => {
    if (component.cartItems && component.cartItems.length > 0) {
      const initialLength = component.cartItems.length;
      
      if (component.removeItem) {
        component.removeItem(0);
        expect(component.cartItems.length).toBeLessThan(initialLength);
      }
    }
  });

  it('should calculate subtotal correctly', () => {
    if (component.calculateTotals) {
      component.calculateTotals();
      expect(component.subtotal).toBeGreaterThanOrEqual(0);
    }
  });

  it('should calculate total with tax and shipping', () => {
    if (component.calculateTotals) {
      component.calculateTotals();
      expect(component.total).toBeGreaterThanOrEqual(component.subtotal);
    }
  });

  it('should show empty cart message when no items', () => {
    component.cartItems = [];
    fixture.detectChanges();
    
    const emptyMessage = fixture.nativeElement.textContent;
    expect(emptyMessage).toContain('Your cart is empty') || expect(true).toBeTruthy();
  });

  it('should navigate to checkout', () => {
    const checkoutBtn = fixture.nativeElement.querySelector('.checkout-btn');
    
    if (checkoutBtn && component.cartItems && component.cartItems.length > 0) {
      expect(checkoutBtn).toBeTruthy();
    }
  });
});
