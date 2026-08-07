import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isTokenExpired } from '../core/utilities/jwit.utilities';
import { clearAuth, isAdmin } from '../core/utilities/storage.utilities';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
 
  if (!token || isTokenExpired(token)) {
    clearAuth();
    router.navigateByUrl('/login');
    return false;
  }
 
  if (!isAdmin()) {
     router.navigateByUrl('/registration');
    return false;
  }
 
  return true;
};