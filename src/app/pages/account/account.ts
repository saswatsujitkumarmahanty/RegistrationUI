import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['./account.css'],
})
export class Account implements OnInit {
  accountForm!: FormGroup;
  userId: string | null = '';
  successMessage: string = '';
  errorMessage: string = '';
  currentUserName: string = '';
  dropdownOpen: boolean = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    @Inject(AuthService) private service: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId');

    const currentName = localStorage.getItem('userName') || 'User';
    this.currentUserName = currentName;

    this.accountForm = this.fb.group({
      name: [currentName, [Validators.required, Validators.minLength(2)]],
    });
  }

  get initials(): string {
    const name = this.currentUserName?.trim();
    if (!name) return '?';
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }

  get nameField() {
    return this.accountForm.get('name');
  }
 
  get fieldValid(): boolean {
    return !!this.nameField && this.nameField.valid && this.nameField.dirty;
  }
 
  get hasChanges(): boolean {
    return this.accountForm.dirty && this.nameField?.value !== this.currentUserName;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  logout(): void {
    this.dropdownOpen = false;
    this.service.logout();
  }

  onSubmit() {
    this.errorMessage = '';
 
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }
    const newName = this.accountForm.value.name;
 
    if (!this.userId) {
      this.errorMessage = 'Your session appears to be invalid. Please log in again.';
      this.service.logout();
      return;
    }
 
    this.isSubmitting = true;
 
    this.service.updateUserName(this.userId, newName).subscribe({
      next: (res: any) => {
        localStorage.setItem('userName', newName);
        this.currentUserName = newName;
        this.service.userName$.next(newName);
        this.isSubmitting = false;
        this.successMessage = 'Name updated successfully.';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err: any) => {
        console.error('Update failed:', err);
        this.isSubmitting = false;
        this.errorMessage = 'Failed to update name. Please try again.';
      },
      });
    }
  }
