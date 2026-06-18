import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css' // Assuming you have a CSS file for styling
})
export class Signup implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Setting up the form to match the C# 'User' model exactly
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      salary: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.http.post('https://localhost:7158/api/Auth/signup', this.signupForm.value).subscribe({
        next: (response: any) => {
          console.log('Registration successful', response);
          alert('Account created successfully! Please log in.');
          
          // Send them to the login page after signing up
          this.router.navigateByUrl('/login'); 
        },
        error: (error) => {
          console.error('Registration failed', error);
          alert('Failed to create account. That email might already be registered.');
        }
      });
    } else {
      alert('Please fill out all fields correctly.');
    }
  }
}