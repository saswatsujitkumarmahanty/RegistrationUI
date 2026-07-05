import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-register',
  imports: [CommonModule],
  templateUrl: './view-register.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './view-register.css',
})
export class ViewRegister implements OnInit {
  constructor(
    private registration: Service,
    private cdr: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) {}
  UserData: any;
  userId!: {
    //
    uid: any;
  };

  ngOnInit(): void {
    this.userId = {
      uid: this.activeRoute.snapshot.params['id'],
    };

    // Let's ask the console exactly what the backend is handing us
    this.registration.getDataById(this.userId.uid).subscribe({
      next: (res) => {
        console.log('BACKEND DATA ARRIVED:', res); // <--- This is the key!
        this.UserData = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API ERROR:', err);
      },
    });
  }
  OnClose() {
    this.router.navigateByUrl('registration');
  }
}
