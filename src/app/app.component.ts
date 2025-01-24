import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/service/auth/auth.service';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterModule, SidebarComponent, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'blog-app-angular';
  languages = ['en', 'de'];

  private authService = inject(AuthService);

  constructor(private translate: TranslateService) {
    // Sprachen konfigurieren und Standard-Sprache setzen
    this.translate.addLangs(this.languages);
    this.translate.setDefaultLang('en');
    this.translate.use('de');
  }

  ngOnInit() {
    this.authService.handlePostLogin();
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
}
