import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Product, Review } from '../../shared/models';
import { ProductService } from '../../core/services/product.service';
import { ReviewService } from '../../core/services/review.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-product-detail-old',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: ``
})
export class OldProductDetailComponent implements OnInit {
  product: Product | null = null;
  reviews: Review[] = [];
  newReview = {
    reviewRating: '',
    reviewComment: ''
  };
  isLoading = false;
  errorMessage = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProductDetail(productId);
        this.loadReviews(productId);
      }
    });
  }

  loadProductDetail(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getById(id).subscribe({
      next: (response: any) => {
        if (response && typeof response === 'object') {
          this.product = response;
        } else {
          this.errorMessage = 'Product not found';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load product details';
        this.isLoading = false;
      }
    });
  }

  loadReviews(productId: number): void {
    this.reviewService.getByProductId(productId).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.reviews = response;
        } else if (response) {
          this.reviews = response;
        }
      },
      error: (error) => {
        console.error('Error loading reviews', error);
      }
    });
  }

  addToCart(): void {
    alert('Add to cart functionality would be implemented with a shopping cart service');
  }

  submitReview(): void {
    if (!this.newReview.reviewRating || !this.newReview.reviewComment) {
      alert('Please fill in all fields');
      return;
    }

    alert('Review submission would be implemented with review service integration');
    this.newReview = { reviewRating: '', reviewComment: '' };
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
