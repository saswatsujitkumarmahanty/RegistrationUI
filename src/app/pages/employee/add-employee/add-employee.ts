import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-employee.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './add-employee.css',
})
export class AddEmployee {
  addEmployeeForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private registration: EmployeeService,
  ) {
    this.addEmployeeForm = this.fb.group({
      name: [''],
      gender: [''],
      email: [''],
      phone: [''],
      age: [''],
      salary: [''],
    });
  }

  OnSubmit() {
    this.registration.addEmployee(this.addEmployeeForm.value).subscribe((res: any) => {
      this.router.navigateByUrl('registration');
    });
  }

  OnCancel() {
    this.router.navigateByUrl('registration');
  }
}
