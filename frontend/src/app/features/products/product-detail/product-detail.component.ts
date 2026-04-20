import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Product, Review } from '../../../shared/models';
import { ProductService } from '../../../core/services/product.service';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private reviewService = inject(ReviewService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  product: Product | null = null;
  reviews: Review[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  private loadProduct(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getById(id).subscribe({
      next: (response: any) => {
        if (response && typeof response === 'object') {
          this.product = response.data || response;
          if (this.product?.productId || this.product?.id) {
            this.loadReviews(this.product.productId || this.product.id || 0);
          }
        } else {
          this.errorMessage = 'Product not found';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Failed to load product details';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadReviews(productId: number): void {
    this.reviewService.getByProductId(productId).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.reviews = response;
        } else if (response?.data) {
          this.reviews = response.data;
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading reviews', error);
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  addToCart(): void {
    if (this.product) {
      alert(`Added ${this.product.productName} to cart`);
    }
  }
}
