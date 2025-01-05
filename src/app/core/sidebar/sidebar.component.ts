import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  model,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { distinctUntilChanged, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { StateService } from '../service/state.service';
import { AuthService } from '../service/auth/auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatMenuTrigger,
    MatTooltip,
    MatMenu,
  ],
})
export class SidebarComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  stateService = inject(StateService);
  authService = inject(AuthService);
  readonly oidcSecurityService = inject(OidcSecurityService);
  private breakpointObserver = inject(BreakpointObserver);

  searchString = model<string>('');
  loading = this.stateService.loading;
  readonly isAuthenticated = this.oidcSecurityService.authenticated;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  sidenavTitle = 'Menu';
  isOverview = false;

  constructor() {
    this.activatedRoute.queryParamMap
      .pipe(distinctUntilChanged())
      .subscribe((params) => {
        this.searchString.set(params.get('searchString') || '');
      });

    effect(() => {
      this.searchString();
      if (this.isOverview) {
        const filter = {
          searchString: this.searchString(),
        };
        if (filter.searchString.length < 1) {
          this.router.navigate(['blog-overview'], {
            queryParams: {
              searchString: undefined,
            },
          });
        } else {
          this.router.navigate(['blog-overview'], {
            queryParams: {
              searchString: filter.searchString,
            },
          });
        }
      }
    });
    effect(() => {
      console.log(
        'Authentication state changed:',
        this.isAuthenticated().isAuthenticated,
      );
    });
  }

  ngOnInit() {
    this.stateService.sidenavInfo$.subscribe((info) => {
      this.sidenavTitle = info.title;
      this.isOverview = info.isOverview || false;
    });
  }

  login() {
    this.authService.login();
    console.log('click on login');
  }

  logout() {
    this.authService.logout();
    console.log('click on logout');
  }

  navigateToNewBlog() {
    this.router.navigate(['/blog-add']);
  }

  closeSideNav() {
    if (this.drawer?.mode === 'over') {
      this.drawer.close();
    }
  }
}
