import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlogEntryOverview } from './interfaces/blog-entry-overview';
import { Observable } from 'rxjs';
import { BlogBackendService } from './core/service/blog-backend.service';
import { AsyncPipe } from '@angular/common';
import { BlogCardComponent } from './features/blog-card/blog-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, BlogCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'blog-app-angular';

  blogOverview$!: Observable<BlogEntryOverview[]>;

  constructor(private blogBackendService: BlogBackendService) {}

  ngOnInit() {
    console.log('Initializing blogOverview$...');
    this.blogOverview$ = this.blogBackendService.getBlogEntryOverview();
  }
}
