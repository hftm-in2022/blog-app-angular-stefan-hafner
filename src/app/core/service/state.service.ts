import { computed, inject, Injectable, signal } from '@angular/core';
import { BlogEntry, BlogEntryOverview } from '../model/blog-entry';
import { BlogBackendService } from './blogBackend/blog-backend.service';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';

interface GetBlogs {
  searchString: string;
}

interface GetBlogDetail {
  id: number;
}

interface BlogState {
  isLoading: boolean;
  blogs: BlogEntryOverview[] | null;
  blogDetail: BlogEntry | null;
  error: Error | null;
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  #BlogbackendService = inject(BlogBackendService);
  // action queue
  #getBlogsAction$ = new Subject<GetBlogs>();
  #getBlogDetailAction$ = new Subject<GetBlogDetail>();

  #state = signal<BlogState>({
    isLoading: false,
    blogs: [],
    blogDetail: null,
    error: null,
  });

  loading = computed(() => this.#state().isLoading);

  constructor() {
    this.#getBlogsAction$
      .pipe(
        debounceTime(200),
        tap(() => this.setLoadingState()),
        switchMap((action) =>
          this.#BlogbackendService.getBlogEntryOverview(action.searchString),
        ),
      )
      .subscribe({
        next: (blogs) => this.setLoadedBlogs(blogs),
        error: (error) => this.setError(error),
      });
    // Detailansicht
    this.#getBlogDetailAction$
      .pipe(
        tap(() => this.setLoadingState()),
        switchMap((action) =>
          this.#BlogbackendService.getBlogDetail(action.id),
        ),
      )
      .subscribe({
        next: (blogDetail) => this.setLoadedBlogDetail(blogDetail),
        error: (error) => this.setError(error),
      });
  }

  // reducers
  setLoadingState() {
    this.#state.update((state) => ({
      ...state,
      isLoading: true,
    }));
  }

  setLoadedBlogs(blogs: BlogEntryOverview[]) {
    this.#state.update((state) => ({
      ...state,
      isLoading: false,
      blogs,
    }));
  }

  setLoadedBlogDetail(blogDetail: BlogEntry) {
    this.#state.update((state) => ({
      ...state,
      isLoading: false,
      blogDetail,
    }));
  }

  setError(error: Error) {
    this.#state.update((state) => ({
      ...state,
      isLoading: false,
      error,
    }));
  }

  // async actions
  rxGetBlogs(filter?: { searchString?: string }) {
    this.#getBlogsAction$.next({
      searchString: filter?.searchString || '',
    });
  }

  rxGetBlogDetail(id: number) {
    this.#getBlogDetailAction$.next({ id });
  }
}
