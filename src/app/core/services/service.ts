import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Signup, Login, AuthResponse } from '../models/auth';
import { environment } from '../../../environments/environment';
import { clearAuth } from '../utilities/storage.utilities';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/Auth`;

  public userName$ = new BehaviorSubject<string>(localStorage.getItem('userName') || 'User');

  constructor(private http: HttpClient, private router: Router) {}

  Password(payload: any): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/set-password`, payload);
  }

  LoginPassword(payload: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login-password`, payload);
  }

  signup(userData: Signup): Observable<any> {
    return this.http.post(`${this.authUrl}/signup`, userData);
  }

  login(credentials: Login): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, credentials);
  }

  verifyOtp(verificationData: { email: string; otpCode: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/verify-otp`, verificationData);
  }

  updateUserName(id: string, name: string): Observable<any> {
    return this.http.put(`${this.authUrl}/update-name/${id}`, { name });
  }

  // Mirrors backend GET /api/auth/me — reads identity straight from the JWT
  me(): Observable<{ userId: string; email: string; name: string; role: string }> {
    return this.http.get<{ userId: string; email: string; name: string; role: string }>(`${this.authUrl}/me`);
  }

  logout(): void {
    clearAuth();
    this.userName$.next('User');
    this.router.navigateByUrl('/login');
  }
}