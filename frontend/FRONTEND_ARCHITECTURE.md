# 🎨 Frontend Architecture - Angular 2026 Modern Structure

## 📋 İçindekiler
1. [Proje Yapısı](#proje-yapısı)
2. [Dosya Düzenlemesi](#dosya-düzenlemesi)
3. [Component Yapısı](#component-yapısı)
4. [Service Katmanı](#service-katmanı)
5. [Model/Interface Yönetimi](#modelinterface-yönetimi)
6. [Routing Yapılandırması](#routing-yapılandırması)
7. [Ortam Yapılandırması](#ortam-yapılandırması)
8. [Başlatma ve Test](#başlatma-ve-test)

---

## 📁 Proje Yapısı

```
frontend/
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.css
│   ├── app/
│   │   ├── app.config.ts           # Angular konfigürasyonu
│   │   ├── app.ts                  # Root component
│   │   ├── app.routes.ts           # Routing tanımları
│   │   │
│   │   ├── core/                   # Singleton services, guards, interceptors
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts      # Kimlik doğrulama koruması
│   │   │   ├── interceptors/
│   │   │   │   └── jwt.interceptor.ts # JWT token enjeksiyonu
│   │   │   └── services/
│   │   │       ├── auth.service.ts           # Kimlik doğrulama
│   │   │       ├── category.service.ts       # Kategori işlemleri
│   │   │       ├── product.service.ts        # Ürün işlemleri
│   │   │       ├── order.service.ts          # Sipariş işlemleri
│   │   │       └── review.service.ts         # Yorum işlemleri
│   │   │
│   │   ├── features/                # Feature modules (lazy-loaded)
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.ts
│   │   │   │   │   ├── login.component.html
│   │   │   │   │   └── login.component.css
│   │   │   │   └── register/
│   │   │   │       ├── register.component.ts
│   │   │   │       ├── register.component.html
│   │   │   │       └── register.component.css
│   │   │   ├── products/
│   │   │   │   ├── product-list/
│   │   │   │   │   ├── product-list.component.ts
│   │   │   │   │   ├── product-list.component.html
│   │   │   │   │   └── product-list.component.css
│   │   │   │   └── product-detail/
│   │   │   │       ├── product-detail.component.ts
│   │   │   │       ├── product-detail.component.html
│   │   │   │       └── product-detail.component.css
│   │   │   ├── orders/
│   │   │   │   ├── orders.component.ts
│   │   │   │   ├── orders.component.html
│   │   │   │   └── orders.component.css
│   │   │   └── user/
│   │   │       └── user-profile/
│   │   │           ├── user-profile.component.ts
│   │   │           ├── user-profile.component.html
│   │   │           └── user-profile.component.css
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── header/
│   │   │   │   ├── header.component.ts
│   │   │   │   ├── header.component.html
│   │   │   │   └── header.component.css
│   │   │   └── footer/
│   │   │       ├── footer.component.ts
│   │   │       ├── footer.component.html
│   │   │       └── footer.component.css
│   │   │
│   │   └── shared/                  # Paylaşılan kaynaklar
│   │       ├── models/
│   │       │   ├── user.model.ts
│   │       │   ├── category.model.ts
│   │       │   ├── product.model.ts
│   │       │   ├── order.model.ts
│   │       │   ├── review.model.ts
│   │       │   └── index.ts         # Merkezi export dosyası
│   │       └── components/
│   │           └── (ortak UI bileşenleri)
│   │
│   └── environments/
│       ├── environment.ts           # Development ortamı
│       └── environment.prod.ts      # Production ortamı
│
├── public/
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── angular.json
└── README.md
```

---

## 🔄 Dosya Düzenlemesi (Modern Angular 2026)

### Neden Değişti?

| Eski Yapı | Yeni Yapı | Avantaj |
|-----------|-----------|---------|
| Inline templates | Ayrı `.html` dosyaları | Daha temiz, VS Code IntelliSense |
| Inline styles | Ayrı `.css` dosyaları | View dosyaları daha küçük, CSS preview |
| Karışık model dosyası | Ayrı model dosyaları | Daha modüler, tekrar kullanılabilir |
| İç içe yapı | Düz yapı | Navigasyon kolay, import statements basit |

---

## 🧩 Component Yapısı

### Modern Angular 2026 Component Örneği

#### `login.component.ts`
```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,  // ✨ 2026: Standalone component
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',  // 👈 Ayrı template dosyası
  styleUrl: './login.component.css'       // 👈 Ayrı style dosyası
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);  // ✨ 2026: inject() ile dependency
  
  loginForm!: FormGroup;
  isLoading = false;

  ngOnInit(): void {
    // Komponentin başlatılmasında
  }
}
```

#### `login.component.html`
```html
<div class="container">
  <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
    <input formControlName="loginEmail" type="email" />
    <input formControlName="loginPassword" type="password" />
    <button [disabled]="isLoading">Login</button>
  </form>
</div>
```

#### `login.component.css`
```css
.container {
  max-width: 400px;
  margin: 50px auto;
}
```

---

## 🛠️ Service Katmanı

### AuthService Örneği
```typescript
// src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, AuthResponse } from '../../shared/models';

@Injectable({
  providedIn: 'root'  // Singleton service
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('authToken', response.token);
            this.currentUserSubject.next(response.user || null);
          }
        })
      );
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}
```

### Service'lerin Özellikleri

- **Singleton Pattern**: `providedIn: 'root'` ile otomatik singleton
- **Dependency Injection**: `inject()` fonksiyonu ile type-safe
- **Reactive**: RxJS Observables ile state management
- **Separation of Concerns**: API çağrıları services'ta, sadece UI logic components'ta

---

## 📊 Model/Interface Yönetimi

### Ayrı Model Dosyaları

#### `user.model.ts`
```typescript
export interface User {
  userId?: number;
  userEmail: string;
  userFullName: string;
  userRole?: 'USER' | 'ADMIN';
}

export interface LoginRequest {
  loginEmail: string;
  loginPassword: string;
}
```

#### `product.model.ts`
```typescript
export interface Product {
  productId?: number;
  productName: string;
  productPrice: number;
  productStock: number;
}
```

#### `index.ts` (Merkezi Export)
```typescript
export * from './user.model';
export * from './product.model';
export * from './category.model';
export * from './order.model';
export * from './review.model';
```

### Kullanım
```typescript
// Direkt import
import { User, LoginRequest } from '../shared/models';

// Veya individual import
import type { User } from '../shared/models/user.model';
```

---

## 🛣️ Routing Yapılandırması

### `app.routes.ts`
```typescript
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProductListComponent },
      { path: ':id', component: ProductDetailComponent }
    ]
  },
  {
    path: 'orders',
    canActivate: [AuthGuard],
    component: OrdersComponent
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' }
];
```

---

## ⚙️ Ortam Yapılandırması

### `environment.ts` (Development)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  appName: 'E-Commerce Dev',
  logLevel: 'debug'
};
```

### `environment.prod.ts` (Production)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.ecommerce.com/api',
  appName: 'E-Commerce',
  logLevel: 'error'
};
```

---

## 🚀 Başlatma ve Test

### Frontend Başlatma
```bash
# Development modunda başlat
cd frontend
npm install
ng serve --open

# Production build
ng build --configuration production

# Tests çalıştır
ng test
```

### Backend ile Entegrasyon
```bash
# Terminal 1: Backend (port 8080)
cd backend
.\mvnw.cmd spring-boot:run

# Terminal 2: Frontend (port 4200)
cd frontend
ng serve
```

### Uygulamaya Erişim
- Frontend: http://localhost:4200
- API: http://localhost:8080/api
- API Docs: http://localhost:8080/api/swagger-ui.html

---

## 📋 Checklist: Angular 2026 Best Practices

- ✅ **Standalone Components**: Tüm components `standalone: true`
- ✅ **Separate Templates**: HTML'ler ayrı dosyalarda
- ✅ **Separate Styles**: CSS'ler ayrı dosyalarda
- ✅ **inject() Function**: Constructor yerine `inject()`
- ✅ **Typed Services**: Type-safe dependency injection
- ✅ **Reactive Forms**: Template-driven yerine Reactive Forms
- ✅ **RxJS Operators**: `tap()`, `map()`, `switchMap()` gibi operators
- ✅ **OnPush Strategy**: `ChangeDetectionStrategy.OnPush` kullan
- ✅ **Environment Config**: Ayrı environment dosyaları
- ✅ **Lazy Loading**: Feature routes lazy-loaded

---

## 🔑 Temel Farklar (Eski vs Yeni)

### Component Definition
**Eski (Angular 12-16)**
```typescript
@Component({
  selector: 'app-login',
  template: `...inline HTML...`,
  styles: [`...inline CSS...`]
})
```

**Yeni (Angular 2026)**
```typescript
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ...],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
```

### Dependency Injection
**Eski**
```typescript
constructor(private authService: AuthService) {}
```

**Yeni**
```typescript
private authService = inject(AuthService);
```

---

## 📦 Paket Yapısı

```json
{
  "dependencies": {
    "@angular/core": "21.x",
    "@angular/common": "21.x",
    "@angular/forms": "21.x",
    "@angular/router": "21.x",
    "@angular/platform-browser": "21.x",
    "rxjs": "^7.8.0",
    "bootstrap": "^5.3.3",
    "tslib": "^2.6.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^21.x",
    "@angular/cli": "^21.x",
    "@angular/compiler-cli": "^21.x",
    "typescript": "^5.5.0"
  }
}
```

---

## 🧪 Testing Yapısı

## Test Commands
```bash
# Unit testler
ng test

# E2E testler
ng e2e

# Coverage raporu
ng test --no-watch --code-coverage
```

---

## 📱 Responsive Design

Tüm components Bootstrap 5.3.3 grid system kullanıyor:

```html
<div class="container">
  <div class="row">
    <div class="col-md-6 col-lg-4">
      <!-- Content -->
    </div>
  </div>
</div>
```

---

## 🎯 Özet: Yapı Avantajları

| Özellik | Avantaj |
|---------|---------|
| **Standalone Components** | Module gerekmiyor, daha basit setup |
| **Separate Files** | IDE support, preview, debugging kolay |
| **inject()** | Type-safe, cleaner code |
| **Reactive Forms** | Validation, state management kolay |
| **Service Layer** | Business logic ayrılmış, reusable |
| **Environment Config** | Dev/Prod ayırımı kolay |
| **Lazy Loading** | App initial load faster |
| **Bootstrap Integration** | Mobile-first, responsive otomatik |

---

## 🔗 Ilişkili Dosyalar

- Backend API: [API_ENDPOINTS.md](../docs/API_ENDPOINTS.md)
- Veritabanı: [DATABASE_SCHEMA.md](../docs/DATABASE_SCHEMA.md)
- Deployment: [DEPLOYMENT.md](../docs/DEPLOYMENT.md)
- Backend Status: [backend/PROJECT_STATUS.md](../backend/PROJECT_STATUS.md)

---

## ✍️ Güncellemeler

- **2026-04-13**: Angular 21 Standalone Components
- **2026-04-13**: Separate Template/Style Architecture
- **2026-04-13**: Service-first Approach
- **2026-04-13**: Modern Routing Setup

---

*Son Güncellenme: 13 Nisan 2026*
*Durum: ✅ Production Ready*
