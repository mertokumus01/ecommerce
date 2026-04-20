import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models';

interface UserResponse {
  userId?: number;
  userEmail?: string;
  userFullName?: string;
  userPhoneNumber?: string;
  userRole?: string;
  userCreateDate?: string;
  userUpdatedDate?: string;
}

export interface UserCreateRequest {
  userEmail: string;
  userPassword: string;
  userFullName: string;
  userPhoneNumber?: string;
  userRole?: string;
}

export interface UserUpdateRequest {
  userEmail?: string;
  userPassword?: string;
  userFullName?: string;
  userPhoneNumber?: string;
  userRole?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;
  private authApiUrl = `${environment.apiUrl}/auth`;

  constructor(private httpClient: HttpClient) {}

  getAllUsers(): Observable<UserResponse[]> {
    return this.httpClient.get<UserResponse[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  getUserByEmail(email: string): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>(`${this.apiUrl}/by-email/${encodeURIComponent(email)}`);
  }

  createUser(user: UserCreateRequest): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(`${this.apiUrl}/save`, user);
  }

  updateUser(id: number, user: UserUpdateRequest): Observable<UserResponse> {
    return this.httpClient.put<UserResponse>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateProfile(user: User): Observable<{ success: boolean; data: UserResponse }> {
    if (user.userId) {
      const payload: UserUpdateRequest = {
        userEmail: user.userEmail,
        userFullName: user.userFullName,
        userPhoneNumber: user.userPhoneNumber
      };

      return this.updateUser(user.userId, payload).pipe(
        map((data) => ({ success: true, data }))
      );
    }

    if (!user.userEmail) {
      return throwError(() => new Error('Current user email not found'));
    }

    return this.getUserByEmail(user.userEmail).pipe(
      switchMap((existing) => {
        if (!existing.userId) {
          return throwError(() => new Error('Current user id not found'));
        }

        const payload: UserUpdateRequest = {
          userEmail: user.userEmail,
          userFullName: user.userFullName,
          userPhoneNumber: user.userPhoneNumber
        };

        return this.updateUser(existing.userId, payload).pipe(
          map((data) => ({ success: true, data }))
        );
      })
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const email: string | undefined = currentUser?.userEmail;

    if (!email) {
      return throwError(() => new Error('Current user email not found'));
    }

    return this.httpClient.post<any>(`${this.authApiUrl}/login`, {
      loginEmail: email,
      loginPassword: oldPassword
    }).pipe(
      switchMap(() => this.getUserByEmail(email)),
      switchMap((existing) => {
        if (!existing.userId) {
          return throwError(() => new Error('Current user id not found'));
        }

        return this.updateUser(existing.userId, { userPassword: newPassword });
      }),
      map(() => ({ success: true, message: 'Password changed successfully' }))
    );
  }
}
