import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { BlogEntry, BlogEntryOverview } from '../../core/model/blog-entry';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';
import { BlogBackendService } from '../../core/service/blogBackend/blog-backend.service';
import { StateService } from '../../core/service/state.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/service/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-blog-detail-page',
  standalone: true,
  imports: [FormsModule, BlogCardComponent, MatProgressSpinner],
  templateUrl: './blog-detail-page.component.html',
  styleUrl: './blog-detail-page.component.scss',
})
export class BlogDetailPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  blogEntry!: BlogEntry;
  blogBackendService = inject(BlogBackendService);
  authService = inject(AuthService);
  cdr = inject(ChangeDetectorRef);

  stateService = inject(StateService);
  loading = this.stateService.loading;
  private searchString = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    // Access to the data loaded by the resolver
    this.blogEntry = this.route.snapshot.data['blog'];
    this.blogEntry.comments = this.blogEntry.comments || [];
    this.stateService.updateSidenavInfo('Blog Detail', false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleLike(blog: BlogEntryOverview | BlogEntry) {
    this.blogBackendService
      .likeBlogEntry(blog.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.blogBackendService
            .getBlogDetail(this.blogEntry.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (updatedBlogEntry) => {
                this.blogEntry = updatedBlogEntry;
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('Failed to load updated blog entry:', err);
              },
            });
        },
        error: (err) => {
          console.error('Failed to like blog entry:', err);
        },
      });
  }

  handleUnlike(blog: BlogEntryOverview | BlogEntry) {
    this.blogBackendService
      .unlikeBlogEntry(blog.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.blogBackendService
            .getBlogDetail(this.blogEntry.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (updatedBlogEntry) => {
                this.blogEntry = updatedBlogEntry;
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('Failed to load updated blog entry:', err);
              },
            });
        },
        error: (err) => {
          console.error('Failed to unlike blog entry:', err);
        },
      });
  }

  handleAddComment(comment: string) {
    this.blogBackendService
      .addComment(comment, this.blogEntry.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Nach erfolgreichem Hinzufügen des Kommentars den gesamten Blog neu laden
          this.blogBackendService
            .getBlogDetail(this.blogEntry.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (updatedBlogEntry) => {
                this.blogEntry = updatedBlogEntry; // Blog-Eintrag mit neuen Kommentaren aktualisieren
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('Failed to load updated blog entry:', err);
              },
            });
        },
        error: (err) => {
          console.error('Failed to add comment:', err);
        },
      });
  }

  handleBackButton() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/default-route']);
    }
  }

  handleDelete(blogId: number) {
    this.blogBackendService
      .deleteBlogEntry(blogId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.stateService.rxGetBlogs();
      });
    this.handleBackButton();
  }
}
