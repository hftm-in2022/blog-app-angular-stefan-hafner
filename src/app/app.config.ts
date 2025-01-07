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
/*
const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog-overview` : '';
const postLogoutRedirectUri = typeof window !== 'undefined' ? `${window.location.origin}/blog-overview` : '';
const silentRenewUrl = typeof window !== 'undefined' ? window.location.origin + '/silent-renew.html' : '';
*/

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
    /* provideAuth(
     {
   config: {
     authority:'https://d-cap-keyclaok.kindbay-711f60b2.westeurope.azurecontainerapps.io/realms/blog',
     redirectUrl: redirectUrl,
     postLogoutRedirectUri: postLogoutRedirectUri,
     clientId: 'spa-blog',
     scope: 'openid profile email offline_access blogs',
     responseType: 'code',
     silentRenew: true,
     silentRenewUrl: silentRenewUrl,
     useRefreshToken: true,
     renewTimeBeforeTokenExpiresInSeconds: 30,
     logLevel: LogLevel.Debug,},
 }),*/
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    /*
    {
      provide: StsConfigLoader,
      useFactory: () => new StsConfigStaticLoader(authConfig),
    },
    */
  ],
};
