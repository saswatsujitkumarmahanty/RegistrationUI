import { Routes } from '@angular/router';
import { Registration } from './pages/employee/registration/registration';
import { AddEmployee } from './pages/employee/add-employee/add-employee';
import { ViewRegister } from './pages/employee/view-register/view-register';
import { UpdateEmployee } from './pages/employee/update-employee/update-employee';
import { Login } from './pages/auth/login/login';
import { Signup } from './pages/auth/signup/signup';
import { Account } from './pages/account/account';
import { Password } from './pages/auth/set-password/password';
import { LoginPassword } from './pages/auth/login-password/login-password';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/role.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'login-password', component: LoginPassword },
  { path: 'password', component: Password, canActivate: [authGuard] },
  { path: 'registration', component: Registration, canActivate: [authGuard] },
  { path: 'view-register/:id', component: ViewRegister, canActivate: [authGuard] },
  { path: 'account', component: Account, canActivate: [authGuard] },

  // Admin-only — mirrors backend [Authorize(Roles = "Admin")] on EmployeeController writes
  { path: 'add-employee', component: AddEmployee, canActivate: [adminGuard] },
  { path: 'update-employee/:id', component: UpdateEmployee, canActivate: [adminGuard] },
];

