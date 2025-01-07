import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { BlogBackendService } from './core/service/blogBackend/blog-backend.service';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { loggingInterceptor } from './core/interceptors/logging-interceptor';
import { GlobalErrorHandlerService } from './core/service/errorHandler/global-error-handler-service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor, provideAuth } from 'angular-auth-oidc-client';
import { authConfig } from './core/service/auth/auth.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([loggingInterceptor]), withFetch()),
    BlogBackendService,
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    provideAnimations(),
    provideAnimationsAsync(),
    provideAuth(authConfig),

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
};
