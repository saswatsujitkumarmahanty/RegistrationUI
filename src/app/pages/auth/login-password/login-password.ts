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
  styleUrl: '../login/login.css', // Reusing the login CSS for the same card styling
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPassword implements OnInit {
  passwordForm!: FormGroup;
  queryParamsSub: Subscription = new Subscription;

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

  ngOnInit(): void {
    this.queryParamsSub = this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.passwordForm.patchValue({ email: params['email'] });
        // 3. Trigger change detection manually
        this.cdr.markForCheck(); 
      }
    });
  }

  onSubmit(): void {
     if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return; 
    }

    const payload = {
      email: this.passwordForm.value.email,
      password: this.passwordForm.value.password,
    };

    this.service.LoginPassword(payload).subscribe({
  next: (res) => {
    console.log('Login successful!', res);
    storeAuthResponse(res); // stores token, userId, name, and role together
    this.service.userName$.next(res.name);
    alert('Login successful!');
    this.router.navigateByUrl('/registration');
  },
  error: (error: HttpErrorResponse) => {
    console.error('Login failed', error);
    alert(error?.error?.message || 'Failed to log in.');
  },
});
  }

  ngOnDestroy(): void {
    if (this.queryParamsSub) {
      this.queryParamsSub.unsubscribe();
    }
  }
}