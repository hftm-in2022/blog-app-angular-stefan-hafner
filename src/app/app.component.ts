import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BlogCardComponent } from './shared/blog-card/blog-card.component';
import { BlogOverviewPageComponent } from './feature/blog-overview-page/blog-overview-page.component';
import { AuthService } from './core/service/auth/auth.service';
import { SidebarComponent } from './core/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    AsyncPipe,
    BlogCardComponent,
    BlogOverviewPageComponent,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'blog-app-angular';

  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.handlePostLogin();
  }
}
