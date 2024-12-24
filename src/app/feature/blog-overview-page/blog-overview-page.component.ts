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
import { BlogBackendService } from '../../core/service/blogBackend/blog-backend.service';

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
  blogBackendService = inject(BlogBackendService);

  stateService = inject(StateService);
  loading = this.stateService.loading;
  blogOverview$ = this.activatedRoute.data.pipe(
    map((data) => data['blog']), // Das gesamte BlogEntryOverviewResponse-Objekt
    map((response: BlogEntryOverviewResponse) => response.data), // Nur das `data`-Array extrahieren
  );

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(map((data) => data['blog']))
      .subscribe((response: BlogEntryOverviewResponse) => {
        this.totalItems = response.totalCount;
        this.pageSize = response.pageSize;
        this.currentPage = response.pageIndex;
      });
  }

  onNextPage(event: { pageIndex: number; pageSize: number }): void {
    const page = event.pageIndex;
    const pageSize = event.pageSize;

    // Extract query parameters and update navigation
    this.activatedRoute.queryParams
      .subscribe((params) => {
        const searchString = params['searchString'] || null; // Use existing searchString if available

        // Navigate with updated query parameters
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: {
            page,
            pageSize,
            ...(searchString ? { searchString } : {}),
          },
          queryParamsHandling: 'merge', // Retain existing query parameters
        });
      })
      .unsubscribe(); // Unsubscribe directly to avoid memory leaks
  }

  handleNavigationToDetails(blogId: number) {
    //this.stateService.rxGetBlogDetail(blogId);
    this.router.navigate(['/blog-detail', blogId]);
  }

  handleLike(blog: BlogEntryOverview | BlogEntry) {
    this.blogBackendService.likeBlogEntry(blog.id).subscribe(() => {
      blog.likedByMe = true;
    });

    blog.likedByMe = true;
  }

  handleUnlike(blog: BlogEntryOverview | BlogEntry) {
    this.blogBackendService.unlikeBlogEntry(blog.id).subscribe(() => {
      blog.likedByMe = false;
    });
    blog.likedByMe = false;
  }
}
