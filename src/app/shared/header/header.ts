import { Component, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  currentUserName: string = 'User';
  avatarUrl: string | null = null;
  dropdownOpen: boolean = false;
  showHeader: boolean = false;

  private readonly publicRoutes = ['/', '/signup', '/login', '/login-password'];
  private routerSub?: Subscription;

  constructor(
    private router: Router,
    private service: AuthService,
  ) {}

  ngOnInit() {
    this.service.userName$.subscribe((name) => {
      this.currentUserName = name;
    });
    this.service.avatarUrl$.subscribe((url: string | null) => {
      this.avatarUrl = url;
    });
    this.updateShowHeader(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateShowHeader(event.urlAfterRedirects));
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  private updateShowHeader(url: string) {
    this.showHeader = !this.publicRoutes.includes(url.split('?')[0]);
  }

  get initials(): string {
    const name = this.currentUserName?.trim();
    if (!name) return '?';
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
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
    this.closeDropdown();
    this.service.logout();
  }
}
