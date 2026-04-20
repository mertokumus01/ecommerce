import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  changePasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    const confirmPasswordControl = form.get('confirmPassword');
    if (confirmPasswordControl?.errors?.['passwordMismatch']) {
      confirmPasswordControl.setErrors(null);
    }

    return null;
  }

  changePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.errorMessage = 'Please correct the errors in the form';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const oldPassword = this.changePasswordForm.get('oldPassword')?.value;
    const newPassword = this.changePasswordForm.get('newPassword')?.value;

    this.userService.changePassword(oldPassword, newPassword).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.successMessage = 'Password changed successfully! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 2000);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = error.error?.message || 'Failed to change password. Please try again.';
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'old') {
      this.showPassword = !this.showPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  getFieldError(fieldName: string): string {
    const control = this.changePasswordForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required';
    }
    if (control.errors['minlength']) {
      return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.errors['passwordMismatch']) {
      return 'Passwords do not match';
    }

    return 'This field is invalid';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.changePasswordForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}
