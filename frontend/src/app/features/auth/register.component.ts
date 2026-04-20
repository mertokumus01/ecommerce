import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthErrorHandlerService } from '../../core/services/auth-error-handler.service';
import { AuthException } from '../../core/exceptions/auth.exception';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  formData = {
    email: '',
    fullname: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false
  };

  emailError = '';
  fullnameError = '';
  phoneError = '';
  passwordError = '';
  confirmPasswordError = '';
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
      this.emailError = 'Email gerekli';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
      this.emailError = 'Geçerli email giriniz';
    }
  }

  validateFullName(): void {
    this.fullnameError = '';
    if (!this.formData.fullname) {
      this.fullnameError = 'Ad-Soyad gerekli';
    } else if (this.formData.fullname.length < 3) {
      this.fullnameError = 'En az 3 karakter';
    }
  }

  validatePhone(): void {
    this.phoneError = '';
    if (!this.formData.phone) {
      this.phoneError = 'Telefon gerekli';
    } else if (!/^\d{10}$/.test(this.formData.phone)) {
      this.phoneError = '10 haneli numara giriniz';
    }
  }

  validatePassword(): void {
    this.passwordError = '';
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.]).{8,}$/;
    
    if (!this.formData.password) {
      this.passwordError = 'Şifre gerekli';
    } else if (this.formData.password.length < 8) {
      this.passwordError = 'En az 8 karakter olmalıdır';
    } else if (!/[A-Z]/.test(this.formData.password)) {
      this.passwordError = 'En az 1 büyük harf (A-Z) gereklidir';
    } else if (!/[0-9]/.test(this.formData.password)) {
      this.passwordError = 'En az 1 sayı (0-9) gereklidir';
    } else if (!/[!@#$%^&*.]/.test(this.formData.password)) {
      this.passwordError = 'En az 1 özel karakter (!@#$%^&*.) gereklidir';
    }
  }

  validateConfirmPassword(): void {
    this.confirmPasswordError = '';
    if (!this.formData.confirmPassword) {
      this.confirmPasswordError = 'Şifre onayı gerekli';
    } else if (this.formData.password !== this.formData.confirmPassword) {
      this.confirmPasswordError = 'Şifreler eşleşmiyor';
    }
  }

  onSubmit(): void {
    console.log('[Register] Form gönderiliyor');
    
    // Validasyonlar
    this.validateEmail();
    this.validateFullName();
    this.validatePhone();
    this.validatePassword();
    this.validateConfirmPassword();

    if (this.emailError || this.fullnameError || this.phoneError || this.passwordError || this.confirmPasswordError) {
      this.serverError = 'Lütfen tüm alanları doğru şekilde doldurunuz';
      this.toastService.error('Lütfen tüm alanları doğru şekilde doldurunuz');
      console.log('[Register] Validasyon hatası');
      return;
    }

    if (!this.formData.agree) {
      this.serverError = 'Şartları kabul etmelisiniz';
      this.toastService.warning('Lütfen şartları kabul ediniz');
      return;
    }

    // Loading state'ini başlat
    this.isLoading = true;
    this.serverError = '';
    this.successMessage = '';

    const registerRequest = {
      userEmail: this.formData.email,
      userPassword: this.formData.password,
      userFullName: this.formData.fullname,
      userPhoneNumber: this.formData.phone
    };

    console.log('[Register] API isteği:', registerRequest);

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        console.log('[Register] Başarılı:', response);
        if (response?.success) {
          this.isLoading = false;
          this.toastService.success('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
          this.cdr.markForCheck();
          
          // Formu temizle
          this.resetForm();
          
          // 1 saniye sonra login sayfasına gönder
          setTimeout(() => this.router.navigate(['/auth/login']), 1000);
        } else {
          const errorMessage = response?.message || 'Kayıt başarısız';
          this.serverError = errorMessage;
          this.isLoading = false;
          this.toastService.error(errorMessage);
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        console.error('[Register] Hata:', error);
        
        // AuthErrorHandlerService kullanarak hatayı parse et
        const authException: AuthException = this.authErrorHandler.handleHttpError(error);
        
        // Hata detaylarını logla
        this.authErrorHandler.logError(authException, 'register_submit');
        
        // Hata durumunda state'leri kontrol et
        this.serverError = authException.message;
        this.isLoading = false;
        
        // Kullanıcı dostu hata mesajını toast olarak göster (5 saniye)
        this.toastService.error(authException.userMessage, 5000);
        
        // Change detection tetikle
        this.cdr.markForCheck();
      }
    });
  }

  resetForm(): void {
    this.formData = {
      email: '',
      fullname: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agree: false
    };
    this.emailError = '';
    this.fullnameError = '';
    this.phoneError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.serverError = '';
    this.successMessage = '';
  }
}
