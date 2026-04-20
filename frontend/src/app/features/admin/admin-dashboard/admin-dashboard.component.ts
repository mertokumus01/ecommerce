import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { UserService } from '../../../core/services/user.service';
import { CategoryService } from '../../../core/services/category.service';
import { ReviewService } from '../../../core/services/review.service';
import { OrderItemService } from '../../../core/services/order-item.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly totalSales = signal(0);
  readonly totalCategories = signal(0);
  readonly totalOrders = signal(0);
  readonly totalOrderItems = signal(0);
  readonly totalReviews = signal(0);
  readonly totalUsers = signal(0);
  readonly totalProducts = signal(0);
  readonly recentOrders = signal<any[]>([]);
  readonly recentReviews = signal<any[]>([]);
  readonly users = signal<any[]>([]);

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService,
    private categoryService: CategoryService,
    private reviewService: ReviewService,
    private orderItemService: OrderItemService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      products: this.productService.getAll(),
      orders: this.orderService.getAll(),
      users: this.userService.getAllUsers(),
      categories: this.categoryService.getAll(),
      reviews: this.reviewService.getAll(),
      orderItems: this.orderItemService.getAll()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ products, orders, users, categories, reviews, orderItems }) => {
          const orderList = (orders as any[]) || [];
          const reviewList = (reviews as any[]) || [];
          const userList = (users as any[]) || [];

          this.users.set(userList);
          this.totalCategories.set(((categories as any[]) || []).length);
          this.totalProducts.set(((products as any[]) || []).length);
          this.totalOrders.set(orderList.length);
          this.totalOrderItems.set(((orderItems as any[]) || []).length);
          this.totalReviews.set(reviewList.length);
          this.totalUsers.set(userList.length);
          this.totalSales.set(orderList.reduce((sum, order) => sum + (order.orderTotalAmount || 0), 0));
          this.recentOrders.set(
            orderList.slice().sort((a, b) => (b.orderId || 0) - (a.orderId || 0)).slice(0, 10)
          );
          this.recentReviews.set(
            reviewList.slice().sort((a, b) => (b.reviewId || 0) - (a.reviewId || 0)).slice(0, 5)
          );
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Dashboard verileri alinamadi');
          this.loading.set(false);
        }
      });
  }

  getUserName(userId: number): string {
    const user = this.users().find(u => u.userId === userId);
    return user ? user.userFullName : 'Bilinmeyen';
  }

  getOrderStatusBadge(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'badge bg-warning text-dark',
      'CONFIRMED': 'badge bg-info',
      'SHIPPED': 'badge bg-primary',
      'DELIVERED': 'badge bg-success',
      'CANCELLED': 'badge bg-danger',
      'CART': 'badge bg-secondary'
    };
    return statusMap[status] || 'badge bg-secondary';
  }

  
  getReviewBadge(rating: number): string {
    if (rating >= 5) {
      return 'badge bg-success';
    }

    if (rating >= 3) {
      return 'badge bg-warning text-dark';
    }

    return 'badge bg-danger';
  }
}
