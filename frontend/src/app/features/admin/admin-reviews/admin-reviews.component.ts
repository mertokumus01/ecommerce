import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ReviewService } from '../../../core/services/review.service';
import { ProductService } from '../../../core/services/product.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reviews.component.html',
  styleUrl: './admin-reviews.component.css'
})
export class AdminReviewsComponent implements OnInit {
  loading = false;
  errorMessage = '';
  search = '';

  reviews: any[] = [];
  filteredReviews: any[] = [];
  users: any[] = [];
  products: any[] = [];

  showForm = false;
  editMode = false;
  editingId: number | null = null;

  form: any = this.emptyForm();

  constructor(
    private reviewService: ReviewService,
    private productService: ProductService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  private emptyForm(): any {
    return {
      reviewRating: 5,
      reviewComment: '',
      productId: null,
      userId: null
    };
  }

  loadAll(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      reviews: this.reviewService.getAll(),
      products: this.productService.getAll(),
      users: this.userService.getAllUsers()
    }).subscribe({
      next: ({ reviews, products, users }) => {
        this.reviews = Array.isArray(reviews) ? reviews : [];
        this.products = Array.isArray(products) ? products : [];
        this.users = Array.isArray(users) ? users : [];
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Yorumlar yuklenemedi';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleCreate(): void {
    if (this.showForm && !this.editMode) {
      this.cancel();
      return;
    }

    this.openCreate();
  }

  applyFilter(): void {
    const query = this.search.toLowerCase();
    this.filteredReviews = this.reviews.filter((review) => {
      const comment = String(review.reviewComment || '').toLowerCase();
      const user = this.userName(review.userId).toLowerCase();
      const product = this.productName(review.productId).toLowerCase();
      return comment.includes(query) || user.includes(query) || product.includes(query);
    });
  }

  userName(userId: number): string {
    const user = this.users.find((item) => Number(item.userId) === Number(userId));
    return user?.userFullName || user?.userEmail || `User ${userId}`;
  }

  productName(productId: number): string {
    const product = this.products.find((item) => Number(item.productId) === Number(productId));
    return product?.productName || `Product ${productId}`;
  }

  openCreate(): void {
    this.editMode = false;
    this.editingId = null;
    this.form = this.emptyForm();
    this.showForm = true;
  }

  openEdit(review: any): void {
    this.editMode = true;
    this.editingId = Number(review.reviewId);
    this.form = {
      reviewRating: Number(review.reviewRating || 5),
      reviewComment: review.reviewComment || '',
      productId: Number(review.productId),
      userId: Number(review.userId)
    };
    this.showForm = true;
  }

  save(): void {
    const payload = {
      reviewRating: Number(this.form.reviewRating),
      reviewComment: this.form.reviewComment,
      productId: Number(this.form.productId),
      userId: Number(this.form.userId)
    };

    const request = this.editMode && this.editingId != null
      ? this.reviewService.update(this.editingId, payload)
      : this.reviewService.create(payload);

    request.subscribe({
      next: () => {
        this.cancel();
        this.loadAll();
      },
      error: () => {
        this.errorMessage = 'Yorum kaydedilemedi';
      }
    });
  }

  remove(reviewId: number): void {
    if (!confirm('Yorum silinsin mi?')) {
      return;
    }

    this.reviewService.delete(Number(reviewId)).subscribe({
      next: () => this.loadAll(),
      error: () => {
        this.errorMessage = 'Yorum silinemedi';
      }
    });
  }

  cancel(): void {
    this.showForm = false;
    this.editMode = false;
    this.editingId = null;
    this.form = this.emptyForm();
  }

  reviewBadge(rating: number): string {
    if (rating >= 5) {
      return 'badge bg-success';
    }

    if (rating >= 3) {
      return 'badge bg-warning text-dark';
    }

    return 'badge bg-danger';
  }
}