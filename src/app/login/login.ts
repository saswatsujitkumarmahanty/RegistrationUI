import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css' 
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  showOtpStep: boolean = false; 
  service: any;
  verificationData: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      otpCode: [''] 
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
      const payload = {
        email: this.loginForm.value.email,
        phone: this.loginForm.value.phone
      };

      this.http.post('https://localhost:7158/api/Auth/login', payload).subscribe({
        next: (response: any) => {
          console.log('Account identified! OTP generated and cached.', response);
          this.showOtpStep = true;

          this.loginForm.get('otpCode')?.setValidators([
            Validators.required, 
            Validators.pattern(/^\d{6}$/)
          ]);
          this.loginForm.get('otpCode')?.updateValueAndValidity();
        },
        error: (error) => {
          console.error('Step 1 Authentication Fault', error);
          alert(error.error?.message || 'Invalid account records combination matching entries.');
        }
      });
    }
  }

  private handleVerifyOtp() {
    if (this.loginForm.get('otpCode')?.valid) {
      const verificationPayload = {
        email: this.loginForm.value.email,
        otpCode: this.loginForm.value.otpCode
      };

      this.http.post('https://localhost:7158/api/Auth/verify-otp', verificationPayload).subscribe({
        next: (response: any) => {
          console.log('Access pass granted!', response);
          this.router.navigateByUrl('/registration'); 
        },
        error: (error) => {
          console.error('Step 2 Token Check Refused', error);
          alert(error.error?.message || 'The authorization token entry checked is invalid or expired.');
        }
      });
    }
  }

  backToLoginCredentials() {
    this.showOtpStep = false;
    this.loginForm.get('otpCode')?.clearValidators();
    this.loginForm.get('otpCode')?.setValue('');
    this.loginForm.get('otpCode')?.updateValueAndValidity();

    verifyOtpSubmit()
    {
    this.service.verifyOtp(this.verificationData).subscribe({
      next: (res: any) => {
        console.log("Access pass granted!", res);

        // 👉 ADD THESE 3 LINES RIGHT HERE 👈
        // This saves the ID and Name from your C# backend into the browser
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('userName', res.name);
        this.service.userName$.next(res.name); // Instantly updates the Header

       this.router.navigate(['/registration']); 
      },
      error: (err: any) => {
        console.error("OTP Failed", err);
      }
    });
  }

  }
}

function verifyOtpSubmit() {
  throw new Error('Function not implemented.');
}
