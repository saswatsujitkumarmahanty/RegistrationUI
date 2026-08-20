import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './signup.css',
})
export class Signup implements OnInit {
  signupForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  shake = false;

  genderOptions = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  fieldInvalid(name: string): boolean {
    const c = this.signupForm.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  fieldValid(name: string): boolean {
    const c = this.signupForm.get(name);
    return !!c && c.valid && (c.dirty || c.touched);
  }

  selectGender(value: string): void {
    this.signupForm.get('gender')?.setValue(value);
    this.signupForm.get('gender')?.markAsDirty();
    this.signupForm.get('gender')?.markAsTouched();
  }

  onSubmit() {
    this.errorMessage = '';
 
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.triggerShake();
      return;
    }
 
    this.isSubmitting = true;
 
    this.service.signup(this.signupForm.value).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.successMessage = 'Account created! Redirecting to login…';
        setTimeout(() => this.router.navigateByUrl('/login'), 900);
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.message || 'Failed to create account. That email might already be registered.';
    
    this.triggerShake();}
  }
  )};
  private triggerShake() {
    this.shake = false;
    setTimeout(() => (this.shake = true), 0);
    setTimeout(() => (this.shake = false), 500);
}
}