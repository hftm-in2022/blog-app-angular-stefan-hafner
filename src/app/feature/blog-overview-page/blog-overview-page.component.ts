import { Component, OnInit } from '@angular/core';
import { BlogEntry, BlogEntryOverview } from '../../core/model/blog-entry';
import { AsyncPipe } from '@angular/common';
import { Location } from '@angular/common';
import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-overview-page',
  imports: [AsyncPipe, BlogCardComponent, RouterLink],
  templateUrl: './blog-overview-page.component.html',
  styleUrl: './blog-overview-page.component.scss',
})
export class BlogOverviewPageComponent implements OnInit {
  blogOverview!: BlogEntryOverview[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit() {
    this.blogOverview = this.route.snapshot.data['blog'];
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
