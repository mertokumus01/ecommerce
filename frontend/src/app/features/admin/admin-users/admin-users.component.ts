import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService, UserCreateRequest, UserUpdateRequest } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly search = signal('');

  readonly users = signal<any[]>([]);
  readonly showForm = signal(false);
  readonly editMode = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly form = signal<any>(this.emptyForm());

  readonly filteredUsers = computed(() => {
    const q = this.search().toLowerCase();
    return this.users().filter(u =>
      String(u.userEmail || '').toLowerCase().includes(q) ||
      String(u.userFullName || '').toLowerCase().includes(q)
    );
  });

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private emptyForm(): any {
    return {
      userEmail: '',
      userFullName: '',
      userPhoneNumber: '',
      userRole: 'USER',
      userPassword: ''
    };
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.userService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users: any) => {
          this.users.set(Array.isArray(users) ? users : []);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Kullanicilar alinamadi');
          this.loading.set(false);
        }
      });
  }

  applyFilter(): void {
    // Computed signal auto-updates when search signal changes
    // This method is called by the template trigger
  }

  toggleCreate(): void {
    if (this.showForm() && !this.editMode()) {
      this.cancel();
      return;
    }
    this.openCreate();
  }

  openCreate(): void {
    this.editMode.set(false);
    this.editingId.set(null);
    this.form.set(this.emptyForm());
    this.showForm.set(true);
  }

  openEdit(user: any): void {
    this.editMode.set(true);
    this.editingId.set(Number(user.userId));
    this.form.set({
      userEmail: user.userEmail || '',
      userFullName: user.userFullName || '',
      userPhoneNumber: user.userPhoneNumber || '',
      userRole: user.userRole || 'USER',
      userPassword: ''
    });
    this.showForm.set(true);
  }

  save(): void {
    const formData = this.form();
    if (this.editMode() && this.editingId() != null) {
      const payload: UserUpdateRequest = {
        userEmail: formData.userEmail,
        userFullName: formData.userFullName,
        userPhoneNumber: formData.userPhoneNumber,
        userRole: formData.userRole,
        userPassword: formData.userPassword || undefined
      };
      this.userService.updateUser(this.editingId()!, payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.cancel();
            this.loadUsers();
          },
          error: () => {
            this.errorMessage.set('Kullanici guncellenemedi');
          }
        });
      return;
    }

    const createPayload: UserCreateRequest = {
      userEmail: formData.userEmail,
      userPassword: formData.userPassword,
      userFullName: formData.userFullName,
      userPhoneNumber: formData.userPhoneNumber,
      userRole: formData.userRole
    };

    this.userService.createUser(createPayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (formData.userRole && formData.userRole !== 'USER') {
            this.userService.getUserByEmail(formData.userEmail)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (created: any) => {
                  if (created?.userId) {
                    this.userService.updateUser(Number(created.userId), { userRole: formData.userRole })
                      .pipe(takeUntil(this.destroy$))
                      .subscribe({
                        next: () => {
                          this.cancel();
                          this.loadUsers();
                        },
                        error: () => {
                          this.cancel();
                          this.loadUsers();
                        }
                      });
                  } else {
                    this.cancel();
                    this.loadUsers();
                  }
                },
                error: () => {
                  this.cancel();
                  this.loadUsers();
                }
              });
          } else {
            this.cancel();
            this.loadUsers();
          }
        },
        error: () => {
          this.errorMessage.set('Kullanici olusturulamadi');
        }
      });
  }

  cancel(): void {
    this.showForm.set(false);
    this.editMode.set(false);
    this.editingId.set(null);
    this.errorMessage.set('');
    this.form.set(this.emptyForm());
  }

  roleBadge(role?: string): string {
    return String(role || 'USER').toUpperCase() === 'ADMIN' ? 'role-admin' : 'role-user';
  }

  remove(userId: number): void {
    if (!confirm('Kullanici silinsin mi?')) {
      return;
    }
    this.userService.deleteUser(Number(userId))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadUsers(),
        error: () => {
          this.errorMessage.set('Silme islemi basarisiz');
        }
      });
  }
}
