import { signal, computed, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly search = signal('');

  readonly categories = signal<any[]>([]);
  readonly filteredCategories = signal<any[]>([]);

  readonly showForm = signal(false);
  readonly editMode = signal(false);
  readonly editingId = signal<number | null>(null);

  readonly form = signal<any>(this.emptyForm());

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private emptyForm(): any {
    return {
      categoryName: '',
      categoryDescription: ''
    };
  }

  loadCategories(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.categoryService.getAll().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (categories: any) => {
        this.categories.set(Array.isArray(categories) ? categories : []);
        this.applyFilter();
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Kategoriler yuklenemedi');
        this.loading.set(false);
      }
    });
  }

  toggleCreate(): void {
    if (this.showForm() && !this.editMode()) {
      this.cancel();
      return;
    }

    this.openCreate();
  }

  applyFilter(): void {
    const query = this.search().toLowerCase();
    this.filteredCategories.set(this.categories().filter((category) => {
      const name = String(category.categoryName || '').toLowerCase();
      const description = String(category.categoryDescription || '').toLowerCase();
      return name.includes(query) || description.includes(query);
    }));
  }

  openCreate(): void {
    this.editMode.set(false);
    this.editingId.set(null);
    this.form.set(this.emptyForm());
    this.showForm.set(true);
  }

  openEdit(category: any): void {
    this.editMode.set(true);
    this.editingId.set(Number(category.categoryId));
    this.form.set({
      categoryName: category.categoryName || '',
      categoryDescription: category.categoryDescription || ''
    });
    this.showForm.set(true);
  }

  save(): void {
    const formValue = this.form();
    const payload = {
      categoryName: formValue.categoryName,
      categoryDescription: formValue.categoryDescription
    };

    const request = this.editMode() && this.editingId() != null
      ? this.categoryService.update(this.editingId()!, payload)
      : this.categoryService.create(payload);

    request.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.cancel();
        this.loadCategories();
      },
      error: () => {
        this.errorMessage.set('Kategori kaydedilemedi');
      }
    });
  }

  remove(categoryId: number): void {
    if (!confirm('Kategori silinsin mi?')) {
      return;
    }

    this.categoryService.delete(Number(categoryId)).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => this.loadCategories(),
      error: () => {
        this.errorMessage.set('Kategori silinemedi');
      }
    });
  }

  cancel(): void {
    this.showForm.set(false);
    this.editMode.set(false);
    this.editingId.set(null);
    this.form.set(this.emptyForm());
  }
}