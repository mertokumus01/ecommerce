import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { OrderItemService, OrderItemResponse } from '../../core/services/order-item.service';
import { ProductService } from '../../core/services/product.service';
import { CartStateService } from '../../core/services/cart-state.service';

interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  category: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  // Signals
  readonly cartItems = signal<OrderItem[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  // Computed totals
  readonly subtotal = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  readonly shippingCost = computed(() => {
    const sub = this.subtotal();
    return sub > 100 ? 0 : 9.99;
  });

  readonly discount = computed(() => {
    const sub = this.subtotal();
    return sub > 200 ? sub * 0.1 : 0;
  });

  readonly total = computed(() => {
    return this.subtotal() + this.shippingCost() - this.discount();
  });

  readonly isEmpty = computed(() => this.cartItems().length === 0);
  readonly itemCount = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  private currentOrderId: number | null = null;
  private currentUserId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private orderItemService: OrderItemService,
    private productService: ProductService,
    private cartStateService: CartStateService
  ) {
    // Watch for total changes and sync to backend
    effect(() => {
      if (this.currentOrderId && this.currentUserId && this.total() > 0) {
        this.syncOrderTotal();
      }
    });
  }

  ngOnInit() {
    this.loadCartItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCartItems(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.getCurrentUser()
      .pipe(
        switchMap(user => {
          if (!user?.userId) {
            return of({ orders: [], products: [], items: [] as OrderItemResponse[] });
          }

          this.currentUserId = Number(user.userId);

          return this.orderService.getByUserId(this.currentUserId).pipe(
            switchMap((orders: any[]) => {
              const cartOrders = (orders || []).filter(order => order?.orderStatus === 'CART');
              if (cartOrders.length === 0) {
                return of({ orders: [], products: [], items: [] as OrderItemResponse[] });
              }

              const cartOrder = cartOrders.sort((a, b) => 
                Number(b.orderId || 0) - Number(a.orderId || 0)
              )[0];
              this.currentOrderId = Number(cartOrder.orderId);

              return forkJoin({
                orders: of(orders),
                products: this.productService.getAll().pipe(catchError(() => of([]))),
                items: this.orderItemService.getByOrderId(this.currentOrderId).pipe(catchError(() => of([])))
              });
            })
          );
        }),
        catchError(() => of({ orders: [], products: [], items: [] as OrderItemResponse[] })),
        takeUntil(this.destroy$)
      )
      .subscribe(({ products, items }) => {
        const productMap = new Map<number, any>();
        (products as any[]).forEach(product => productMap.set(Number(product.productId), product));

        const cartItems = (items as OrderItemResponse[]).map(item => {
          const product = productMap.get(Number(item.productId));
          return {
            id: Number(item.orderItemId),
            productId: Number(item.productId),
            productName: product?.productName || `Urun #${item.productId}`,
            category: product?.categoryId ? `Kategori #${product.categoryId}` : 'Kategori',
            price: Number(item.orderItemPrice || product?.productPrice || 0),
            quantity: Number(item.orderItemQuantity || 1)
          };
        });

        this.cartItems.set(cartItems);
        this.syncCartState();
        this.isLoading.set(false);
      });
  }

  increaseQuantity(index: number): void {
    const items = this.cartItems();
    if (index >= 0 && index < items.length) {
      items[index].quantity++;
      this.cartItems.set([...items]);
      this.persistItem(index);
    }
  }

  decreaseQuantity(index: number): void {
    const items = this.cartItems();
    if (index >= 0 && index < items.length && items[index].quantity > 1) {
      items[index].quantity--;
      this.cartItems.set([...items]);
      this.persistItem(index);
    }
  }

  updateQuantity(index: number, quantity: number): void {
    const items = this.cartItems();
    if (index >= 0 && index < items.length) {
      items[index].quantity = Math.max(1, quantity);
      this.cartItems.set([...items]);
      this.persistItem(index);
    }
  }

  removeItem(index: number): void {
    const items = this.cartItems();
    if (index < 0 || index >= items.length) return;

    const itemId = items[index]?.id;
    items.splice(index, 1);
    this.cartItems.set([...items]);

    if (itemId) {
      this.orderItemService.delete(Number(itemId))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.syncCartState();
            this.syncOrderTotal();
          },
          error: () => this.loadCartItems()
        });
    } else {
      this.syncCartState();
      this.syncOrderTotal();
    }
  }

  private persistItem(index: number): void {
    const items = this.cartItems();
    const item = items[index];
    if (!item || !item.id || !this.currentOrderId) {
      return;
    }

    this.orderItemService.update(Number(item.id), {
      orderItemQuantity: item.quantity,
      orderItemPrice: item.price,
      orderId: this.currentOrderId,
      productId: item.productId
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.syncCartState(),
        error: () => this.loadCartItems()
      });
  }

  private syncOrderTotal(): void {
    if (!this.currentOrderId || !this.currentUserId) {
      return;
    }

    const nextTotal = Math.max(0, Math.round(this.total()));
    this.orderService.update(this.currentOrderId, {
      orderTotalAmount: nextTotal,
      orderStatus: 'CART',
      userId: this.currentUserId
    } as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ error: () => undefined });
  }

  private syncCartState(): void {
    this.cartStateService.setCartState({
      orderId: this.currentOrderId,
      itemCount: this.itemCount()
    });
  }
}
