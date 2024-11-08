import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BlogEntry, BlogEntryOverview } from '../../core/model/blog-entry';
import { BlogBackendService } from '../../core/service/blogBackend/blog-backend.service';
import { AsyncPipe } from '@angular/common';
import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-overview-page',
  standalone: true,
  imports: [AsyncPipe, BlogCardComponent, RouterLink],
  templateUrl: './blog-overview-page.component.html',
  styleUrl: './blog-overview-page.component.scss',
})
export class BlogOverviewPageComponent implements OnInit {
  blogOverview$!: Observable<BlogEntryOverview[]>;

  constructor(
    private blogBackendService: BlogBackendService,
    private router: Router,
  ) {}

  ngOnInit() {
    console.log('Initializing blogOverview$...');
    this.blogOverview$ = this.blogBackendService
      .getBlogEntryOverview()
      .pipe(tap((data) => console.log('blogOverview$ data:', data)));
  }

  handleNavigationToDetails(blogId: number) {
    this.router.navigate(['/blog-detail', blogId]);
  }

  handleLike(blog: BlogEntryOverview | BlogEntry) {
    /* Error 401 (Unauthorized) when calling the backend
    this.blogBackendService.likeBlogEntry(blog.id).subscribe(() => {
      blog.likedByMe = true;
      blog.likes++;
    });
    */
    blog.likedByMe = true;
    blog.likes++;
  }

  handleUnlike(blog: BlogEntryOverview | BlogEntry) {
    /* Error 401 (Unauthorized) when calling the backend
    this.blogBackendService.unlikeBlogEntry(blog.id).subscribe(() => {
     blog.likedByMe = false;
     blog.likes--;
    });
     */
    blog.likedByMe = false;
    blog.likes--;
  }
}
