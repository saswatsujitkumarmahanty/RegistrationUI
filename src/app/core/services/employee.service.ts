import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeeUrl = `${environment.apiUrl}/Employee`;

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeeUrl);
  }

  getData(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeeUrl);
  }

  addEmployee(data: Employee): Observable<any> {
    return this.http.post(this.employeeUrl, data);
  }

  getDataById(id: string | number): Observable<Employee> {
    return this.http.get<Employee>(`${this.employeeUrl}/${id}`);
  }

  putData(id: string | number, data: Employee): Observable<any> {
    return this.http.put(`${this.employeeUrl}/${id}`, data);
  }

  deleteData(id: string | number): Observable<any> {
    return this.http.delete(`${this.employeeUrl}/${id}`);
  }
}