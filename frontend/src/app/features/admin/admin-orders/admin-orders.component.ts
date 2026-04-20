import { signal, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '../../../core/services/order.service';
import { UserService } from '../../../core/services/user.service';
import { ProductService } from '../../../core/services/product.service';
import { OrderItemService } from '../../../core/services/order-item.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly search = signal('');
  readonly statusFilter = signal('');

  readonly orders = signal<any[]>([]);
  readonly filteredOrders = signal<any[]>([]);
  readonly users = signal<any[]>([]);
  readonly products = signal<any[]>([]);
  readonly orderItemsByOrder = signal<Record<number, any[]>>({});

  readonly selectedOrder = signal<any>(null);
  readonly selectedItems = signal<any[]>([]);

  readonly showForm = signal(false);
  readonly editMode = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly form = signal<any>(this.emptyForm());

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private productService: ProductService,
    private orderItemService: OrderItemService
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
      userId: null,
      orderStatus: 'PENDING',
      orderTotalAmount: 0
    };
  }

  loadAll(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.userService.getAllUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (users: any) => {
        this.users.set(Array.isArray(users) ? users : []);
        this.productService.getAll().pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (products: any) => {
            this.products.set(Array.isArray(products) ? products : []);
            this.orderService.getAll().pipe(
              takeUntil(this.destroy$)
            ).subscribe({
              next: (orders: any) => {
                this.orders.set(Array.isArray(orders) ? orders : []);
                this.applyFilter();
                this.loading.set(false);
              },
              error: () => {
                this.errorMessage.set('Siparisler alinamadi');
                this.loading.set(false);
              }
            });
          },
          error: () => {
            this.errorMessage.set('Urunler alinamadi');
            this.loading.set(false);
          }
        });
      },
      error: () => {
        this.errorMessage.set('Kullanicilar alinamadi');
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

  applyFilter(): void {
    const q = this.search().toLowerCase();
    this.filteredOrders.set(this.orders().filter(o => {
      const idMatch = String(o.orderId || '').toLowerCase().includes(q);
      const statusMatch = !this.statusFilter() || String(o.orderStatus || '').toUpperCase() === this.statusFilter();
      return idMatch && statusMatch;
    }));
  }

  userName(userId: number): string {
    const u = this.users().find(x => Number(x.userId) === Number(userId));
    return u?.userFullName || u?.userEmail || `User ${userId}`;
  }

  productName(productId: number): string {
    const p = this.products().find(x => Number(x.productId) === Number(productId));
    return p?.productName || `Product ${productId}`;
  }

  openCreate(): void {
    this.editMode.set(false);
    this.editingId.set(null);
    this.form.set(this.emptyForm());
    this.showForm.set(true);
  }

  openEdit(order: any): void {
    this.editMode.set(true);
    this.editingId.set(Number(order.orderId));
    this.form.set({
      userId: Number(order.userId),
      orderStatus: order.orderStatus || 'PENDING',
      orderTotalAmount: Number(order.orderTotalAmount || 0)
    });
    this.showForm.set(true);
  }

  save(): void {
    const formValue = this.form();
    const payload = {
      userId: Number(formValue.userId),
      orderStatus: formValue.orderStatus,
      orderTotalAmount: Number(formValue.orderTotalAmount)
    };

    const request = this.editMode() && this.editingId() != null
      ? this.orderService.update(this.editingId()!, payload as any)
      : this.orderService.create(payload as any);

    request.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.cancel();
        this.loadAll();
      },
      error: () => {
        this.errorMessage.set('Siparis kaydedilemedi');
      }
    });
  }

  saveStatus(order: any): void {
    const payload = {
      orderTotalAmount: Number(order.orderTotalAmount || 0),
      orderStatus: order.orderStatus,
      userId: Number(order.userId)
    };
    this.orderService.update(Number(order.orderId), payload as any).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => this.loadAll(),
      error: () => {
        this.errorMessage.set('Durum guncellenemedi');
      }
    });
  }

  showDetails(order: any): void {
    this.selectedOrder.set(order);
    this.orderItemService.getByOrderId(Number(order.orderId)).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (items: any) => {
        this.selectedItems.set(Array.isArray(items) ? items : []);
      },
      error: () => {
        this.selectedItems.set([]);
      }
    });
  }

  remove(orderId: number): void {
    if (!confirm('Siparis silinsin mi?')) {
      return;
    }
    this.orderService.delete(Number(orderId)).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => this.loadAll(),
      error: () => {
        this.errorMessage.set('Silme islemi basarisiz');
      }
    });
  }

  cancel(): void {
    this.showForm.set(false);
    this.editMode.set(false);
    this.editingId.set(null);
    this.form.set(this.emptyForm());
  }
}
