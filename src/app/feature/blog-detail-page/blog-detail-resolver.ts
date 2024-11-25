import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { BlogEntry } from '../../core/model/blog-entry';
import { StateService } from '../../core/service/state.service';

export const blogDetailResolver: ResolveFn<BlogEntry> = (route) => {
  const blogId: number = parseInt(route.paramMap.get('id')!);
  const stateService = inject(StateService);
  return stateService.rxGetBlogDetail(blogId);
};
