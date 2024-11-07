import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BlogEntryOverview } from '../../core/interfaces/blog-entry-overview';
import { BlogBackendService } from '../../core/service/blogBackend/blog-backend.service';
import { AsyncPipe } from '@angular/common';
import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-overview-page',
  standalone: true,
  imports: [AsyncPipe, BlogCardComponent, RouterLink],
  templateUrl: './blog-overview-page.component.html',
  styleUrl: './blog-overview-page.component.scss',
})
export class BlogOverviewPageComponent implements OnInit {
  blogOverview$!: Observable<BlogEntryOverview[]>;

  constructor(private blogBackendService: BlogBackendService) {}

  ngOnInit() {
    console.log('Initializing blogOverview$...');
    this.blogOverview$ = this.blogBackendService
      .getBlogEntryOverview()
      .pipe(tap((data) => console.log('blogOverview$ data:', data)));
  }
}
