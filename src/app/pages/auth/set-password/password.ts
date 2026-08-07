import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  styleUrl: '../login/login.css', // Reusing the login CSS for the same card styling
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Password implements OnInit {
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

    this.service.Password(payload).subscribe({
      next: (res: any) => {
        console.log('Password set successfully!', res);
        
        if (res?.name) {
          localStorage.setItem('userName', res.name);
          this.service.userName$.next(res.name);
        }

        alert('Authentication complete! Password saved.');
        this.router.navigateByUrl('/registration');
      },
      // 5. Safely typed the error handler
      error: (error: HttpErrorResponse) => { 
        console.error('Password setup failed', error);
        alert(error?.error?.message || 'Failed to save password.');
      },
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamsSub) {
      this.queryParamsSub.unsubscribe();
    }
  }
}