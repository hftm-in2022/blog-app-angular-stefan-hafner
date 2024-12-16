import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { hasRole } from './jwt';
import { map, take, of, catchError } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getLoginResponse().pipe(
    take(1),
    map((loginResponse) => {
      if (!loginResponse.isAuthenticated) {
        authService.login();
        return false;
      }

      if (hasRole('user', loginResponse.accessToken)) {
        return true;
      }

      return router.parseUrl('/blog-overview'); //redirect to blog-overview
    }),
    catchError((error) => {
      console.error('Error in isAuthenticatedGuard:', error);
      authService.login();
      return of(false);
    }),
  );
};
