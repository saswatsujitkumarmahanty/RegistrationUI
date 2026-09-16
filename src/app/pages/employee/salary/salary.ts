import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../core/services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../../core/models/employee';

@Component({
  selector: 'app-salary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salary.html',
  styleUrl: './salary.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Salary implements OnInit {
  employeeData: Employee | null = null;
  isLoading = true;
  loadError = false;

  breakdown: any = null;

  constructor(
    private employeeService: EmployeeService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.params['id'];
    if (id) {
      this.loadEmployeeCtc(id);
    }
  }

  loadEmployeeCtc(id: string | number): void {
    this.isLoading = true;
    this.loadError = false;
    this.employeeService.getDataById(id).subscribe({
      next: (res) => {
        this.employeeData = res;
        this.calculateBreakdown(Number(res.salary));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching employee CTC details:', err);
        this.isLoading = false;
        this.loadError = true;
      },
    });
  }

  calculateBreakdown(ctc: number): void {
    const basic = ctc * 0.66;
    const da = basic * 0.03;
    const hra = basic * 0.10;
    const medical = basic * 0.05;
    const pf = basic * 0.12;
    const totalDeductions = basic + da + hra + medical + pf;
    const other = ctc - totalDeductions;

    this.breakdown = {
      basic: basic,
      da: da,
      hra: hra,
      medical: medical,
      pf: pf,
      other: other > 0 ? other : 0 // Prevents negative values if deductions exceed CTC
    };
  }

  OnBack(): void {
    this.router.navigateByUrl('registration');
  }
}
