import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../shared/models';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5 mb-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h4 class="card-title mb-0">User Profile</h4>
            </div>
            <div class="card-body">
              <div *ngIf="currentUser">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>User ID</strong></label>
                    <input
                      type="text"
                      class="form-control"
                      [value]="currentUser.userId"
                      disabled
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Role</strong></label>
                    <input
                      type="text"
                      class="form-control"
                      [value]="currentUser.userRole || 'USER'"
                      disabled
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Email</strong></label>
                    <input
                      type="email"
                      class="form-control"
                      [(ngModel)]="currentUser.userEmail"
                      [disabled]="!isEditing"
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Full Name</strong></label>
                    <input
                      type="text"
                      class="form-control"
                      [(ngModel)]="currentUser.userFullName"
                      [disabled]="!isEditing"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Phone Number</strong></label>
                    <input
                      type="tel"
                      class="form-control"
                      [(ngModel)]="currentUser.userPhoneNumber"
                      [disabled]="!isEditing"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Member Since</strong></label>
                    <input
                      type="text"
                      class="form-control"
                      [value]="(currentUser.createdDate || currentUser.userCreateDate) | date: 'mediumDate'"
                      disabled
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label"><strong>Last Updated</strong></label>
                    <input
                      type="text"
                      class="form-control"
                      [value]="(currentUser.updatedDate || currentUser.userUpdatedDate) | date: 'mediumDate'"
                      disabled
                    />
                  </div>
                </div>

                <div *ngIf="successMessage" class="alert alert-success">
                  {{ successMessage }}
                </div>

                <div *ngIf="errorMessage" class="alert alert-danger">
                  {{ errorMessage }}
                </div>

                <div class="d-flex gap-2">
                  <button
                    class="btn btn-warning"
                    (click)="toggleEdit()"
                  >
                    {{ isEditing ? 'Cancel' : 'Edit Profile' }}
                  </button>
                  <button
                    class="btn btn-success"
                    *ngIf="isEditing"
                    (click)="saveProfile()"
                    [disabled]="isSaving"
                  >
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                  </button>
                  <button
                    class="btn btn-danger"
                    (click)="logout()"
                  >
                    Logout
                  </button>
                </div>
              </div>

              <div *ngIf="!currentUser && !isLoading" class="alert alert-warning">
                Please login to view your profile.
              </div>

              <div *ngIf="isLoading" class="text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UserProfileComponent implements OnInit {
  currentUser: User | null = null;
  isEditing = false;
  isSaving = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user || null;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load profile';
        this.isLoading = false;
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.successMessage = '';
    this.errorMessage = '';
  }

  saveProfile(): void {
    if (!this.currentUser) return;

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.updateProfile(this.currentUser).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Profile updated successfully!';
          this.isEditing = false;
        } else {
          this.errorMessage = response.message || 'Failed to update profile';
        }
        this.isSaving = false;
      },
      error: (error) => {
        this.errorMessage = 'Error updating profile';
        this.isSaving = false;
      }
    });
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}
