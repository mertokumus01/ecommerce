import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of, switchMap } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { OrderItemService } from '../../../core/services/order-item.service';
import { ToastService } from '../../../core/services/toast.service';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { CartStateService } from '../../../core/services/cart-state.service';

interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  categoryId: number;
  productStock: number;
  icon: string;
}

interface Category {
  categoryId: number;
  categoryName: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <!-- Page Header -->
      <div class="row mb-5">
        <div class="col-md-6">
          <h1 class="display-6 fw-bold">🛍️ Products</h1>
          <p class="text-muted lead">Browse our collection of quality products</p>
        </div>
        <div class="col-md-6">
          <div class="input-group">
            <input 
              type="text" 
              class="form-control form-control-lg" 
              placeholder="Search products..."
              [(ngModel)]="searchTerm"
              (keyup)="applyFilters()">
            <button class="btn btn-primary" type="button">🔍</button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="card-title fw-bold mb-3">Filters</h6>

              <div class="mb-3" *ngIf="selectedCategory !== 0">
                <span class="badge bg-dark d-inline-flex align-items-center gap-2 px-3 py-2">
                  {{ getCategoryName(selectedCategory) }}
                  <button
                    type="button"
                    class="btn-close btn-close-white btn-sm"
                    aria-label="Kategori filtresini kaldır"
                    (click)="clearCategoryFilter()">
                  </button>
                </span>
              </div>
              
              <div class="mb-3">
                <label class="form-label fw-bold">Category</label>
                <select class="form-select" [(ngModel)]="selectedCategory" (change)="applyFilters()">
                  <option [ngValue]="0">All Categories</option>
                  <option *ngFor="let cat of categories" [ngValue]="cat.categoryId">{{ cat.categoryName }}</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Price Range (₺)</label>
                <div class="row g-2">
                  <div class="col-6">
                    <input
                      type="number"
                      class="form-control"
                      placeholder="Min"
                      [(ngModel)]="minPrice"
                      (input)="applyFilters()"
                      min="0">
                  </div>
                  <div class="col-6">
                    <input
                      type="number"
                      class="form-control"
                      placeholder="Max"
                      [(ngModel)]="maxPrice"
                      (input)="applyFilters()"
                      min="0">
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Stock Status</label>
                <select class="form-select" [(ngModel)]="stockFilter" (change)="applyFilters()">
                  <option value="ALL">All</option>
                  <option value="IN_STOCK">In Stock</option>
                  <option value="LOW_STOCK">Low Stock (1-10)</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Stock Quantity</label>
                <div class="row g-2">
                  <div class="col-6">
                    <input
                      type="number"
                      class="form-control"
                      placeholder="Min"
                      [(ngModel)]="minStock"
                      (input)="applyFilters()"
                      min="0">
                  </div>
                  <div class="col-6">
                    <input
                      type="number"
                      class="form-control"
                      placeholder="Max"
                      [(ngModel)]="maxStock"
                      (input)="applyFilters()"
                      min="0">
                  </div>
                </div>
              </div>

              <button class="btn btn-outline-primary w-100" (click)="resetFilters()">
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="col-md-9">
          <div *ngIf="isLoading" class="alert alert-info text-center">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Loading products...</p>
          </div>

          <div *ngIf="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>

          <div class="row g-4">
            <div class="col-md-6 col-lg-4" *ngFor="let product of filteredProducts">
              <div class="card border-0 shadow-sm h-100 product-card">
                <div class="card-body">
                  <div class="display-5 text-center mb-3">{{ product.icon }}</div>
                  
                  <h6 class="card-title fw-bold">{{ product.productName }}</h6>
                  <p class="text-muted small mb-2">{{ product.productDescription }}</p>
                  
                  <div class="mb-3">
                    <span class="badge bg-secondary">{{ getCategoryName(product.categoryId) }}</span>
                    <span 
                      [ngClass]="product.productStock > 0 ? 'bg-success' : 'bg-danger'"
                      class="badge ms-2">
                      {{ product.productStock > 0 ? 'In Stock (' + product.productStock + ')' : 'Out of Stock' }}
                    </span>
                  </div>

                  <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 text-primary fw-bold">₺{{ product.productPrice }}</h5>
                    <button 
                      class="btn btn-sm btn-primary"
                      [disabled]="product.productStock === 0"
                      (click)="addToCart(product)">
                      🛒 Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div class="alert alert-info text-center" *ngIf="filteredProducts.length === 0 && !isLoading">
            <div class="display-6 mb-3">🔍</div>
            <h5>No products found</h5>
            <p class="mb-0">Try adjusting your filters or search term</p>
          </div>

          <!-- Results Count -->
          <div class="mt-4 text-muted small" *ngIf="filteredProducts.length > 0">
            Showing {{ filteredProducts.length }} of {{ products.length }} products
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      transition: all 0.3s ease;
      cursor: default;
    }
    
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
    }

    .form-control:focus,
    .form-select:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner-border {
      width: 3rem;
      height: 3rem;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  filteredProducts: Product[] = [];
  searchTerm = '';
  selectedCategory = 0;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minStock: number | null = null;
  maxStock: number | null = null;
  stockFilter: 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'ALL';

  isLoading = false;
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private orderService: OrderService,
    private orderItemService: OrderItemService,
    private toastService: ToastService,
    private cartStateService: CartStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      products: this.productService.getAll().pipe(catchError(() => of([]))),
      categories: this.categoryService.getAll().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ products, categories }) => {
        this.products = (products as any[]).map(p => ({
          productId: Number(p.productId),
          productName: p.productName,
          productDescription: p.productDescription,
          productPrice: Number(p.productPrice || 0),
          categoryId: this.extractCategoryId(p),
          productStock: Number(p.productStock || 0),
          icon: this.getIconForProduct(p.productName)
        }));

        this.categories = (categories as any[]).map(c => ({
          categoryId: Number(c.categoryId),
          categoryName: c.categoryName
        }));

        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Products could not be loaded.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    const minPrice = this.toNullableNumber(this.minPrice);
    const maxPrice = this.toNullableNumber(this.maxPrice);
    const minStock = this.toNullableNumber(this.minStock);
    const maxStock = this.toNullableNumber(this.maxStock);

    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = this.selectedCategory === 0 || product.categoryId === this.selectedCategory;

      const matchesSearch = this.searchTerm === '' ||
        product.productName.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesMinPrice = minPrice === null || product.productPrice >= minPrice;
      const matchesMaxPrice = maxPrice === null || product.productPrice <= maxPrice;

      const matchesMinStock = minStock === null || product.productStock >= minStock;
      const matchesMaxStock = maxStock === null || product.productStock <= maxStock;

      const matchesStockFilter =
        this.stockFilter === 'ALL' ||
        (this.stockFilter === 'IN_STOCK' && product.productStock > 0) ||
        (this.stockFilter === 'LOW_STOCK' && product.productStock > 0 && product.productStock <= 10) ||
        (this.stockFilter === 'OUT_OF_STOCK' && product.productStock === 0);

      return matchesCategory
        && matchesSearch
        && matchesMinPrice
        && matchesMaxPrice
        && matchesMinStock
        && matchesMaxStock
        && matchesStockFilter;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 0;
    this.minPrice = null;
    this.maxPrice = null;
    this.minStock = null;
    this.maxStock = null;
    this.stockFilter = 'ALL';
    this.applyFilters();
  }

  private toNullableNumber(value: number | null): number | null {
    if (value === null || value === undefined || value === ('' as unknown as number)) {
      return null;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.categoryId === categoryId);
    return category ? category.categoryName : 'Unknown';
  }

  clearCategoryFilter(): void {
    this.selectedCategory = 0;
    this.applyFilters();
  }

  addToCart(product: Product): void {
    // Get current user
    let cartOrderId: number | null = null;
    this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (!user || !user.userId) {
          this.toastService.error('Lütfen önce giriş yapınız');
          throw new Error('Not logged in');
        }

        // Get or create CART order for this user
        return this.orderService.getByUserId(user.userId).pipe(
          switchMap(orders => {
            let cartOrder = (orders as any[]).find((o: any) => o.orderStatus === 'CART');
            
            if (cartOrder) {
              cartOrderId = cartOrder.orderId;
              // Use existing cart
              return of(cartOrder);
            } else {
              // Create new cart order
              return this.orderService.create({
                userId: user.userId!,
                orderTotalAmount: 0,
                orderStatus: 'CART',
                items: []
              } as any);
            }
          }),
          switchMap(cartOrder => {
            cartOrderId = cartOrder.orderId;
            // Add product to cart as order item
            const orderItem = {
              orderId: cartOrder.orderId,
              productId: product.productId,
              orderItemQuantity: 1,
              orderItemPrice: product.productPrice
            };
            return this.orderItemService.create(orderItem);
          })
        );
      }),
      finalize(() => {})
    ).subscribe({
      next: () => {
        this.toastService.success(`✅ "${product.productName}" sepete eklendi!`);
        this.cartStateService.setCartState({ orderId: cartOrderId, itemCount: 0 });
      },
      error: (err) => {
        if (err.message !== 'Not logged in') {
          this.toastService.error('Sepete ekleme başarısız oldu');
        }
      }
    });
  }

  private getIconForProduct(name: string): string {
    const n = (name || '').toLowerCase();

    if (n.includes('kulak') || n.includes('headphone')) return '🎧';
    if (n.includes('klavye') || n.includes('keyboard')) return '⌨️';
    if (n.includes('mouse')) return '🖱️';
    if (n.includes('kablo') || n.includes('usb')) return '🔌';
    if (n.includes('kamera') || n.includes('webcam')) return '📹';
    if (n.includes('canta') || n.includes('backpack')) return '🎒';

    return '📦';
  }

  private extractCategoryId(product: any): number {
    return Number(
      product?.categoryId
      ?? product?.category?.categoryId
      ?? product?.category?.id
      ?? product?.categories?.categoryId
      ?? product?.categories_id?.categoryId
      ?? product?.categories_id?.catagoryId
      ?? 0
    );
  }
}

