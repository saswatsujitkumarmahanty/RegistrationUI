import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Employee } from '../../../core/models/employee';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
  changeDetection: ChangeDetectionStrategy.Default, // Switched to default to ensure the table updates smoothly on delete
})
export class Registration implements OnInit {
  apiData: Employee[] = [];
  allEmployees: Employee[] = [];
  displayEmployees: Employee[] = [];

  constructor(
    private employeeService: EmployeeService, // Using your clean service layer
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData(): void {
    // FIXED: Changed from 'this.registration.getData' to 'this.employeeService.getData'
    this.employeeService.getData('https://localhost:7158/api/Employee').subscribe({
      next: (res: Employee[]) => {
        this.apiData = res; 
        this.allEmployees = res; 
        this.displayEmployees = res; 
      },
      error: (err: any) => console.error('Error fetching employee directory:', err)
    });
  }

  onSearch(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.displayEmployees = this.allEmployees.filter((emp) =>
      emp.name?.toLowerCase().includes(searchTerm)
    );
  }

  AddEmployee(): void {
    this.router.navigateByUrl('add-employee');
  }

  onUpdate(id: string | number): void {
    this.router.navigate(['update-employee', id]);
  }

  onView(id: string | number): void {
    this.router.navigate(['view-register', id]);
  }

  onDelete(id: string | number): void {
    // If the service returns an observable, subscribe to it; otherwise call it and refresh.
    const result: any = this.employeeService.deleteData(id);
    if (result && typeof result.subscribe === 'function') {
      result.subscribe({
        next: () => this.getAllData(),
        error: (err: any) => console.error('Error deleting employee record:', err),
      });
    } else {
      // Service method does not return an observable — assume it performed deletion synchronously
      this.getAllData();
    }
  }
}