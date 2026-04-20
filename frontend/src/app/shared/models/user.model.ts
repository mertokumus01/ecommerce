/**
 * User Model
 * Represents a user in the e-commerce system
 */
export interface User {
  userId?: number;
  userEmail: string;
  userPassword?: string;
  userFullName: string;
  userPhoneNumber?: string;
  userRole?: 'USER' | 'ADMIN' | 'GUEST';
  userCreateDate?: Date;
  userUpdatedDate?: Date;
  createdDate?: Date;
  updatedDate?: Date;
  isActive?: boolean;
}

export interface LoginRequest {
  loginEmail: string;
  loginPassword: string;
}

export interface RegisterRequest {
  userEmail: string;
  userPassword: string;
  userFullName: string;
  userPhoneNumber?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  message: string;
  userEmail?: string;
  user?: User;
}

export interface LoginResponse {
  loginVerify: boolean;
  token?: string;
  user?: User;
}
