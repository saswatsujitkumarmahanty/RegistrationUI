import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isTokenExpired } from '../core/utilities/jwit.utilities';
import { clearAuth } from '../core/utilities/storage.utilities';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token && !isTokenExpired(token)) {
    return true;
  }

  clearAuth();

  router.navigateByUrl('/login');
  return false;
};