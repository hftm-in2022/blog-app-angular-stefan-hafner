import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { BlogEntry } from '../../core/model/blog-entry';
import { BlogBackendService } from '../../core/service/blogBackend/blog-backend.service';

export const blogDetailResolver: ResolveFn<BlogEntry> = (route) => {
  const blogService = inject(BlogBackendService);
  const blogId: number = parseInt(route.paramMap.get('id')!);

  return blogService.getBlogDetail(blogId!);
};
