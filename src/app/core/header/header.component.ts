import {
  ChangeDetectionStrategy,
  Component,
  Input,
  model,
  effect,
  inject,
} from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, Location } from '@angular/common';
import { StateService } from '../service/state.service';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbar,
    MatIconModule,
    MatIconButton,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    AsyncPipe,
  ],
  standalone: true,
})
export class HeaderComponent {
  @Input() isOverview = false;

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  location = inject(Location);
  stateService = inject(StateService);
  authService = inject(AuthService);

  searchString = model<string>('');
  loading = this.stateService.loading;
  isAuth$ = this.authService.getUser();

  constructor() {
    this.isAuth$.subscribe((value) => {
      console.log('Auth-Status geändert:', value.isAuthenticated);
    });
    this.activatedRoute.queryParamMap
      .pipe(distinctUntilChanged())
      .subscribe((params) => {
        this.searchString.set(params.get('searchString') || '');
      });

    effect(() => {
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
  }
  login() {
    this.authService.login();
    console.log('click on login');
  }

  logout() {
    this.authService.logout();
    console.log('click on logout');
  }
}
