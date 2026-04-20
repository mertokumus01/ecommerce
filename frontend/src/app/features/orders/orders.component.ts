import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Order } from '../../shared/models'; 
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  orders: Order[] = [];
  isLoading = false;
  errorMessage = '';
  currentUserId: number | null = null;

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.userId ?? null;
        this.loadOrders();
      }
    });
  }

  loadOrders(): void {
    if (!this.currentUserId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getByUserId(this.currentUserId).subscribe({
      next: (response: any) => {
        if (response) {
          this.orders = response;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Failed to load orders';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusBadge(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-warning';
      case 'confirmed':
        return 'bg-info';
      case 'shipped':
        return 'bg-primary';
      case 'delivered':
        return 'bg-success';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  canDelete(status: string): boolean {
    const deletableStatuses = ['PENDING', 'CONFIRMED'];
    return deletableStatuses.includes(status?.toUpperCase() || '');
  }

  viewDetails(orderId: number): void {
    this.router.navigate(['/orders', orderId]);
  }

  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.delete(orderId).subscribe({
        next: () => {
          this.loadOrders();
        },
        error: (error) => {
          alert('Failed to delete order');
        }
      });
    }
  }

  newOrder(): void {
    this.router.navigate(['/products']);
  }
}