import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AuthModalComponent } from '../../shared/auth-modal/auth-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, AuthModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoginModalOpen = false;
  isRegisterMode = false;
  isLoggedIn = false;

  private readonly subscriptions = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    this.subscriptions.add(
      this.authService.token$.subscribe(token => {
        this.isLoggedIn = !!token;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  openLoginModal() {
    this.isRegisterMode = false;
    this.isLoginModalOpen = true;
  }

  openRegisterModal() {
    this.isRegisterMode = true;
    this.isLoginModalOpen = true;
  }
}
  