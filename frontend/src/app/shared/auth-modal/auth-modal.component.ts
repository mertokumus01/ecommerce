import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() isRegister = false; // Register modda açılsın mı?
  @Output() closeEvent = new EventEmitter<void>();

  isRegisterMode = false;
  loginForm: FormGroup;
  registerForm: FormGroup;

  ngOnChanges() {
    if (this.isOpen) {
      this.isRegisterMode = this.isRegister; // Set mode when modal opens
    }
  }

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      keepLogged: [false]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      emailNewsletter: [true],
      termsAccepted: [false, Validators.requiredTrue]
    });
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  closeModal() {
    this.closeEvent.emit();
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);
      // API çağrısı yapılacak
      this.closeModal();
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log('Register data:', this.registerForm.value);
      // API çağrısı yapılacak
      this.closeModal();
    }
  }
}
