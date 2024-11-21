import { Component, inject, OnInit } from '@angular/core';
import { BlogEntry, BlogEntryOverview } from '../../core/model/blog-entry';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';
import { BlogBackendService } from '../../core/service/blogBackend/blog-backend.service';

@Component({
  selector: 'app-blog-detail-page',
  standalone: true,
  imports: [DatePipe, FormsModule, BlogCardComponent],
  templateUrl: './blog-detail-page.component.html',
  styleUrl: './blog-detail-page.component.scss',
})
export class BlogDetailPageComponent implements OnInit {
  blogEntry!: BlogEntry;
  blogBackendService = inject(BlogBackendService);

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
    // Error 401 (Unauthorized) when calling the backend
    this.blogBackendService.likeBlogEntry(blog.id).subscribe(() => {
      blog.likedByMe = true;
      blog.likes++;
    });

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

  handleAddComment(blogEntry: string) {
    console.log(blogEntry);
  }

  handleBackButton() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/default-route']);
    }
  }
}
