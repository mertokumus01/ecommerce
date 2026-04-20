import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

// Home Component
import { HomeComponent } from './features/home/home.component';

// Auth Components
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { ChangePasswordComponent } from './features/auth/change-password/change-password.component';

// Product Components
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';

// Order Components
import { OrdersComponent } from './features/orders/orders.component';

// User Components
import { UserProfileComponent } from './features/user/user-profile/user-profile.component';

// Cart & Checkout Components
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';

// Admin Components
import { AdminLoginComponent } from './features/admin/admin-login/admin-login.component';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './features/admin/admin-users/admin-users.component';
import { AdminProductsComponent } from './features/admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './features/admin/admin-orders/admin-orders.component';
import { AdminCategoriesComponent } from './features/admin/admin-categories/admin-categories.component';
import { AdminReviewsComponent } from './features/admin/admin-reviews/admin-reviews.component';
import { AdminOrderItemsComponent } from './features/admin/admin-order-items/admin-order-items.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home' }
  },

  // Auth Routes - Public
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login' }
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: { title: 'Register' }
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [AuthGuard],
        data: { title: 'Change Password' }
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // Product Routes - Public
  {
    path: 'products',
    children: [
      {
        path: '',
        component: ProductListComponent,
        data: { title: 'Products' }
      },
      {
        path: ':id',
        component: ProductDetailComponent,
        data: { title: 'Product Details' }
      }
    ]
  },

  // Order Routes - Protected
  {
    path: 'orders',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: OrdersComponent,
        data: { title: 'My Orders' }
      }
    ]
  },

  // User Routes - Protected
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: UserProfileComponent,
    data: { title: 'User Profile' }
  },

  // Cart & Checkout Routes - Protected
  {
    path: 'cart',
    canActivate: [AuthGuard],
    component: CartComponent,
    data: { title: 'Shopping Cart' }
  },

  {
    path: 'checkout',
    canActivate: [AuthGuard],
    component: CheckoutComponent,
    data: { title: 'Checkout' }
  },

  // Admin Routes
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        component: AdminLoginComponent,
        data: { title: 'Admin Login' }
      },
      {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [AdminGuard],
        canActivateChild: [AdminGuard],
        children: [
          {
            path: 'dashboard',
            component: AdminDashboardComponent,
            data: { title: 'Dashboard' }
          },
          {
            path: 'users',
            component: AdminUsersComponent,
            data: { title: 'Users Management' }
          },
          {
            path: 'products',
            component: AdminProductsComponent,
            data: { title: 'Products Management' }
          },
          {
            path: 'categories',
            component: AdminCategoriesComponent,
            data: { title: 'Categories Management' }
          },
          {
            path: 'orders',
            component: AdminOrdersComponent,
            data: { title: 'Orders Management' }
          },
          {
            path: 'order-items',
            component: AdminOrderItemsComponent,
            data: { title: 'Order Items Management' }
          },
          {
            path: 'reviews',
            component: AdminReviewsComponent,
            data: { title: 'Reviews Management' }
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          }
        ]
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: '/products'
  }
];
