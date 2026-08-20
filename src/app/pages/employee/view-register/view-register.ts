import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../core/services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-register',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-register.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './view-register.css',
})
export class ViewRegister implements OnInit {
  constructor(
    private registration: EmployeeService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {}

  UserData: any;
  isLoading = true;
  loadError = false;
  copiedField: string | null = null;

  userId!: {
    uid: any;
  };

  ngOnInit(): void {
    this.userId = {
      uid: this.activeRoute.snapshot.params['id'],
    };
    this.loadEmployee();
  }

  loadEmployee(): void {
    this.isLoading = true;
    this.loadError = false;
    this.registration.getDataById(this.userId.uid).subscribe({
      next: (res) => {
        this.UserData = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching employee record:', err);
        this.isLoading = false;
        this.loadError = true;
      },
    });
  }

  copyToClipboard(field: string, value: string): void {
    if (!value) return;
    navigator.clipboard?.writeText(value).then(() => {
      this.copiedField = field;
      setTimeout(() => {
        if (this.copiedField === field) this.copiedField = null;
      }, 1500);
    });
  }

  OnClose() {
    this.router.navigateByUrl('registration');
  }
}
