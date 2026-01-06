import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthApiService } from '../../services/auth-api.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthApiService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  // Redirect to home if not admin
  router.navigate(['/']);
  return false;
};
