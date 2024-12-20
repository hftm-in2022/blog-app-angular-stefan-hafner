import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  BlogEntry,
  BlogEntryOverview,
  BlogEntryOverviewResponse,
} from '../../core/model/blog-entry';
import { AsyncPipe } from '@angular/common';
import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../core/header/header.component';
import { map } from 'rxjs';
import { StateService } from '../../core/service/state.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-blog-overview-page',
  standalone: true,
  imports: [
    AsyncPipe,
    BlogCardComponent,
    HeaderComponent,
    RouterLink,
    MatProgressSpinner,
    MatPaginator,
  ],
  templateUrl: './blog-overview-page.component.html',
  styleUrl: './blog-overview-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogOverviewPageComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  stateService = inject(StateService);
  loading = this.stateService.loading;
  blogOverview$ = this.activatedRoute.data.pipe(map((data) => data['blog']));

  blogs: BlogEntryOverview[] = [];
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(map((data) => data['blog']))
      .subscribe((response: BlogEntryOverviewResponse) => {
        this.blogs = response.data;
        this.totalItems = response.totalCount;
      });
  }

  loadBlogs(page: number, pageSize: number): void {
    this.stateService.rxGetBlogs({ page, pageSize }).subscribe({
      next: (response) => {
        if (response?.data && Array.isArray(response.data)) {
          this.blogs = response.data; // Blog-Daten
        } else {
          console.error('Invalid API response format:', response);
          this.blogs = []; // Fallback
        }
      },
      error: (err) => {
        console.error('Error loading blogs:', err);
        this.blogs = []; // Fallback bei Fehler
      },
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadBlogs(this.currentPage, this.pageSize);
  }

  handleNavigationToDetails(blogId: number) {
    //this.stateService.rxGetBlogDetail(blogId);
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
