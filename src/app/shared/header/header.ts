import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [AuthService],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  currentUserName: string = 'User';
  dropdownOpen: boolean = false;

  constructor(
    private router: Router,
    private service: AuthService,
  ) {}

  ngOnInit() {
    this.service.userName$.subscribe((name) => {
      this.currentUserName = name;
    });
  }

  isLoggedIn(): boolean {
    // If we are NOT on the login or signup page, assume we are logged in
    return this.router.url !== '/login' && this.router.url !== '/signup';
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  logout() {
    localStorage.clear();
    this.closeDropdown();
    this.router.navigate(['/login']);
  }
}
