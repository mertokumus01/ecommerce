import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { OrderItemService } from '../../../core/services/order-item.service';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-admin-order-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-order-items.component.html',
  styleUrl: './admin-order-items.component.css'
})
export class AdminOrderItemsComponent implements OnInit {
  loading = false;
  errorMessage = '';
  search = '';

  orderItems: any[] = [];
  filteredOrderItems: any[] = [];
  orders: any[] = [];
  products: any[] = [];

  showForm = false;
  editMode = false;
  editingId: number | null = null;

  form: any = this.emptyForm();

  constructor(
    private orderItemService: OrderItemService,
    private orderService: OrderService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  private emptyForm(): any {
    return {
      orderId: null,
      productId: null,
      orderItemQuantity: 1,
      orderItemPrice: 0
    };
  }

  loadAll(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      orderItems: this.orderItemService.getAll(),
      orders: this.orderService.getAll(),
      products: this.productService.getAll()
    }).subscribe({
      next: ({ orderItems, orders, products }) => {
        this.orderItems = Array.isArray(orderItems) ? orderItems : [];
        this.orders = Array.isArray(orders) ? orders : [];
        this.products = Array.isArray(products) ? products : [];
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Siparis kalemleri yuklenemedi';
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
    this.filteredOrderItems = this.orderItems.filter((item) => {
      const order = this.orderName(item.orderId).toLowerCase();
      const product = this.productName(item.productId).toLowerCase();
      return order.includes(query) || product.includes(query) || String(item.orderItemId || '').includes(query);
    });
  }

  orderName(orderId: number): string {
    const order = this.orders.find((item) => Number(item.orderId) === Number(orderId));
    return order ? `Siparis #${order.orderId}` : `Siparis #${orderId}`;
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

  openEdit(orderItem: any): void {
    this.editMode = true;
    this.editingId = Number(orderItem.orderItemId);
    this.form = {
      orderId: Number(orderItem.orderId),
      productId: Number(orderItem.productId),
      orderItemQuantity: Number(orderItem.orderItemQuantity || 1),
      orderItemPrice: Number(orderItem.orderItemPrice || 0)
    };
    this.showForm = true;
  }

  save(): void {
    const payload = {
      orderId: Number(this.form.orderId),
      productId: Number(this.form.productId),
      orderItemQuantity: Number(this.form.orderItemQuantity),
      orderItemPrice: Number(this.form.orderItemPrice)
    };

    const request = this.editMode && this.editingId != null
      ? this.orderItemService.update(this.editingId, payload)
      : this.orderItemService.create(payload);

    request.subscribe({
      next: () => {
        this.cancel();
        this.loadAll();
      },
      error: () => {
        this.errorMessage = 'Siparis kalemi kaydedilemedi';
      }
    });
  }

  remove(orderItemId: number): void {
    if (!confirm('Siparis kalemi silinsin mi?')) {
      return;
    }

    this.orderItemService.delete(Number(orderItemId)).subscribe({
      next: () => this.loadAll(),
      error: () => {
        this.errorMessage = 'Siparis kalemi silinemedi';
      }
    });
  }

  cancel(): void {
    this.showForm = false;
    this.editMode = false;
    this.editingId = null;
    this.form = this.emptyForm();
  }
}