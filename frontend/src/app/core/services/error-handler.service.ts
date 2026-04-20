import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppError {
  id: string;
  type: 'validation' | 'auth' | 'server' | 'network' | 'unknown';
  message: string;
  details?: any;
  timestamp: Date;
  statusCode?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorSubject = new BehaviorSubject<AppError | null>(null);
  public error$ = this.errorSubject.asObservable();

  private errorLogSubject = new BehaviorSubject<AppError[]>([]);
  public errorLog$ = this.errorLogSubject.asObservable();

  private errorLog: AppError[] = [];
  private readonly MAX_LOG_SIZE = 100;

  constructor() {
    console.log('[ErrorHandlerService] Service initialized');
  }

  /**
   * Handle HTTP errors
   */
  handleError(error: any, context: string = 'Unknown'): AppError {
    console.error(`[ErrorHandler] ${context}:`, error);

    let appError: AppError;

    // Validation errors
    if (error?.status === 400 && error?.error?.errors) {
      const validationErrors = Object.values(error.error.errors).join(', ');
      appError = {
        id: this.generateErrorId(),
        type: 'validation',
        message: validationErrors || 'Validation failed',
        details: error.error.errors,
        statusCode: 400,
        timestamp: new Date()
      };
    }
    // Authentication errors
    else if (error?.status === 401 || error?.status === 403) {
      appError = {
        id: this.generateErrorId(),
        type: 'auth',
        message: error?.error?.message || 'Authentication failed. Please login again.',
        statusCode: error.status,
        timestamp: new Date()
      };
    }
    // Server errors
    else if (error?.status >= 500) {
      appError = {
        id: this.generateErrorId(),
        type: 'server',
        message: 'Server error occurred. Please try again later.',
        details: error?.error?.message,
        statusCode: error.status,
        timestamp: new Date()
      };
      this.logToServer(appError, context);
    }
    // Network errors
    else if (error?.status === 0 || !error?.status) {
      appError = {
        id: this.generateErrorId(),
        type: 'network',
        message: 'Network error. Please check your connection.',
        timestamp: new Date()
      };
    }
    // User-friendly error from API
    else if (error?.error?.message) {
      appError = {
        id: this.generateErrorId(),
        type: 'unknown',
        message: error.error.message,
        statusCode: error.status,
        timestamp: new Date()
      };
    }
    // Default error
    else {
      appError = {
        id: this.generateErrorId(),
        type: 'unknown',
        message: 'An unexpected error occurred.',
        details: error,
        timestamp: new Date()
      };
    }

    // Add to log
    this.addToLog(appError);

    // Emit error
    this.errorSubject.next(appError);

    // Log to console
    console.error(`[${appError.type.toUpperCase()}] ${appError.message}`, appError);

    return appError;
  }

  /**
   * Clear current error
   */
  clearError(): void {
    this.errorSubject.next(null);
  }

  /**
   * Get error log
   */
  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  /**
   * Export error log (for download)
   */
  exportErrorLog(): string {
    const log = this.errorLog.map(e => ({
      id: e.id,
      type: e.type,
      message: e.message,
      statusCode: e.statusCode,
      timestamp: e.timestamp.toISOString(),
      details: e.details
    }));
    return JSON.stringify(log, null, 2);
  }

  /**
   * Clear error log
   */
  clearErrorLog(): void {
    this.errorLog = [];
    this.errorLogSubject.next([]);
  }

  /**
   * Validation error specific handler
   */
  handleValidationError(fieldErrors: { [key: string]: string }): AppError {
    const messages = Object.entries(fieldErrors)
      .map(([field, message]) => `${field}: ${message}`)
      .join(', ');

    const appError: AppError = {
      id: this.generateErrorId(),
      type: 'validation',
      message: messages,
      details: fieldErrors,
      timestamp: new Date()
    };

    this.addToLog(appError);
    this.errorSubject.next(appError);

    return appError;
  }

  /**
   * Track user action errors
   */
  trackActionError(action: string, error: AppError): void {
    const track = {
      ...error,
      action: action
    };
    console.log(`[Action Error] ${action}:`, track);
  }

  // Private methods

  private addToLog(error: AppError): void {
    this.errorLog.unshift(error);
    if (this.errorLog.length > this.MAX_LOG_SIZE) {
      this.errorLog.pop();
    }
    this.errorLogSubject.next([...this.errorLog]);
  }

  private generateErrorId(): string {
    return `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private logToServer(error: AppError, context: string): void {
    // In production, send to server logging endpoint
    console.warn(`[ServerError Logged] ${context}:`, error);
    // TODO: Implement backend logging integration
    // this.http.post('/api/logs/errors', { error, context }).subscribe();
  }
}
