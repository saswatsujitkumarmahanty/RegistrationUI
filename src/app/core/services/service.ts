import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Signup, Login } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'https://localhost:7158/api/Auth';
  
  public userName$ = new BehaviorSubject<string>(localStorage.getItem('userName') || 'User');

  constructor(private http: HttpClient) {}

  signup(userData: Signup): Observable<any> {
    return this.http.post(`${this.authUrl}/signup`, userData);
  }

  login(credentials: Login): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, credentials);
  }

  verifyOtp(verificationData: { email: string; otpCode: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/verify-otp`, verificationData);
  }

  updateUserName(id: string, name: string): Observable<any> {
    return this.http.put(`${this.authUrl}/update-name/${id}`, { name });
  }
}