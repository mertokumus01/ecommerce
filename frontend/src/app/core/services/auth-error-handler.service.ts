import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthException, ErrorType, ERROR_MESSAGES } from '../exceptions/auth.exception';

@Injectable({
  providedIn: 'root'
})
export class AuthErrorHandlerService {
  constructor() {}

  /**
   * HTTP hatalarını parsing edip AuthException'a çevir
   */
  handleHttpError(error: any): AuthException {
    console.error('[AuthErrorHandler] HTTP Hatası:', error);

    // Network hatası
    if (error.status === 0 || error.message === 'Unknown Error') {
      console.error('[AuthErrorHandler] Network hatası tespit edildi');
      return new AuthException(
        ErrorType.NETWORK_ERROR,
        'Network connection failed',
        ERROR_MESSAGES[ErrorType.NETWORK_ERROR].message,
        0
      );
    }

    // Timeout
    if (error.name === 'TimeoutError') {
      console.error('[AuthErrorHandler] Timeout hatası');
      return new AuthException(
        ErrorType.TIMEOUT,
        'Request timeout',
        ERROR_MESSAGES[ErrorType.TIMEOUT].message,
        408
      );
    }

    // Backend'den dönen hata
    if (error instanceof HttpErrorResponse) {
      const status = error.status;
      const errorBody = error.error;

      console.error('[AuthErrorHandler] Status:', status, 'Body:', errorBody);

      // 400 Bad Request - Validasyon hataları
      if (status === 400) {
        return this.handleBadRequest(errorBody);
      }

      // 401 Unauthorized
      if (status === 401) {
        return new AuthException(
          ErrorType.UNAUTHORIZED,
          'Unauthorized',
          ERROR_MESSAGES[ErrorType.UNAUTHORIZED].message,
          401
        );
      }

      // 403 Forbidden
      if (status === 403) {
        return new AuthException(
          ErrorType.FORBIDDEN,
          'Forbidden',
          ERROR_MESSAGES[ErrorType.FORBIDDEN].message,
          403
        );
      }

      // 404 Not Found
      if (status === 404) {
        return new AuthException(
          ErrorType.NOT_FOUND,
          'Not found',
          ERROR_MESSAGES[ErrorType.NOT_FOUND].message,
          404
        );
      }

      // 500+ Server errors
      if (status >= 500) {
        return new AuthException(
          ErrorType.SERVER_ERROR,
          `Server error: ${status}`,
          ERROR_MESSAGES[ErrorType.SERVER_ERROR].message,
          status
        );
      }
    }

    // Bilinmeyen hata
    return new AuthException(
      ErrorType.UNKNOWN_ERROR,
      error.message || 'Unknown error occurred',
      ERROR_MESSAGES[ErrorType.UNKNOWN_ERROR].message
    );
  }

  /**
   * 400 Bad Request hatalarını detaylı parse et
   */
  private handleBadRequest(errorBody: any): AuthException {
    const message = errorBody?.message || 'Bad request';

    console.error('[AuthErrorHandler] Bad Request Detayı:', message);

    // Email zaten kayıtlı
    if (message.toLowerCase().includes('already exists') || message.toLowerCase().includes('email')) {
      return new AuthException(
        ErrorType.DUPLICATE_EMAIL,
        message,
        ERROR_MESSAGES[ErrorType.DUPLICATE_EMAIL].message,
        400,
        errorBody
      );
    }

    // Şifre zayıf
    if (message.toLowerCase().includes('password') || message.toLowerCase().includes('şifre')) {
      return new AuthException(
        ErrorType.WEAK_PASSWORD,
        message,
        ERROR_MESSAGES[ErrorType.WEAK_PASSWORD].message,
        400,
        errorBody
      );
    }

    // Validasyon hatası
    if (message.toLowerCase().includes('validation') || message.toLowerCase().includes('invalid')) {
      return new AuthException(
        ErrorType.VALIDATION_ERROR,
        message,
        ERROR_MESSAGES[ErrorType.VALIDATION_ERROR].message,
        400,
        errorBody
      );
    }

    // Varsayılan validasyon hatası
    return new AuthException(
      ErrorType.VALIDATION_ERROR,
      message,
      message || ERROR_MESSAGES[ErrorType.VALIDATION_ERROR].message,
      400,
      errorBody
    );
  }

  /**
   * Lokal validasyon hatalarını handle et
   */
  handleValidationError(fieldName: string, error: string): AuthException {
    let errorType = ErrorType.VALIDATION_ERROR;
    let userMessage = error;

    // Specific field validation errors
    if (fieldName === 'email') {
      errorType = ErrorType.INVALID_EMAIL;
      userMessage = ERROR_MESSAGES[ErrorType.INVALID_EMAIL].message;
    } else if (fieldName === 'password') {
      errorType = ErrorType.WEAK_PASSWORD;
      userMessage = ERROR_MESSAGES[ErrorType.WEAK_PASSWORD].message;
    } else if (fieldName === 'confirmPassword') {
      errorType = ErrorType.PASSWORD_MISMATCH;
      userMessage = ERROR_MESSAGES[ErrorType.PASSWORD_MISMATCH].message;
    }

    return new AuthException(errorType, error, userMessage);
  }

  /**
   * Tüm validasyon hatalarını topla ve göster
   */
  handleMultipleValidationErrors(errors: { [key: string]: string }): AuthException {
    const errorMessages = Object.entries(errors)
      .filter(([_, error]) => !!error)
      .map(([field, error]) => `${field}: ${error}`)
      .join('\\n');

    console.warn('[AuthErrorHandler] Multiple validation errors:', errors);

    return new AuthException(
      ErrorType.VALIDATION_ERROR,
      errorMessages,
      'Lütfen tüm alanları doğru şekilde doldurunuz.',
      400,
      errors
    );
  }

  /**
   * Hata nesnesini prettier şekilde log et
   */
  logError(exception: AuthException, context: string = ''): void {
    console.error(`[AuthError] ${context}`, {
      type: exception.errorType,
      status: exception.status,
      message: exception.message,
      userMessage: exception.userMessage,
      timestamp: exception.timestamp,
      details: exception.details
    });
  }
}
