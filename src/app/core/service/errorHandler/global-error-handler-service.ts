// src/app/core/services/global-error-handler.service.ts
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../notification.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error): void {
    const notificationService = this.injector.get(NotificationService);
    console.info('TEST:');
    // Check if the error is an HTTP error
    if (error instanceof HttpErrorResponse) {
      // Handle HTTP error
      this.handleHttpError(error, notificationService);
    } else {
      // Handle general errors
      console.error('An unexpected error occurred:', error);
      notificationService.showError('An unexpected error has occurred.');
    }
  }

  private handleHttpError(
    error: HttpErrorResponse,
    notificationService: NotificationService,
  ): void {
    let errorMessage = 'An error has occurred.';

    // Handle HTTP errors specifically
    switch (error.status) {
      case 401:
        errorMessage = 'You are not authorized to access this resource.';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 500:
        errorMessage = 'A server error occurred. Please try again later.';
        break;
      case 0:
        errorMessage =
          'No connection to the server. Please check your internet connection.';
        break;
      default:
        errorMessage = 'An unexpected error occurred. Please try again later.';
    }

    console.error(`HTTP Error ${error.status}: ${error.message}`);
    notificationService.showError(errorMessage); // Display user-friendly message
  }
}
