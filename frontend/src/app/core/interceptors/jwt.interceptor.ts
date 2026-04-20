import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../services/error-handler.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    // Add JWT token to request headers if available
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle error using ErrorHandlerService
        this.errorHandler.handleError(error, `HTTP ${request.method} ${request.url}`);

        // Handle specific error codes
        if (error instanceof HttpErrorResponse) {
          console.error(`[JwtInterceptor] HTTP Error ${error.status}:`, error.message);
          
          if (error.status === 401) {
            const isAuthEndpoint =
              request.url.includes('/auth/login') ||
              request.url.includes('/auth/register') ||
              request.url.includes('/auth/validate');

            // 401 durumunda sadece aktif session varsa logout et.
            if (this.authService.isLoggedIn() && !isAuthEndpoint) {
              console.warn('[JwtInterceptor] Unauthorized access - logging out');
              this.authService.logout();
              this.router.navigate(['/auth/login']);
            }
          } else if (error.status === 403) {
            console.warn('[JwtInterceptor] Forbidden access');
          }
        }
        
        return throwError(() => error);
      })
    );
  }
}
