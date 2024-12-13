import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { hasRole } from './jwt';

export const isAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getUser().getValue().isAuthenticated) {
    // If user is not logged in, redirect to the login page
    authService.login();
  }

  if (hasRole('user', authService.getUser().getValue().token)) {
    // If user has the user role, allow them to access the page
    return true;
  }

  // If user does not have the user role, redirect to the blogs page
  return router.parseUrl('/blogs');
};
