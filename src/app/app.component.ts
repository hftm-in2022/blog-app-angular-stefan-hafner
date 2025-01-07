import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/service/auth/auth.service';
import { SidebarComponent } from './core/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, SidebarComponent],
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
