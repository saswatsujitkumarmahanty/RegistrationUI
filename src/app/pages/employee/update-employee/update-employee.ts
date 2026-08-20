import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EmployeeService } from '../../../core/services/employee.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-employee.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './update-employee.css',
})
export class UpdateEmployee implements OnInit {
  updateEmployeeForm: FormGroup;
  isLoading = true;
  loadError = false;
  isSubmitting = false;
  submitError = '';
  shake = false;
  UserData: any;
  userId!: {
    uid: any;
  };

  constructor(
    private registration: EmployeeService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.updateEmployeeForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{7,15}$/)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(75)]],
      salary: ['', [Validators.required, Validators.min(0)]],
    });
  }

  get f() {
    return this.updateEmployeeForm.controls;
  }
 
  fieldInvalid(name: string): boolean {
    const c = this.updateEmployeeForm.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  fieldValid(name: string): boolean {
    const c = this.updateEmployeeForm.get(name);
    return !!c && c.valid && (c.dirty || c.touched);
  }

  get hasUnsavedChanges(): boolean {
    return this.updateEmployeeForm.dirty && !this.isLoading && !this.loadError;
  }

  ngOnInit(): void {
    this.userId = {
      uid: this.activeRoute.snapshot.params['id'],
    };
    this.loadEmployee();
  }
 
  loadEmployee(): void {
    this.isLoading = true;
    this.loadError = false;
    this.registration.getDataById(this.userId.uid).subscribe({
      next: (res) => {
        this.UserData = res;
        this.updateEmployeeForm.setValue({
          id: this.UserData.id,
          name: this.UserData.name,
          gender: this.UserData.gender,
          email: this.UserData.email,
          phone: this.UserData.phone,
          age: this.UserData.age,
          salary: this.UserData.salary,
        });
        this.updateEmployeeForm.markAsPristine();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching employee record:', err);
        this.isLoading = false;
        this.loadError = true;
      },
    });
  }

   OnSubmit() {
    if (this.updateEmployeeForm.invalid) {
      this.updateEmployeeForm.markAllAsTouched();
      this.triggerShake();
      return;
    }
 
    this.isSubmitting = true;
    this.submitError = '';
 
    this.registration.putData(this.userId.uid, this.updateEmployeeForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('registration');
      },
      error: (err) => {
        console.error('Error updating employee record:', err);
        this.isSubmitting = false;
        this.submitError = 'Could not save changes. Please try again.';
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