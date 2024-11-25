import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { BlogBackendService } from './core/service/blogBackend/blog-backend.service';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { loggingInterceptor } from './core/interceptors/logging-interceptor';
import { GlobalErrorHandlerService } from './core/service/errorHandler/global-error-handler-service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideHttpClient(withInterceptors([loggingInterceptor]), withFetch()),
    BlogBackendService,
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    provideAnimations(),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
  ],
};
