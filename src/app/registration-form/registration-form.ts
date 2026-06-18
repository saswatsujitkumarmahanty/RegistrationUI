import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // <-- 1. Import it here
import { EmployeeService, Employee } from '../services/employee.service';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule // <-- 2. Declare it here so the HTML template can use [formGroup]
  ],
  templateUrl: './registration-form.html',
  styleUrls: ['./registration-form.css']
})
export class RegistrationFormComponent implements OnInit {
  regForm!: FormGroup;
  employees: Employee[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadEmployees();
  }

  initForm(): void {
    this.regForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['Male', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      age: [null, [Validators.required, Validators.min(1), Validators.max(120)]],
      salary: [null, [Validators.required, Validators.min(0)]]
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
      },
      error: (err: any) => {
        this.errorMessage = 'Could not retrieve employee registry data.';
      }
    });
  }

  onSubmit(): void {
    if (this.regForm.valid) {
      this.employeeService.addEmployee(this.regForm.value).subscribe({
        next: (response: Employee) => {
          this.successMessage = 'Employee record registered successfully!';
          this.errorMessage = '';
          this.regForm.reset({ gender: 'Male' });
          this.loadEmployees();
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to submit registration data.';
          this.successMessage = '';
        }
      });
    } else {
      this.regForm.markAllAsTouched();
    }
  }
}