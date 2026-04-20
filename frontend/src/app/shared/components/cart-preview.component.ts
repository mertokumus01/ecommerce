import { ChangeDetectorRef, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderItemService } from '../../core/services/order-item.service';
import { ProductService } from '../../core/services/product.service';
import { CartStateService } from '../../core/services/cart-state.service';

interface CartItem {
  orderItemId: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
}

@Component({
  selector: 'app-cart-preview',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="cart-preview-backdrop" *ngIf="isOpen" (click)="close.emit()"></div>
    <div class="cart-preview-modal" *ngIf="isOpen">
      <div class="cart-preview-header">
        <h3>🛒 Sepetim</h3>
        <button class="close-btn" (click)="close.emit()">✕</button>
      </div>

      <div class="cart-preview-body">
        <div *ngIf="items.length === 0" class="empty-cart">
          <div class="empty-icon">🛒</div>
          <p>Sepetiniz boş</p>
        </div>

        <div *ngIf="items.length > 0" class="cart-items">
          <div *ngFor="let item of items" class="cart-item">
            <div class="item-info">
              <h5>{{ item.productName }}</h5>
            </div>
            <div class="item-qty">
              <button class="qty-btn" (click)="decreaseQuantity(item)">−</button>
              <span>{{ item.quantity }}</span>
              <button class="qty-btn" (click)="increaseQuantity(item)">+</button>
            </div>
            <div class="item-total">
              ₺{{ (item.productPrice * item.quantity) | number:'1.0-0' }}
            </div>
            <button class="remove-btn" (click)="removeItem(item)">✕</button>
          </div>

          <div class="cart-summary">
            <div class="summary-line">
              <span>Toplam:</span>
              <span class="total">₺{{ getTotal() | number:'1.0-0' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-preview-footer" *ngIf="items.length > 0">
        <button routerLink="/cart" (click)="close.emit()" class="btn-go-to-cart">
          Sepete Git →
        </button>
      </div>
    </div>
  `,
  styles: [`
    .cart-preview-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }

    .cart-preview-modal {
      position: fixed;
      top: 80px;
      right: 20px;
      width: 350px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      max-height: 600px;
    }

    .cart-preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
      background: #f8f8f8;
    }

    .cart-preview-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: #000;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
      transition: color 0.3s;
    }

    .close-btn:hover {
      color: #000;
    }

    .cart-preview-body {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 1rem;
    }

    .empty-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      text-align: center;
      color: #999;
    }

    .empty-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-cart p {
      margin: 0;
      font-size: 0.9rem;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .cart-item {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto auto;
      gap: 0.6rem;
      padding: 0.8rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      align-items: center;
      width: 100%;
    }

    .item-info {
      min-width: 0;
    }

    .item-info h5 {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 600;
      color: #000;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-qty {
      font-size: 0.85rem;
      text-align: center;
      color: #666;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      justify-content: center;
    }

    .qty-btn {
      width: 24px;
      height: 24px;
      border: 1px solid #ddd;
      background: #fff;
      cursor: pointer;
      border-radius: 4px;
      font-weight: 700;
      line-height: 1;
    }

    .qty-btn:hover {
      background: #f2f2f2;
    }

    .item-total {
      text-align: right;
      font-weight: 700;
      color: #d4af37;
      font-size: 0.9rem;
      white-space: nowrap;
    }

    .remove-btn {
      border: 1px solid #e0e0e0;
      background: #fff;
      color: #999;
      border-radius: 4px;
      cursor: pointer;
      width: 28px;
      height: 28px;
    }

    .remove-btn:hover {
      border-color: #000;
      color: #000;
    }

    .cart-summary {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8f8f8;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
    }

    .summary-line {
      display: flex;
      justify-content: space-between;
      font-weight: 700;
      color: #000;
    }

    .summary-line .total {
      color: #d4af37;
      font-size: 1.1rem;
    }

    .cart-preview-footer {
      padding: 1rem;
      border-top: 1px solid #e0e0e0;
      background: #f8f8f8;
    }

    .btn-go-to-cart {
      width: 100%;
      padding: 0.9rem;
      background: #000;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.3s;
      font-size: 0.95rem;
    }

    .btn-go-to-cart:hover {
      background: #333;
    }

    @media (max-width: 768px) {
      .cart-preview-modal {
        width: 90vw;
        right: 5vw;
        max-height: 500px;
      }

      .cart-item {
        grid-template-columns: minmax(0, 1fr) auto auto;
        grid-template-areas:
          'name qty remove'
          'total total total';
      }

      .item-info {
        grid-area: name;
      }

      .item-qty {
        grid-area: qty;
      }

      .remove-btn {
        grid-area: remove;
      }

      .item-total {
        grid-area: total;
        text-align: left;
        padding-left: 0.2rem;
      }
    }

    @media (max-width: 480px) {
      .cart-preview-modal {
        width: 94vw;
        right: 3vw;
        top: 60px;
        border-radius: 8px;
      }

      .item-info h5 {
        font-size: 0.85rem;
      }

      .qty-btn,
      .remove-btn {
        width: 26px;
        height: 26px;
      }
    }
  `]
})
export class CartPreviewComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() orderId: number | null = null;
  @Output() close = new EventEmitter<void>();

  items: CartItem[] = [];
  isLoading = false;

  constructor(
    private orderItemService: OrderItemService,
    private productService: ProductService,
    private cartStateService: CartStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['isOpen'] || changes['orderId']) && this.isOpen && this.orderId) {
      this.loadCartItems();
    } else if ((changes['isOpen'] || changes['orderId']) && (!this.isOpen || !this.orderId)) {
      this.items = [];
      this.cdr.detectChanges();
    }
  }

  loadCartItems(): void {
    if (!this.orderId) return;

    this.isLoading = true;
    this.orderItemService.getByOrderId(this.orderId).subscribe({
      next: (orderItems) => {
        this.items = (orderItems as any[]).map(oi => ({
          orderItemId: oi.orderItemId,
          productId: oi.productId,
          quantity: oi.orderItemQuantity,
          productName: '',
          productPrice: oi.orderItemPrice
        }));

        this.items.forEach((item, index) => {
          this.productService.getById(item.productId).subscribe({
            next: (response: any) => {
              const product = response.data || response;
              this.items[index].productName = product.productName || 'Ürün';
              this.items[index].productPrice = product.productPrice || item.productPrice;
              this.cdr.detectChanges();
            },
            error: () => {
              this.items[index].productName = 'Ürün';
              this.cdr.detectChanges();
            }
          });
        });

        this.isLoading = false;
        this.publishCartState();
        this.cdr.detectChanges();
      },
      error: () => {
        this.items = [];
        this.isLoading = false;
        this.publishCartState();
        this.cdr.detectChanges();
      }
    });
  }

  increaseQuantity(item: CartItem): void {
    this.updateQuantity(item, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity <= 1) {
      return;
    }
    this.updateQuantity(item, item.quantity - 1);
  }

  removeItem(item: CartItem): void {
    this.orderItemService.delete(item.orderItemId).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.orderItemId !== item.orderItemId);
        this.publishCartState();
        this.cdr.detectChanges();
      },
      error: () => this.loadCartItems()
    });
  }

  private updateQuantity(item: CartItem, nextQuantity: number): void {
    if (!this.orderId) {
      return;
    }

    this.orderItemService.update(item.orderItemId, {
      orderItemQuantity: nextQuantity,
      orderItemPrice: item.productPrice,
      orderId: this.orderId,
      productId: item.productId
    }).subscribe({
      next: () => {
        item.quantity = nextQuantity;
        this.publishCartState();
        this.cdr.detectChanges();
      },
      error: () => this.loadCartItems()
    });
  }

  private publishCartState(): void {
    this.cartStateService.setCartState({
      orderId: this.orderId,
      itemCount: this.items.reduce((sum, i) => sum + i.quantity, 0)
    });
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
  }
}
