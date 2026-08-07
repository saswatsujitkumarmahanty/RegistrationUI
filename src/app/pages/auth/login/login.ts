import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/service'; // Ensure this relative path points to your service.ts

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  showOtpStep: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: AuthService, // Properly injected your shared data service
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      otpCode: [''],
    });
  }

  onSubmit() {
    if (!this.showOtpStep) {
      this.handleRequestOtp();
    } else {
      this.handleVerifyOtp();
    }
  }

  private handleRequestOtp() {
    if (this.loginForm.get('email')?.valid && this.loginForm.get('phone')?.valid) {
      const credentials = {
        email: this.loginForm.value.email,
        phone: this.loginForm.value.phone,
      };

      // Using your central service method
      this.service.login(credentials).subscribe({
        next: (response: any) => {
          console.log('OTP Verification Code Issued!', response);
          this.showOtpStep = true;

          // Apply strict validation rules to the OTP field once active
          this.loginForm
            .get('otpCode')
            ?.setValidators([Validators.required, Validators.minLength(6)]);
          this.loginForm.get('otpCode')?.updateValueAndValidity();
        },
        error: (error) => {
          console.error('Step 1 Auth Request Denied', error);
          alert(error.error?.message || 'The credentials entered could not be verified.');
        },
      });
    }
  }

  private handleVerifyOtp() {
    if (this.loginForm.get('otpCode')?.valid) {
      const verificationPayload = {
        email: this.loginForm.value.email,
        otpCode: this.loginForm.value.otpCode,
      };

      // Directing token verification through the service
      this.service.verifyOtp(verificationPayload).subscribe({
  next: (res: any) => {
    console.log('Access pass granted!', res);
    localStorage.setItem('userId', res.userId);
    localStorage.setItem('userName', res.name);
    localStorage.setItem('token', res.token); // NEW
    this.service.userName$.next(res.name);
    this.router.navigateByUrl('/password');
  },
        error: (error) => {
          console.error('Step 2 Token Check Refused', error);
          alert(
            error.error?.message || 'The authorization token entry checked is invalid or expired.',
          );
        },
      });
    }
  }

  backToLoginCredentials() {
    this.showOtpStep = false;
    this.loginForm.get('otpCode')?.clearValidators();
    this.loginForm.get('otpCode')?.setValue('');
    this.loginForm.get('otpCode')?.updateValueAndValidity();
  }
}
