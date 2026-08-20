import { Component, OnInit, ChangeDetectionStrategy, ViewChildren, QueryList, ElementRef, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { AuthService } from '../../../core/services/service'; // Ensure this relative path points to your service.ts
import { storeAuthResponse } from '../../../core/utilities/storage.utilities';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {
  @ViewChildren('otpInputs') otpInputRefs!: QueryList<ElementRef<HTMLInputElement>>;
  
  loginForm!: FormGroup;
  showOtpStep: boolean = false;
  isSubmitting = false;
  errorMessage = '';
  shake = false;

  otpDigits: string[] = ['', '', '', '', '', ''];
 
  resendSeconds = 0;
  resendJustSent = false;
  private resendSub?: Subscription;
 
  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      otpCode: [''],
    });
  }

  ngOnDestroy(): void {
    this.resendSub?.unsubscribe();
  }

  onSubmit() {
    this.errorMessage = '';
    if (!this.showOtpStep) {
      this.handleRequestOtp();
    } else {
      this.handleVerifyOtp();
    }
  }

  private handleRequestOtp() {
    if (this.loginForm.get('email')?.valid && this.loginForm.get('phone')?.valid) {
      this.isSubmitting = true;
      const credentials = {
        email: this.loginForm.value.email,
        phone: this.loginForm.value.phone,
      };

      this.service.login(credentials).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.showOtpStep = true;

          this.loginForm
            .get('otpCode')
            ?.setValidators([Validators.required, Validators.minLength(6)]);
          this.loginForm.get('otpCode')?.updateValueAndValidity();
          this.startResendCooldown();
          },
        error: (error) => {
          console.error('Step 1 Auth Request Denied', error);
          this.isSubmitting = false;
          this.errorMessage =
          error.error?.message || 'The credentials entered could not be verified.';
        this.triggerShake();
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

      this.service.verifyOtp(verificationPayload).subscribe({
  next: (res: any) => {
    console.log('Access pass granted!', res);
    storeAuthResponse(res); 
    this.service.userName$.next(res.name);
    this.isSubmitting = false;
    this.router.navigateByUrl('/password');
  },
        error: (error) => {
          console.error('Step 2 Token Check Refused', error);
          this.isSubmitting = false;
          this.errorMessage =
          error.error?.message || 'The authorization token entry checked is invalid or expired.'
          this.triggerShake();
          this.otpDigits = ['', '', '', '', '', ''];
          this.loginForm.get('otpCode')?.setValue('');
        },
      });
    } else {
      this.loginForm.get('otpCode')?.markAsTouched();
      this.triggerShake();
    }
  }
 
  backToLoginCredentials() {
    this.showOtpStep = false;
    this.errorMessage = '';
    this.otpDigits = ['', '', '', '', '', ''];
    this.resendSub?.unsubscribe();
    this.resendSeconds = 0;
    this.loginForm.get('otpCode')?.clearValidators();
    this.loginForm.get('otpCode')?.setValue('');
    this.loginForm.get('otpCode')?.updateValueAndValidity();
  }

  private get otpInputs(): HTMLInputElement[] {
    return this.otpInputRefs ? this.otpInputRefs.map((r) => r.nativeElement) : [];
  }
 
  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/[^0-9]/g, '').slice(-1);
    this.otpDigits[index] = val;
    input.value = val;
 
    this.syncOtpControl();
 
    if (val && index < 5) {
      this.otpInputs[index + 1]?.focus();
    }
  }
 
  onOtpKeydown(event: KeyboardEvent, index: number) {
    const inputs = this.otpInputs;
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      inputs[index - 1]?.focus();
      this.otpDigits[index - 1] = '';
      if (inputs[index - 1]) inputs[index - 1].value = '';
      this.syncOtpControl();
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputs[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      inputs[index + 1]?.focus();
    }
  }
 
  onOtpPaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    const inputs = this.otpInputs;
    for (let i = 0; i < 6; i++) {
      this.otpDigits[i] = pasted[i] || '';
      if (inputs[i]) inputs[i].value = pasted[i] || '';
    }
    this.syncOtpControl();
    const nextEmpty = this.otpDigits.findIndex((d) => !d);
    inputs[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  }
 
  private syncOtpControl() {
    this.loginForm.get('otpCode')?.setValue(this.otpDigits.join(''));
    this.loginForm.get('otpCode')?.markAsDirty();
  }
 
  private startResendCooldown() {
    this.resendJustSent = false;
    this.resendSeconds = 30;
    this.resendSub?.unsubscribe();
    this.resendSub = interval(1000).subscribe(() => {
      this.resendSeconds -= 1;
      if (this.resendSeconds <= 0) {
        this.resendSub?.unsubscribe();
      }
    });
  }
 
  resendOtp() {
    if (this.resendSeconds > 0 || this.isSubmitting) return;
    const credentials = {
      email: this.loginForm.value.email,
      phone: this.loginForm.value.phone,
    };
    this.service.login(credentials).subscribe({
      next: () => {
        this.resendJustSent = true;
        this.startResendCooldown();
        setTimeout(() => (this.resendJustSent = false), 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Could not resend the code. Try again.';
        this.triggerShake();
      },
    });
  }
 
  private triggerShake() {
    this.shake = false;
    setTimeout(() => (this.shake = true), 0);
    setTimeout(() => (this.shake = false), 500);
  }
}

