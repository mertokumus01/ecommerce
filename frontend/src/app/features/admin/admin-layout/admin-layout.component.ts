import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  adminEmail = localStorage.getItem('userEmail') || 'admin@site.com';

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    this.router.navigate(['/admin/login']);
  }
}
