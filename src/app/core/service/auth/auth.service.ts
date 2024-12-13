import { inject, Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject } from 'rxjs';

export interface User {
  sub: string;
  email_verified: boolean;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

interface UserData {
  isAuthenticated: boolean;
  user: User;
  token?: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  oidcSecurityService = inject(OidcSecurityService);

  private userData$: BehaviorSubject<UserData> = new BehaviorSubject<UserData>({
    isAuthenticated: false,
    user: {} as User,
  });

  // Method to trigger login
  login() {
    this.oidcSecurityService.authorize();
  }

  // Method to trigger logout
  logout() {
    this.oidcSecurityService.logoff().subscribe((result) => {
      console.log(result);
      //this.isAuthenticatedSubject.next(false); // Reset authentication status
    });
  }

  setUser(isAuthenticated: boolean, userData: User, token: string) {
    this.userData$.next({ isAuthenticated, user: userData, token });
  }

  getUser() {
    return this.userData$;
  }
}
