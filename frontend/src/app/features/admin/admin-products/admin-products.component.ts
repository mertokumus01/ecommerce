import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  // Signals
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly search = signal('');

  readonly products = signal<any[]>([]);
  readonly categories = signal<any[]>([]);

  readonly showForm = signal(false);
  readonly editMode = signal(false);
  readonly editingId = signal<number | null>(null);

  readonly form = signal<any>(this.emptyForm());

  // Computed
  readonly filteredProducts = computed(() => {
    const q = this.search().toLowerCase();
    return this.products().filter(p =>
      (p.productName || '').toLowerCase().includes(q) ||
      (p.productDescription || '').toLowerCase().includes(q)
    );
  });

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private emptyForm(): any {
    return {
      productName: '',
      productDescription: '',
      productPrice: 0,
      productStock: 0,
      categoryId: null
    };
  }

  private loadAll(): void {
    this.loading.set(true);
    this.categoryService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories: any) => {
          this.categories.set(Array.isArray(categories) ? categories : []);
          this.productService.getAll()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (products: any) => {
                this.products.set(Array.isArray(products) ? products : []);
                this.loading.set(false);
              },
              error: () => {
                this.errorMessage.set('Urunler alinamadi');
                this.loading.set(false);
              }
            });
        },
        error: () => {
          this.errorMessage.set('Kategoriler alinamadi');
          this.loading.set(false);
        }
      });
  }

  toggleCreate(): void {
    if (this.showForm() && !this.editMode()) {
      this.cancel();
      return;
    }
    this.openCreate();
  }

  categoryName(categoryId: number): string {
    const found = this.categories().find(c => Number(c.categoryId) === Number(categoryId));
    return found?.categoryName || `#${categoryId}`;
  }

  openCreate(): void {
    this.editMode.set(false);
    this.editingId.set(null);
    const newForm = this.emptyForm();
    if (this.categories().length > 0) {
      newForm.categoryId = this.categories()[0].categoryId;
    }
    this.form.set(newForm);
    this.showForm.set(true);
  }

  openEdit(product: any): void {
    this.editMode.set(true);
    this.editingId.set(Number(product.productId));
    this.form.set({
      productName: product.productName,
      productDescription: product.productDescription,
      productPrice: Number(product.productPrice || 0),
      productStock: Number(product.productStock || 0),
      categoryId: Number(product.categoryId)
    });
    this.showForm.set(true);
  }

  save(): void {
    const f = this.form();
    const payload = {
      productName: f.productName,
      productDescription: f.productDescription,
      productPrice: Number(f.productPrice),
      productStock: Number(f.productStock),
      categoryId: Number(f.categoryId)
    };

    const req = this.editMode() && this.editingId() != null
      ? this.productService.update(this.editingId()!, payload)
      : this.productService.create(payload);

    req.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.cancel();
        this.loadAll();
      },
      error: () => {
        this.errorMessage.set('Kayit islemi basarisiz');
      }
    });
  }

  remove(productId: number): void {
    if (!confirm('Urun silinsin mi?')) {
      return;
    }
    this.productService.delete(Number(productId))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadAll(),
        error: () => {
          this.errorMessage.set('Silme islemi basarisiz');
        }
      });
  }

  productStockBadge(stock: number): string {
    const value = Number(stock || 0);
    if (value <= 0) {
      return 'badge bg-danger';
    }
    if (value < 10) {
      return 'badge bg-warning text-dark';
    }
    return 'badge bg-success';
  }

  cancel(): void {
    this.showForm.set(false);
    this.editMode.set(false);
    this.editingId.set(null);
    this.form.set(this.emptyForm());
  }
}
