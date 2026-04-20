import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthErrorHandlerService } from '../../core/services/auth-error-handler.service';
import { AuthException } from '../../core/exceptions/auth.exception';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  formData = {
    email: '',
    password: '',
    remember: false
  };

  emailError = '';
  passwordError = '';
  serverError = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private authErrorHandler: AuthErrorHandlerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  validateEmail(): void {
    this.emailError = '';
    if (!this.formData.email) {
      this.emailError = 'Email veya kullanıcı adı gerekli';
    }
  }

  validatePassword(): void {
    this.passwordError = '';
    if (!this.formData.password) {
      this.passwordError = 'Şifre gerekli';
    }
  }

  onSubmit(): void {
    this.validateEmail();
    this.validatePassword();

    if (this.emailError || this.passwordError) {
      this.toastService.error('Lütfen tüm alanları doldurunuz');
      return;
    }

    this.isLoading = true;
    this.serverError = '';
    this.successMessage = '';

    const loginRequest = {
      loginEmail: this.formData.email,
      loginPassword: this.formData.password
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        if (response?.token) {
          this.successMessage = 'Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz...';
          this.toastService.success(this.successMessage);
          this.isLoading = false;
          this.cdr.markForCheck();

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
          return;
        }

        this.serverError = response?.message || 'Giriş başarısız';
        this.toastService.error(this.serverError);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        const authException: AuthException = this.authErrorHandler.handleHttpError(error);
        this.authErrorHandler.logError(authException, 'login_submit');

        this.serverError = authException.message;
        this.isLoading = false;
        this.toastService.error(authException.userMessage, 5000);
        this.cdr.markForCheck();
      }
    });
  }
}
