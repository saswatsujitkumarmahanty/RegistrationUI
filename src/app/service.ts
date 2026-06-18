import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from './employee';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Service {
  private employeeUrl: string = 'https://localhost:7158/api/Employee';
  private authUrl: string = 'https://localhost:7158/api/Auth';
  constructor(private http: HttpClient) {}

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/signup`, userData);
  }

  login(credentials: { email: string; phone: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, credentials);
  }

  verifyOtp(verificationData: { email: string; otpCode: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/verify-otp`, verificationData);
  }

  getData(url?: string): Observable<Employee[]> {
    // If a specific URL is passed by registration.ts, use it; otherwise fall back to employeeUrl
    return this.http.get<Employee[]>(url || this.employeeUrl);
  }

  postData(data: Employee): Observable<any> {
    return this.http.post(this.employeeUrl, data);
  }

  getDataById(id: any): Observable<Employee> {
    return this.http.get<Employee>(`${this.employeeUrl}/${id}`); 
  }

  putData(id: any, data: Employee): Observable<any> {
    return this.http.put(`${this.employeeUrl}/${id}`, data);
  }

  deleteData(id: any): Observable<any> {
    return this.http.delete(`${this.employeeUrl}/${id}`);
  }
}
