import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { BlogEntryOverview } from '../../core/model/blog-entry';
import { StateService } from '../../core/service/state.service';

export const blogOverviewResolver: ResolveFn<BlogEntryOverview[]> = (route) => {
  const queryParams = route?.queryParams;
  const searchString = queryParams['searchString'];
  const stateService = inject(StateService);
  return stateService.rxGetBlogs({ searchString: searchString });
};
