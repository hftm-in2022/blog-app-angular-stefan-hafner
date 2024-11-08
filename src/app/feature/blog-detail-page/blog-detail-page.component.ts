import { Component, OnInit } from '@angular/core';
import { BlogEntry, BlogEntryOverview } from '../../core/model/blog-entry';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';

@Component({
  selector: 'app-blog-detail-page',
  standalone: true,
  imports: [DatePipe, FormsModule, BlogCardComponent],
  templateUrl: './blog-detail-page.component.html',
  styleUrl: './blog-detail-page.component.scss',
})
export class BlogDetailPageComponent implements OnInit {
  blogEntry!: BlogEntry;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Access to the data loaded by the resolver
    this.blogEntry = this.route.snapshot.data['blog'];
    this.blogEntry.comments = this.blogEntry.comments || [];
    console.log(this.blogEntry.comments);
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

  handleAddComment(blogEntry: string) {
    console.log(blogEntry);
  }
}
