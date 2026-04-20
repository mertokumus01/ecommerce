import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { OrderItemService, OrderItemResponse } from '../../core/services/order-item.service';
import { ProductService } from '../../core/services/product.service';
import { CheckoutOptionsService, CityDto } from '../../core/services/checkout-options.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  // Forms
  shippingForm: FormGroup;
  paymentForm: FormGroup;

  // Signals
  readonly cartItems = signal<any[]>([]);
  readonly shippingMethods = signal<Array<{ id: number; name: string; description: string; price: number }>>([]);
  readonly paymentMethods = signal<Array<{ id: number; name: string; icon: string; description: string }>>([]);
  readonly cities = signal<CityDto[]>([]);
  readonly isLoading = signal(false);

  readonly selectedShipping = signal<number | null>(null);
  readonly selectedPayment = signal<number | null>(null);

  readonly cardNumber = signal('');
  readonly cardholderName = signal('');
  readonly expiryDate = signal('');
  readonly cvv = signal('');
  readonly saveCard = signal(false);
  readonly requestInvoice = signal(false);

  // Computed values
  readonly expiryMonth = computed(() => {
    const parts = this.expiryDate().split('/');
    return parts[0] || 'MM';
  });

  readonly expiryYear = computed(() => {
    const parts = this.expiryDate().split('/');
    return parts[1] || 'YY';
  });

  readonly subtotal = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  readonly shippingCost = computed(() => {
    const sub = this.subtotal();
    const shipping = this.shippingMethods().find(m => m.id === this.selectedShipping());
    const shippingPrice = shipping ? shipping.price : 0;
    return sub > 100 ? 0 : shippingPrice;
  });

  readonly discount = computed(() => {
    const sub = this.subtotal();
    return sub > 200 ? sub * 0.1 : 0;
  });

  readonly total = computed(() => {
    return this.subtotal() + this.shippingCost() - this.discount();
  });

  readonly isCardPaymentSelected = computed(() => {
    const selected = this.paymentMethods().find(m => m.id === this.selectedPayment());
    return !!selected && /kart/i.test(selected?.name || '');
  });

  readonly isBankTransferSelected = computed(() => {
    const selected = this.paymentMethods().find(m => m.id === this.selectedPayment());
    return !!selected && /banka|havale|eft/i.test(selected?.name || '');
  });

  private currentOrderId: number | null = null;
  private currentUserId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private orderService: OrderService,
    private orderItemService: OrderItemService,
    private productService: ProductService,
    private checkoutOptionsService: CheckoutOptionsService
  ) {
    this.shippingForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
      district: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    });

    this.paymentForm = this.fb.group({
      acceptTerms: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
    this.loadCheckoutOptions();
    this.loadCartItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCheckoutOptions(): void {
    this.isLoading.set(true);

    forkJoin({
      shippingMethods: this.checkoutOptionsService.getShippingMethods().pipe(catchError(() => of([]))),
      paymentMethods: this.checkoutOptionsService.getPaymentMethods().pipe(catchError(() => of([]))),
      cities: this.checkoutOptionsService.getCities().pipe(catchError(() => of([])))
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ shippingMethods, paymentMethods, cities }) => {
        if (shippingMethods.length > 0) {
          const methods = shippingMethods.map(method => ({
            id: Number(method.shippingMethodId),
            name: method.shippingName,
            description: method.shippingDescription,
            price: Number(method.shippingPrice)
          }));
          this.shippingMethods.set(methods);
          this.selectedShipping.set(methods[0].id);
        }

        if (paymentMethods.length > 0) {
          const methods = paymentMethods.map(method => ({
            id: Number(method.paymentMethodId),
            name: method.paymentName,
            icon: method.paymentIcon,
            description: method.paymentDescription
          }));
          this.paymentMethods.set(methods);
          this.selectedPayment.set(methods[0].id);
        }

        this.cities.set(cities);
        this.isLoading.set(false);
      });
  }

  private loadCartItems(): void {
    this.authService.getCurrentUser()
      .pipe(
        switchMap(user => {
          if (!user?.userId) {
            return of({ products: [], items: [] as OrderItemResponse[] });
          }

          this.currentUserId = Number(user.userId);

          return this.orderService.getByUserId(this.currentUserId).pipe(
            switchMap((orders: any[]) => {
              const cartOrders = (orders || []).filter(order => order?.orderStatus === 'CART');
              if (cartOrders.length === 0) {
                return of({ products: [], items: [] as OrderItemResponse[] });
              }

              const cartOrder = cartOrders.sort((a, b) =>
                Number(b.orderId || 0) - Number(a.orderId || 0)
              )[0];
              this.currentOrderId = Number(cartOrder.orderId);

              return forkJoin({
                products: this.productService.getAll().pipe(catchError(() => of([]))),
                items: this.orderItemService.getByOrderId(this.currentOrderId).pipe(catchError(() => of([])))
              });
            })
          );
        }),
        catchError(() => of({ products: [], items: [] as OrderItemResponse[] })),
        takeUntil(this.destroy$)
      )
      .subscribe(({ products, items }) => {
        const productMap = new Map<number, any>();
        (products as any[]).forEach(product => productMap.set(Number(product.productId), product));

        const cartItems = (items as OrderItemResponse[]).map(item => {
          const product = productMap.get(Number(item.productId));
          return {
            orderItemId: Number(item.orderItemId),
            productId: Number(item.productId),
            productName: product?.productName || `Urun #${item.productId}`,
            price: Number(item.orderItemPrice || product?.productPrice || 0),
            quantity: Number(item.orderItemQuantity || 1)
          };
        });

        this.cartItems.set(cartItems);
      });
  }

  formatCardNumber(): void {
    const val = this.cardNumber().replace(/\D/g, '').slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    this.cardNumber.set(formatted);
  }

  formatExpiryDate(): void {
    const val = this.expiryDate().replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      if (val.length === 4) {
        this.expiryDate.set(val.slice(0, 2) + '/' + val.slice(2));
      } else {
        this.expiryDate.set(val);
      }
    }
  }

  getError(field: string): boolean {
    const control = this.shippingForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  completeOrder(): void {
    if (!this.shippingForm.valid || !this.currentOrderId || !this.currentUserId) {
      return;
    }

    this.orderService.update(this.currentOrderId, {
      orderTotalAmount: Math.max(0, Math.round(this.total())),
      orderStatus: 'CONFIRMED',
      userId: this.currentUserId
    } as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert('Siparisiniz basariyla olusturulmustur!');
        }
      });
  }
}
