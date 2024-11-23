import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BlogCardComponent } from './shared/blog-card/blog-card.component';
import { BlogOverviewPageComponent } from './feature/blog-overview-page/blog-overview-page.component';
import { HeaderComponent } from './core/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
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
})
export class AppComponent {
  title = 'blog-app-angular';
}
