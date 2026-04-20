import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product, Category } from '../../shared/models';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  // ============================================
  // SIGNALS - Modern State Management
  // ============================================
  
  // Data signals
  private products$ = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly selectedCategory = signal<number | null>(null);
  private searchTerm$ = signal<string>('');
  private isLoading$ = signal<boolean>(false);
  private errorMessage$ = signal<string>('');

  // Public read-only signals
  readonly searchTerm = this.searchTerm$.asReadonly();
  readonly isLoading = this.isLoading$.asReadonly();
  readonly errorMessage = this.errorMessage$.asReadonly();

  // ============================================
  // COMPUTED - Derived state (auto-updates)
  // ============================================
  readonly filteredProducts = computed(() => this.filterProducts());
  readonly totalProducts = computed(() => this.products$().length);
  readonly shownProducts = computed(() => this.filteredProducts().length);

  // ============================================
  // RxJS cleanup
  // ============================================
  private readonly destroy$ = new Subject<void>();

  // ============================================
  // CONSTRUCTOR & SERVICES
  // ============================================
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  // ============================================
  // LIFECYCLE HOOKS
  // ============================================
  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================
  
  /**
   * Filter products by category
   */
  filterByCategory(categoryId: number | null): void {
    this.selectedCategory.set(categoryId);
  }

  /**
   * Handle search input - debounced
   */
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm$.set(value);
  }

  /**
   * Reset all filters
   */
  resetFilters(): void {
    this.selectedCategory.set(null);
    this.searchTerm$.set('');
  }

  /**
   * Get category name by ID
   */
  getCategoryName(categoryId: number | null | undefined): string {
    if (!categoryId) return 'Kategorisiz';
    const category = this.categories().find(
      c => c.categoryId === categoryId
    );
    return category ? category.categoryName : 'Kategorisiz';
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  /**
   * Load categories and products on init
   */
  private loadInitialData(): void {
    this.loadCategories();
    this.loadProducts();
  }

  /**
   * Load categories from service
   */
  private loadCategories(): void {
    this.categoryService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const categoryArray = Array.isArray(response) ? response : response ? [response] : [];
          this.categories.set(categoryArray);
        },
        error: (error) => {
          console.error('âŒ Kategoriler yÃ¼klenirken hata:', error);
          this.errorMessage$.set('Kategoriler yÃ¼klenemedi');
        }
      });
  }

  /**
   * Load products from service
   */
  private loadProducts(): void {
    this.isLoading$.set(true);
    this.errorMessage$.set('');

    this.productService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const productArray = Array.isArray(response) ? response : response ? [response] : [];
          this.products$.set(productArray);
          this.isLoading$.set(false);
        },
        error: (error) => {
          console.error('âŒ ÃœrÃ¼nler yÃ¼klenirken hata:', error);
          this.errorMessage$.set('ÃœrÃ¼nler yÃ¼klenemedi. LÃ¼tfen daha sonra tekrar deneyin.');
          this.isLoading$.set(false);
        }
      });
  }

  /**
   * Filter products by selected category and search term
   * This is used by the computed filteredProducts signal
   */
  private filterProducts(): Product[] {
    let filtered = this.products$();
    const category = this.selectedCategory();
    const search = this.searchTerm$().toLowerCase().trim();

    // Apply category filter
    if (category !== null) {
      filtered = filtered.filter(p => p.categoryId === category);
    }

    // Apply search filter
    if (search) {
      filtered = filtered.filter(p =>
        p.productName.toLowerCase().includes(search) ||
        p.productDescription.toLowerCase().includes(search)
      );
    }

    return filtered;
  }
}
