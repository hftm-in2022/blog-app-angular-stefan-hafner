import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { BlogEntryOverviewResponse } from '../../core/model/blog-entry';
import { StateService } from '../../core/service/state.service';

export const blogOverviewResolver: ResolveFn<BlogEntryOverviewResponse> = (
  route,
) => {
  const queryParams = route?.queryParams;
  const searchString = queryParams['searchString'];
  const page = parseInt(queryParams['page'], 10) || 1;
  const pageSize = parseInt(queryParams['pageSize'], 10) || 10;
  const stateService = inject(StateService);
  return stateService.rxGetBlogs({ searchString, page, pageSize });
};
