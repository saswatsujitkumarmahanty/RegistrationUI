import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the Employee structure explicitly in the service file for simplicity
export interface Employee {
  id?: string;
  name: string;
  gender: string;
  email: string;
  phone: string;
  age: number;
  salary: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = '/api/employee'; 

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }
}