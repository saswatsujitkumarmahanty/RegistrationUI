import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Employee } from '../employee';
import { Service } from '../service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [CommonModule],
  templateUrl: './registration.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './registration.css',
})
export class Registration implements OnInit {
  apiData: Employee[] = [];
  allEmployees: any[] = [];
  displayEmployees: any[] = [];

  constructor(
    private registration: Service,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAllData();
  }

  // Inside registration.ts

  getAllData() {
    this.registration.getData('https://localhost:7158/api/Employee').subscribe((res) => {
      this.apiData = res; // Keep if needed elsewhere
      this.allEmployees = res; // Store the original vault for the search filter
      this.displayEmployees = res; // Populate the initial table view
    });
  }
  // ADD THIS NEW METHOD
  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    // Filter the original vault, and update the display array
    this.displayEmployees = this.allEmployees.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm),
    );
  }

  AddEmployee() {
    this.router.navigateByUrl('add-employee');
  }
  onUpdate(id: any) {
    this.router.navigate(['update-employee', id]);
  }
  onView(id: any) {
    this.router.navigate(['view-register', id]);
  }
  onDelete(id: any) {
    this.registration.deleteData(id).subscribe((res) => {
      this.getAllData();
    });
  }
}
