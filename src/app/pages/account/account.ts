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
  currentUserName: string = '';
  dropdownOpen: boolean = false;

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
    if (this.accountForm.valid) {
      const newName = this.accountForm.value.name;

      if (!this.userId) {
        alert('Your session appears to be invalid. Please log in again.');
        this.service.logout();
        return;
      }

      this.service.updateUserName(this.userId, newName).subscribe({
        next: (res: any) => {
          localStorage.setItem('userName', newName);
          this.service.userName$.next(newName);
          this.successMessage = 'Name updated in database successfully!';
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (err: any) => {
          console.error('Update failed:', err);
          alert('Failed to update name in database. Check console.');
        },
      });
    }
  }
}