import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-employee.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './add-employee.css',
})
export class AddEmployee {
  addEmployeeForm: FormGroup;
  isSubmitting = false;
  submitError = '';
  shake = false;

  genderOptions = ['Male', 'Female'];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private registration: EmployeeService,
  ) {
    this.addEmployeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{7,15}$/)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(75)]],
      salary: ['', [Validators.required, Validators.min(0)]],
    });
  }
   
  get f() {
    return this.addEmployeeForm.controls;
  }

  get hasUnsavedChanges(): boolean {
    return this.addEmployeeForm.dirty && !this.isSubmitting;
  }

  fieldInvalid(name: string): boolean {
    const c = this.addEmployeeForm.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  fieldValid(name: string): boolean {
    const c = this.addEmployeeForm.get(name);
    return !!c && c.valid && (c.dirty || c.touched);
  }

  selectGender(value: string): void {
    this.addEmployeeForm.get('gender')?.setValue(value);
    this.addEmployeeForm.get('gender')?.markAsDirty();
    this.addEmployeeForm.get('gender')?.markAsTouched();
  }

  OnSubmit() {
    if (this.addEmployeeForm.invalid) {
      this.addEmployeeForm.markAllAsTouched();
      this.triggerShake();
      return;
    }
    
    this.isSubmitting = true;
    this.submitError = '';
 
    this.registration.addEmployee(this.addEmployeeForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('registration');
      },
      error: (err: any) => {
        console.error('Error adding employee:', err);
        this.isSubmitting = false;
        this.submitError = 'Could not add employee. Please try again.';
        this.triggerShake();
      },
    });
  }

  OnCancel() {
    this.router.navigateByUrl('registration');
  }

  private triggerShake() {
    this.shake = false;
    setTimeout(() => (this.shake = true), 0);
    setTimeout(() => (this.shake = false), 500);

  }
}