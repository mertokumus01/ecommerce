export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
  INVALID_EMAIL = 'INVALID_EMAIL',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  PASSWORD_MISMATCH = 'PASSWORD_MISMATCH',
  MISSING_FIELD = 'MISSING_FIELD',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface AuthError {
  type: ErrorType;
  message: string;
  userMessage: string; // Kullanıcıya gösterilecek mesaj
  status?: number;
  details?: any;
  timestamp: Date;
}

export class AuthException extends Error {
  constructor(
    public errorType: ErrorType,
    public override message: string,
    public userMessage: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AuthException';
    this.timestamp = new Date();
  }

  timestamp: Date;

  toJSON(): AuthError {
    return {
      type: this.errorType,
      message: this.message,
      userMessage: this.userMessage,
      status: this.status,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

// Önceden tanımlı hata mesajları
export const ERROR_MESSAGES: { [key in ErrorType]: { title: string; message: string } } = {
  [ErrorType.DUPLICATE_EMAIL]: {
    title: 'Email Zaten Kayıtlı',
    message: 'Bu email adresine sahip bir hesap zaten mevcut. Lütfen başka bir email kullanınız veya giriş yapınız.'
  },
  [ErrorType.INVALID_EMAIL]: {
    title: 'Geçersiz Email',
    message: 'Lütfen geçerli bir email adresi giriniz. Örnek: ornek@email.com'
  },
  [ErrorType.WEAK_PASSWORD]: {
    title: 'Zayıf Şifre',
    message: 'Şifreniz çok zayıf. En az 8 karakter, 1 büyük harf, 1 sayı ve 1 özel karakter (!@#$%^&*) gereklidir.'
  },
  [ErrorType.PASSWORD_MISMATCH]: {
    title: 'Şifreler Eşleşmiyor',
    message: 'Girdiğiniz şifreler eşleşmiyor. Lütfen kontrol edip tekrar deneyiniz.'
  },
  [ErrorType.MISSING_FIELD]: {
    title: 'Eksik Bilgi',
    message: 'Lütfen tüm gerekli alanları doldurunuz.'
  },
  [ErrorType.VALIDATION_ERROR]: {
    title: 'Doğrulama Hatası',
    message: 'Girilen bilgilerde hata var. Lütfen kontrol edip tekrar deneyiniz.'
  },
  [ErrorType.UNAUTHORIZED]: {
    title: 'Kimlik Doğrulama Hatası',
    message: 'Email veya şifre yanlış. Lütfen tekrar deneyiniz.'
  },
  [ErrorType.FORBIDDEN]: {
    title: 'İşlem Yasak',
    message: 'Bu işlemi gerçekleştirmek için yeterli izniniz yok.'
  },
  [ErrorType.NOT_FOUND]: {
    title: 'Bulunamadı',
    message: 'Aradığınız bilgi bulunamadı.'
  },
  [ErrorType.SERVER_ERROR]: {
    title: 'Sunucu Hatası',
    message: 'Sunucuda bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.'
  },
  [ErrorType.NETWORK_ERROR]: {
    title: 'İnternet Bağlantı Hatası',
    message: 'İnternet bağlantınızı kontrol edip tekrar deneyiniz.'
  },
  [ErrorType.TIMEOUT]: {
    title: 'İstek Zaman Aşımı',
    message: 'İstek çok uzun sürdü. Lütfen tekrar deneyiniz.'
  },
  [ErrorType.UNKNOWN_ERROR]: {
    title: 'Bilinmeyen Hata',
    message: 'Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.'
  }
};
