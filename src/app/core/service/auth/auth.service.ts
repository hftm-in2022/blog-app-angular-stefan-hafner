import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService, LoginResponse } from 'angular-auth-oidc-client';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  sub: string;
  email_verified: boolean;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  oidcSecurityService = inject(OidcSecurityService);
  router = inject(Router);

  private loginResponse$ = new BehaviorSubject<LoginResponse>({
    isAuthenticated: false,
    userData: null, // use Null for default value
    accessToken: '',
    idToken: '',
    configId: '',
    errorMessage: '',
  });

  // Getter for LoginResponse
  getLoginResponse(): Observable<LoginResponse> {
    return this.loginResponse$.asObservable();
  }
  //Setter for LoginResponse
  setLoginResponse(loginResponse: LoginResponse) {
    this.loginResponse$.next(loginResponse);
  }

  // Method to trigger login
  login(): void {
    this.oidcSecurityService.authorize();
  }

  // Method to trigger logout
  logout() {
    this.oidcSecurityService.logoff().subscribe({
      next: (result) => {
        console.log(result);
      },
      error: (err) => {
        console.error('Error during logout:', err);
      },
    });
  }

  handlePostLogin(): void {
    this.oidcSecurityService
      .checkAuth()
      .pipe(
        tap((response) => {
          this.setLoginResponse(response);
        }),
        catchError((error) => {
          console.error('Error during post-login handling:', error);
          return of(null);
        }),
      )
      .subscribe();
  }
}
