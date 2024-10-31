import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keycloakConfig } from './auth.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenUrl = `${keycloakConfig.tokenService}/token`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', 'your-client-id'); // Muss konfiguriert werden
    body.set('username', username);
    body.set('password', password);

    return this.http.post(this.tokenUrl, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }
}
