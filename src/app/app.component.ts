import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BlogCardComponent } from './shared/blog-card/blog-card.component';
import { BlogOverviewPageComponent } from './feature/blog-overview-page/blog-overview-page.component';
import { HeaderComponent } from './core/header/header.component';
import { AuthService } from './core/service/auth/auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    AsyncPipe,
    BlogCardComponent,
    BlogOverviewPageComponent,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'blog-app-angular';

  private readonly oidcSecurityService = inject(OidcSecurityService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, userData, accessToken }) => {
        console.log('app authenticated', isAuthenticated);
        this.authService.setUser(isAuthenticated, userData, accessToken);
      });
  }
}
