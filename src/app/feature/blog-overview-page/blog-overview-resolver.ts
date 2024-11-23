import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { BlogEntryOverview } from '../../core/model/blog-entry';
import { BlogBackendService } from '../../core/service/blogBackend/blog-backend.service';

export const blogOverviewResolver: ResolveFn<BlogEntryOverview[]> = (route) => {
  const queryParams = route?.queryParams;
  const searchString = queryParams['searchString'];
  const blogBackendService = inject(BlogBackendService);
  return blogBackendService.getBlogEntryOverview(searchString);
};
