import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../shared/models';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  user: User | null = null;
  isLoading = false;
  isEditing = false;
  errorMessage = '';
  successMessage = '';
  profileForm: FormGroup;

  constructor() {
    this.profileForm = this.formBuilder.group({
      userEmail: ['', [Validators.required, Validators.email]],
      userFullName: ['', [Validators.required, Validators.minLength(2)]],
      userPhoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)]
      ]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.getCurrentUser().subscribe({
      next: (user: User | null) => {
        if (user) {
          this.user = user;
          this.profileForm.patchValue({
            userEmail: user.userEmail,
            userFullName: user.userFullName,
            userPhoneNumber: user.userPhoneNumber
          });
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load profile. Please log in again.';
        this.isLoading = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      }
    });
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.resetForm();
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid || !this.user) {
      this.errorMessage = 'Please correct the errors in the form';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updatedUser = {
      ...this.user,
      userEmail: this.profileForm.get('userEmail')?.value,
      userFullName: this.profileForm.get('userFullName')?.value,
      userPhoneNumber: this.profileForm.get('userPhoneNumber')?.value
    };

    this.userService.updateProfile(updatedUser).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.user = updatedUser;
          this.successMessage = 'Profile updated successfully!';
          this.isEditing = false;
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to update profile. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    if (this.user) {
      this.profileForm.patchValue({
        userEmail: this.user.userEmail,
        userFullName: this.user.userFullName,
        userPhoneNumber: this.user.userPhoneNumber
      });
    }
  }

  changePassword(): void {
    this.router.navigate(['/auth/change-password']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getFieldError(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return `${fieldName.replace(/([A-Z])/g, ' $1').trim()} is required`;
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }
    if (control.errors['minlength']) {
      return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.errors['pattern']) {
      return 'Please enter a valid phone number (10 digits)';
    }

    return 'This field is invalid';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.profileForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}
