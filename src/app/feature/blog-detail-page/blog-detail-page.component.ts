import { Component, inject, OnInit } from '@angular/core';
import { BlogEntry, BlogEntryOverview } from '../../core/model/blog-entry';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';
import { BlogBackendService } from '../../core/service/blogBackend/blog-backend.service';
import { HeaderComponent } from '../../core/header/header.component';
import { StateService } from '../../core/service/state.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/service/auth/auth.service';

@Component({
  selector: 'app-blog-detail-page',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    BlogCardComponent,
    HeaderComponent,
    MatProgressSpinner,
  ],
  templateUrl: './blog-detail-page.component.html',
  styleUrl: './blog-detail-page.component.scss',
})
export class BlogDetailPageComponent implements OnInit {
  blogEntry!: BlogEntry;
  blogBackendService = inject(BlogBackendService);
  authService = inject(AuthService);

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

  handleAddComment(comment: string) {
    this.blogBackendService.addComment(comment, this.blogEntry.id).subscribe({
      next: () => {
        // Nach erfolgreichem Hinzufügen des Kommentars den gesamten Blog neu laden
        this.blogBackendService.getBlogDetail(this.blogEntry.id).subscribe({
          next: (updatedBlogEntry) => {
            this.blogEntry = updatedBlogEntry; // Blog-Eintrag mit neuen Kommentaren aktualisieren
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
    this.blogBackendService.deleteBlogEntry(blogId).subscribe(() => {
      this.stateService.rxGetBlogs();
    });
    this.handleBackButton();
  }
}
