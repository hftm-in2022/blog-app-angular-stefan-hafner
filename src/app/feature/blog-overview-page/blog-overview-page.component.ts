import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BlogEntry, BlogEntryOverview } from '../../core/model/blog-entry';
import { AsyncPipe, Location } from '@angular/common';
import { BlogCardComponent } from '../../shared/blog-card/blog-card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../core/header/header.component';
import { map } from 'rxjs';
import { StateService } from '../../core/service/state.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-blog-overview-page',
  standalone: true,
  imports: [
    AsyncPipe,
    BlogCardComponent,
    HeaderComponent,
    RouterLink,
    MatProgressSpinner,
  ],
  templateUrl: './blog-overview-page.component.html',
  styleUrl: './blog-overview-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogOverviewPageComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  location = inject(Location);

  stateService = inject(StateService);
  loading = this.stateService.loading;

  blogOverview$ = this.activatedRoute.data.pipe(map((data) => data['blog']));

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
