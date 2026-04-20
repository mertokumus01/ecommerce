import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest, AuthResponse, User } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
  private tokenSubject = new BehaviorSubject<string | null>(this.getTokenFromLocalStorage());

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(user: any): Observable<AuthResponse> {
    console.log('[Auth Service] Kayıt işlemi başlıyor:', user);
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user).pipe(
      tap(response => {
        console.log('[Auth Service] Kayıt başarılı:', response);
        if (response.success && response.token) {
          localStorage.removeItem('currentUser');
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userEmail', response.userEmail || '');
          this.tokenSubject.next(response.token);
          this.currentUserSubject.next(response.userEmail ? { userEmail: response.userEmail, userFullName: '' } : null);
          this.loadUserByEmail(response.userEmail || user.userEmail);
          console.log('[Auth Service] Token kaydedildi');
        }
      })
    );
  }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    console.log('[Auth Service] Giriş işlemi başlıyor:', loginRequest);
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap(response => {
        console.log('[Auth Service] Giriş başarılı:', response);
        if (response.success && response.token) {
          localStorage.removeItem('currentUser');
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userEmail', response.userEmail || '');
          this.tokenSubject.next(response.token);
          this.currentUserSubject.next(response.userEmail ? { userEmail: response.userEmail, userFullName: '' } : null);
          this.loadUserByEmail(response.userEmail || loginRequest.loginEmail);
          console.log('[Auth Service] Token kaydedildi');
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('currentUser');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  validateToken(token: string): Observable<AuthResponse> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<AuthResponse>(`${this.apiUrl}/validate`, { headers });
  }

  getCurrentUser(): Observable<User | null> {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      return new Observable(observer => {
        observer.next(JSON.parse(storedUser));
        observer.complete();
      });
    }

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      return of(null);
    }

    return this.http.get<User>(`${environment.apiUrl}/user/by-email/${encodeURIComponent(userEmail)}`).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  updateProfile(user: User): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/user/${user.userId}`, user).pipe(
      tap(() => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('authToken');
  }

  private getUserFromLocalStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('currentUser');
      }
    }

    const userEmail = localStorage.getItem('userEmail');
    return userEmail ? { userEmail, userFullName: '' } : null;
  }

  private loadUserByEmail(userEmail?: string): void {
    if (!userEmail) {
      return;
    }

    this.http.get<User>(`${environment.apiUrl}/user/by-email/${encodeURIComponent(userEmail)}`).subscribe({
      next: (user) => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      },
      error: () => {
        // UI, local fallback userEmail ile devam eder.
      }
    });
  }
}
