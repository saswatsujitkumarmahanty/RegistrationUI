import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Service } from '../service';
import { RouterOutlet } from "@angular/router";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account.html',
  styleUrls: ['./account.css'] // (Optional: You can reuse your update-employee.css styling here)
})
export class Account implements OnInit {
logout() {
throw new Error('Method not implemented.');
}
closeDropdown // TEST MODE: If no userId is found, update the UI only (no DB save)
() {
throw new Error('Method not implemented.');
}
currentUserName: any;
dropdownOpen: any;
toggleDropdown() {
throw new Error('Method not implemented.');
}
  accountForm!: FormGroup;
  userId: string | null = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private service: Service) {}

 ngOnInit() {
    this.userId = localStorage.getItem('userId'); 
    
    const currentName = localStorage.getItem('userName') || 'Saswat Sujitkumar Mahanty';

    this.accountForm = this.fb.group({
      name: [currentName, [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit() {
    if (this.accountForm.valid) {
      const newName = this.accountForm.value.name;
      
      // TEST MODE: If no userId is found, update the UI only (no DB save)
      if (!this.userId) {
        console.warn("No User ID found! Updating UI for testing purposes only.");
        localStorage.setItem('userName', newName);
        this.service.userName$.next(newName);
        
        this.successMessage = 'Name updated!!';
        setTimeout(() => this.successMessage = '', 3000);
        return; // Stop here so it doesn't try to call the API
      }

      // REAL MODE: Send to backend
      this.service.UpdateUserName(this.userId, newName).subscribe({
        next: (res: any) => {
          localStorage.setItem('userName', newName);
          this.service.userName$.next(newName);
          
          this.successMessage = 'Name updated in database successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err: any) => {
          console.error('Update failed:', err);
          alert("Failed to update name in database. Check console.");
        }
      });
    }
  }
}
