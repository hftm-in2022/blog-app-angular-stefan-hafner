import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  BlogEntry,
  BlogEntryOverview,
  BlogEntryOverviewResponse,
} from '../../core/model/blog-entry';
import { AsyncPipe } from '@angular/common';
import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';
import { StateService } from '../../core/service/state.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { BlogBackendService } from '../../core/service/blogBackend/blog-backend.service';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';

@Component({
  selector: 'app-blog-overview-page',
  standalone: true,
  imports: [
    AsyncPipe,
    BlogCardComponent,
    RouterLink,
    MatProgressSpinner,
    MatPaginator,
    SidebarComponent,
  ],
  templateUrl: './blog-overview-page.component.html',
  styleUrl: './blog-overview-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogOverviewPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

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
      .pipe(
        map((data) => data['blog']),
        takeUntil(this.destroy$),
      )
      .subscribe((response: BlogEntryOverviewResponse) => {
        this.totalItems = response.totalCount;
        this.pageSize = response.pageSize;
        this.currentPage = response.pageIndex;
      });
    this.stateService.updateSidenavInfo('Blog Overview', true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNextPage(event: { pageIndex: number; pageSize: number }): void {
    const page = event.pageIndex;
    const pageSize = event.pageSize;

    // Extract query parameters and update navigation
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
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
    this.blogBackendService
      .likeBlogEntry(blog.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        blog.likedByMe = true;
      })
      .unsubscribe(); // Unsubscribe directly to avoid memory leaks;

    blog.likedByMe = true;
    blog.likes++;
  }

  handleUnlike(blog: BlogEntryOverview | BlogEntry) {
    this.blogBackendService
      .unlikeBlogEntry(blog.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        blog.likedByMe = false;
      })
      .unsubscribe(); // Unsubscribe directly to avoid memory leaks;
    blog.likedByMe = false;
    blog.likes--;
  }
}
