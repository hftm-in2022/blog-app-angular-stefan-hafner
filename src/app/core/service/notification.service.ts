import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration of display in milliseconds
      panelClass: ['error-snackbar'], // Optional: adds custom class
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
