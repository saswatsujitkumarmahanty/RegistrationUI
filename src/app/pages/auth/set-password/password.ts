import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/service';

@Component({
  selector: 'app-login-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password.html',
  styleUrl: '../login/login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Password implements OnInit {
  passwordForm!: FormGroup;
  queryParamsSub: Subscription = new Subscription;
 isSubmitting = false;
  errorMessage = '';
  shake = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) 
  
  {
    this.passwordForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: [
    '', 
    [
      Validators.required, 
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/) // Must contain lower, upper, and number
    ]
  ],
});
  }

  get password() {
    return this.passwordForm.get('password');
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.cdr.markForCheck();
  }

  get hasMinLength(): boolean {
    return (this.password?.value || '').length >= 6;
  }
 
  get hasLower(): boolean {
    return /[a-z]/.test(this.password?.value || '');
  }
 
  get hasUpper(): boolean {
    return /[A-Z]/.test(this.password?.value || '');
  }
 
  get hasNumber(): boolean {
    return /\d/.test(this.password?.value || '');
  }
 
  get strengthScore(): number {
    return [this.hasMinLength, this.hasLower, this.hasUpper, this.hasNumber].filter(Boolean).length;
  }
 
  get strengthLabel(): string {
    switch (this.strengthScore) {
      case 4: return 'strong';
      case 3: return 'good';
      case 2: return 'fair';
      case 1: return 'weak';
      default: return '';
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
 
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.triggerShake();
      this.cdr.markForCheck();
      return;
    }

    const payload = {
      email: this.passwordForm.value.email,
      password: this.passwordForm.value.password,
    };

    this.isSubmitting = true;

    this.service.Password(payload).subscribe({
      next: (res: any) => {
        if (res?.name) {
          localStorage.setItem('userName', res.name);
          this.service.userName$.next(res.name);
        }
        this.isSubmitting = false;
        this.router.navigateByUrl('/registration');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Password setup failed', error);
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Failed to save password. Please try again.';
        this.triggerShake();
        this.cdr.markForCheck();
      },
    });

  }

  private triggerShake() {
    this.shake = false;
    setTimeout(() => {
      this.shake = true;
      this.cdr.markForCheck();
    }, 0);
    setTimeout(() => {
      this.shake = false;
      this.cdr.markForCheck();
    }, 500);

  }
}