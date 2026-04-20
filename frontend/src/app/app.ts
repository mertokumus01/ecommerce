import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './shared/components/toast.component';
import { Router } from '@angular/router';
import { Subscription, switchMap, of } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { User } from './shared/models';
import { OrderService } from './core/services/order.service';
import { CartPreviewComponent } from './shared/components/cart-preview.component';
import { CartStateService } from './core/services/cart-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, ToastComponent, CartPreviewComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  showMenu = false;
  showUserMenu = false;
  isLoggedIn = false;
  currentUserName = '';
  currentUserEmail = '';
  showCartPreview = false;
  cartItemCount = 0;
  cartOrderId: number | null = null;

  private readonly subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private orderService: OrderService,
    private cartStateService: CartStateService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.token$.subscribe(token => {
        this.isLoggedIn = !!token;
        if (this.isLoggedIn) {
          this.authService.getCurrentUser().subscribe({ error: () => undefined });
          this.loadCartInfo();
        } else {
          this.currentUserName = '';
          this.currentUserEmail = '';
          this.showUserMenu = false;
          this.cartItemCount = 0;
          this.cartOrderId = null;
          this.showCartPreview = false;
        }
      })
    );

    this.subscriptions.add(
      this.authService.currentUser$.subscribe((user: User | null) => {
        this.currentUserName = user?.userFullName || '';
        this.currentUserEmail = user?.userEmail || '';
      })
    );

    this.subscriptions.add(
      this.cartStateService.cartState$.subscribe(() => {
        if (this.isLoggedIn) {
          this.loadCartInfo();
        }
      })
    );

    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe({ error: () => undefined });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.showUserMenu = !this.showUserMenu;
  }

  goProfile(): void {
    this.showUserMenu = false;
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.showUserMenu = false;
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  @HostListener('document:click')
  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  toggleCartPreview(): void {
    this.showCartPreview = !this.showCartPreview;
  }

  private loadCartInfo(): void {
    this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (!user || !user.userId) return of(null);
        return this.orderService.getByUserId(user.userId);
      })
    ).subscribe({
      next: (orders) => {
        if (!orders || !Array.isArray(orders)) return;
        const cartOrder = (orders as any[]).find((o: any) => o.orderStatus === 'CART');
        if (cartOrder) {
          this.cartOrderId = cartOrder.orderId;
          if (cartOrder.orderItems) {
            this.cartItemCount = cartOrder.orderItems.length;
          }
        } else {
          this.cartItemCount = 0;
        }
      },
      error: () => {
        this.cartItemCount = 0;
      }
    });
  }
}
