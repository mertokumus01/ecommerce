import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  login(): void {
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'E-posta ve sifre zorunludur.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ loginEmail: this.email, loginPassword: this.password }).subscribe({
      next: (response) => {
        if (!response.success || !response.token) {
          this.errorMessage = response.message || 'Giris basarisiz';
          this.loading = false;
          return;
        }

        this.userService.getUserByEmail(this.email).subscribe({
          next: (user) => {
            if ((user.userRole || '').toUpperCase() !== 'ADMIN') {
              this.errorMessage = 'Bu kullanici admin degil.';
              this.authService.logout();
              this.loading = false;
              return;
            }

            localStorage.setItem('currentUser', JSON.stringify(user));
            this.loading = false;
            this.router.navigate(['/admin/dashboard']);
          },
          error: (error) => {
            this.errorMessage = error?.error?.message || 'Admin kullanici bilgisi alinamadi';
            this.authService.logout();
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Giris sirasinda hata olustu';
      }
    });
  }
}
