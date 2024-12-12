import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BlogCardComponent } from './shared/blog-card/blog-card.component';
import { BlogOverviewPageComponent } from './feature/blog-overview-page/blog-overview-page.component';
import { HeaderComponent } from './core/header/header.component';
import { AuthService } from './core/service/auth/auth.service';

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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.loginResponse$.subscribe((response) => {
      if (response.isAuthenticated) {
        console.log('User is authenticated');
      } else {
        console.log('User is not authenticated');
      }
    });
  }
}
