import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationFormComponent } from './registration-form/registration-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RegistrationFormComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'RegistrationUI';
}