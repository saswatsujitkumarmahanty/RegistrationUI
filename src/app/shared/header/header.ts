import { Component, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
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

  get initials(): string {
    const name = this.currentUserName?.trim();
    if (!name) return '?';
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }

  isLoggedIn(): boolean {
    return this.router.url !== '/login' && this.router.url !== '/signup';
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }
 
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.dropdownOpen && !(event.target as HTMLElement).closest('.nav-profile')) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeDropdown();
  }

  logout() {
    localStorage.clear();
    this.closeDropdown();
    this.router.navigate(['/login']);
  }
}
