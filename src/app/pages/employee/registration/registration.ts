import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Employee } from '../../../core/models/employee';
import { EmployeeService } from '../../../core/services/employee.service';
import { isAdmin } from '../../../core/utilities/storage.utilities';

type SortKey = 'id' | 'name' | 'gender' | 'email' | 'phone' | 'age' | 'salary';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Registration implements OnInit {
  apiData: Employee[] = [];
  allEmployees: Employee[] = [];
  displayEmployees: Employee[] = [];
  isAdmin: boolean = isAdmin();

  isLoading = true;
  loadError = false;
  searchTerm = '';
  private searchDebounce: any;

  sortKey: SortKey | null = null;
  sortDir: SortDir = 'asc';

  pageSize = 10;
  currentPage = 1;
  pagedEmployees: Employee[] = [];

  removingId: string | number | null = null;
 
  pendingDelete: Employee | null = null;
  isDeleting = false;
 
  toastMessage = '';
  toastKind: 'success' | 'error' = 'success';
  private toastTimeout: any;
 
  constructor(
    private employeeService: EmployeeService, // Using your clean service layer
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData(): void {
    this.isLoading = true;
    this.loadError = false;
    this.employeeService.getData().subscribe({
      next: (res: Employee[]) => {
        this.apiData = res; 
        this.allEmployees = res; 
        this.applyFilters();
        this.isLoading = false; 
      },
      error: (err: any) => {
        console.error('Error fetching employee directory:', err);
        this.loadError = true;
        this.isLoading = false;
      }
    });
  }

  onSearch(event: any): void {
    const value = event.target.value;
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.searchTerm = value.toLowerCase();
      this.currentPage = 1;
      this.applyFilters();
    }, 200);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  setSort(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = this.searchTerm
      ? this.allEmployees.filter((emp) => emp.name?.toLowerCase().includes(this.searchTerm))
      : [...this.allEmployees];
 
    if (this.sortKey) {
      const key = this.sortKey;
      const dir = this.sortDir === 'asc' ? 1 : -1;
      result = result.sort((a: any, b: any) => {
        const av = a[key];
        const bv = b[key];
        if (typeof av === 'number' && typeof bv === 'number') {
          return (av - bv) * dir;
        }
        return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
      });
    }
 
    this.displayEmployees = result;
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.displayEmployees.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  private updatePagination(): void {
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedEmployees = this.displayEmployees.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.updatePagination();
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  AddEmployee(): void {
    this.router.navigateByUrl('add-employee');
  }

  onUpdate(id: string | number): void {
    this.router.navigate(['update-employee', id]);
  }

  onView(id: string | number): void {
    this.router.navigate(['view-register', id]);
  }

  requestDelete(emp: Employee): void {
    this.pendingDelete = emp;
  }
 
  cancelDelete(): void {
    this.pendingDelete = null;
  }
 
  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const emp = this.pendingDelete;
    this.isDeleting = true;
 
    const result: any = this.employeeService.deleteData(emp.id);
    const finish = (success: boolean) => {
      this.isDeleting = false;
      this.pendingDelete = null;
      if (success) {
        this.removingId = emp.id;
        this.showToast(`${emp.name} was removed`, 'success');
        setTimeout(() => {
          this.getAllData();
          this.removingId = null;
        }, 220);
      } else {
        this.showToast('Could not delete employee. Please try again.', 'error');
      }
    };
 
    if (result && typeof result.subscribe === 'function') {
      result.subscribe({
        next: () => finish(true),
        error: (err: any) => {
          console.error('Error deleting employee record:', err);
          finish(false);
        },
      });
    } else {
      finish(true);
    }
  }
 
  private showToast(message: string, kind: 'success' | 'error'): void {
    clearTimeout(this.toastTimeout);
    this.toastMessage = message;
    this.toastKind = kind;
    this.toastTimeout = setTimeout(() => (this.toastMessage = ''), 3000);
  }
 
}