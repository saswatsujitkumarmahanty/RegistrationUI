import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/service';
import { storeAuthResponse } from '../../../core/utilities/storage.utilities';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-password.html',
  styleUrl: '../login/login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPassword implements OnInit, OnDestroy {
[x: string]: any;
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
  password: ['', 
    [
      Validators.required, 
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/) // Must contain lower, upper, and number
    ]
  ],
});
  }

  ngOnInit(): void {
    this.queryParamsSub = this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.passwordForm.patchValue({ email: params['email'] });
        // 3. Trigger change detection manually
        this.cdr.markForCheck(); 
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.cdr.markForCheck();
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

    this.service.LoginPassword(payload).subscribe({
  next: (res) => {
    storeAuthResponse(res); // stores token, userId, name, and role together

    this.service.userName$.next(res.name);
    this.isSubmitting = false;
    this.router.navigateByUrl('/registration');
  },
  error: (error: HttpErrorResponse) => {
    console.error('Login failed', error);
    this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Failed to log in. Please try again.';
        this.triggerShake();
        this.cdr.markForCheck();},
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
  
  ngOnDestroy(): void {
    if (this.queryParamsSub) {
      this.queryParamsSub.unsubscribe();
    }
  }
}