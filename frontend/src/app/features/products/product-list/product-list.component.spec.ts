import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent, CommonModule, FormsModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with products', () => {
    expect(component.products.length).toBeGreaterThan(0);
  });

  it('should display all products initially', () => {
    component.ngOnInit();
    expect(component.filteredProducts.length).toBe(component.products.length);
  });

  it('should filter products by category', () => {
    component.selectedCategory = 1; // Electronics
    component.applyFilters();
    
    const allElectronics = component.filteredProducts.every(p => p.categoryId === 1);
    expect(allElectronics).toBeTruthy();
  });

  it('should filter products by search term', () => {
    component.searchTerm = 'Headphones';
    component.applyFilters();
    
    const containsSearchTerm = component.filteredProducts.every(p => 
      p.productName.toLowerCase().includes('headphones') || 
      p.productDescription.toLowerCase().includes('headphones')
    );
    expect(containsSearchTerm).toBeTruthy();
  });

  it('should reset filters', () => {
    component.searchTerm = 'Test';
    component.selectedCategory = 1;
    component.resetFilters();
    
    expect(component.searchTerm).toBe('');
    expect(component.selectedCategory).toBe(0);
    expect(component.filteredProducts.length).toBe(component.products.length);
  });

  it('should get category name', () => {
    const categoryName = component.getCategoryName(1);
    expect(categoryName).toBe('Electronics');
  });

  it('should show alert when adding product to cart', () => {
    spyOn(window, 'alert');
    const product = component.products[0];
    
    component.addToCart(product);
    
    expect(window.alert).toHaveBeenCalled();
  });

  it('should disable add button for out of stock products', () => {
    const outOfStockProduct = component.products.find(p => p.productStock === 0);
    expect(outOfStockProduct).toBeDefined();
  });

  it('should display correct stock status', () => {
    expect(component.products[0].productStock).toBeGreaterThan(0);
    expect(component.products[3].productStock).toBe(0);
  });
});
