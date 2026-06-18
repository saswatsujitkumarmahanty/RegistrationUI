import { Routes } from '@angular/router';
import { Router } from '@angular/router';
import { Registration } from './registration/registration';
import { AddEmployee } from './add-employee/add-employee';
import { ViewRegister } from './view-register/view-register';
import { UpdateEmployee } from './update-employee/update-employee';
import { Login } from './login/login';
import { Signup } from './signup/signup';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'registration', component: Registration },
  { path: 'add-employee', component: AddEmployee },
  { path: 'view-register/:id', component: ViewRegister },
  { path: 'update-employee/:id', component: UpdateEmployee },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
];

