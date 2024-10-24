import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgSwitch } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgSwitch, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'blog-app-angular';

  onButtonClick(): void {
    console.log('Button clicked!');
    if (this.isVisible) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }

    if (this.isActive) {
      this.isActive = false;
    } else {
      this.isActive = true;
    }

    if (this.switchValue === 'case1') {
      this.switchValue = 'case2';
    } else {
      this.switchValue = 'case1';
    }
    if (this.items.length > 0) {
      this.items.pop();
    } else {
      this.items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
    }
  }

  isVisible = true;
  switchValue = 'case1';
  items = ['Item 1', 'Item 2', 'Item 3'];
  isActive = true;
  inputValue = 'input value';
}
