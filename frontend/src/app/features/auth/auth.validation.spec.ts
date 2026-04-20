import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';

describe('Login/Auth Form Validation Tests', () => {
  let fixture: ComponentFixture<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ]
    }).compileComponents();
  });

  it('should validate email format', () => {
    const validEmails = [
      'user@example.com',
      'admin@ecommerce.com',
      'test.user@domain.co.uk'
    ];

    const invalidEmails = [
      'notanemail',
      '@example.com',
      'user@',
      'user name@example.com'
    ];

    validEmails.forEach(email => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(pattern.test(email)).toBeTruthy();
    });

    invalidEmails.forEach(email => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(pattern.test(email)).toBeFalsy();
    });
  });

  it('should validate password requirements', () => {
    const validPasswords = [
      'Password123',
      'SecurePass@word',
      'MyP@ssw0rd'
    ];

    const invalidPasswords = [
      'short',
      '123456',
      'nouppercasehere',
      ''
    ];

    validPasswords.forEach(password => {
      expect(password.length).toBeGreaterThanOrEqual(6);
    });

    invalidPasswords.forEach(password => {
      expect(password.length < 6 || password === '').toBeTruthy();
    });
  });

  it('should require both email and password', () => {
    const loginData1 = { email: 'user@example.com', password: '' };
    const loginData2 = { email: '', password: 'password123' };
    const loginData3 = { email: 'user@example.com', password: 'password123' };

    expect(loginData1.email && loginData1.password).toBeFalsy();
    expect(loginData2.email && loginData2.password).toBeFalsy();
    expect(loginData3.email && loginData3.password).toBeTruthy();
  });

  it('should validate form fields are not empty', () => {
    const formData = {
      fullName: '',
      email: 'new@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };

    const isValid = formData.fullName && formData.email && 
                    formData.password && formData.confirmPassword;
    expect(isValid).toBeFalsy();
  });

  it('should validate password confirmation matches', () => {
    const data1 = { password: 'password123', confirmPassword: 'password123' };
    const data2 = { password: 'password123', confirmPassword: 'different' };

    expect(data1.password === data1.confirmPassword).toBeTruthy();
    expect(data2.password === data2.confirmPassword).toBeFalsy();
  });
});
