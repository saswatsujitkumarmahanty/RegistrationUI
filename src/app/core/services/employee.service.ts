import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  deleteData(id: string | number) {
    throw new Error('Method not implemented.');
  }
  addEmployee: any;
  getAllEmployees(): Observable<Employee[]> {
    throw new Error('Method not implemented.');
  }
  private employeeUrl = 'https://localhost:7158/api/Employee';

  constructor(private http: HttpClient) {}

  getData(p0: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeeUrl);
  }

  postAllEmployees(data: Employee): Observable<any> {
    return this.http.post(this.employeeUrl, data);
  }

  getDataById(id: string | number): Observable<Employee> {
    return this.http.get<Employee>(`${this.employeeUrl}/${id}`);
  }

  putData(id: string | number, data: Employee): Observable<any> {
    return this.http.put(`${this.employeeUrl}/${id}`, data);
  }

  deleteEmployee(id: string | number): Observable<any> {
    return this.http.delete(`${this.employeeUrl}/${id}`);
  }
}