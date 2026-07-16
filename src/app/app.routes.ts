import { Routes } from '@angular/router';
import { Registration } from './pages/employee/registration/registration';
import { AddEmployee } from './pages/employee/add-employee/add-employee';
import { ViewRegister } from './pages/employee/view-register/view-register';
import { UpdateEmployee } from './pages/employee/update-employee/update-employee';
import { Login } from './pages/auth/login/login';
import { Signup } from './pages/auth/signup/signup';
import { Account } from './pages/account/account';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'registration', component: Registration },
  { path: 'add-employee', component: AddEmployee },
  { path: 'view-register/:id', component: ViewRegister },
  { path: 'update-employee/:id', component: UpdateEmployee },
  { path: 'account', component: Account },
];

