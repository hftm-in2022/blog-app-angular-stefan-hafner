import { computed, inject, Injectable, signal } from '@angular/core';
import { BlogEntry, BlogEntryOverview } from '../model/blog-entry';
import { BlogBackendService } from './blogBackend/blog-backend.service';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  Observable,
  switchMap,
  tap,
} from 'rxjs';

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

  #state = signal<BlogState>({
    isLoading: false,
    blogs: [],
    blogDetail: null,
    error: null,
  });

  loading = computed(() => this.#state().isLoading);

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
  rxGetBlogs(filter?: {
    searchString?: string;
  }): Observable<BlogEntryOverview[]> {
    // Local state for the last request
    const searchString$ = new BehaviorSubject<string>(
      filter?.searchString || '',
    );

    return searchString$.pipe(
      debounceTime(200), // Wait time for rapid changes
      tap(() => this.setLoadingState()), // Activate loading state
      switchMap((searchString) =>
        this.#BlogbackendService.getBlogEntryOverview(searchString).pipe(
          tap((blogs) => this.setLoadedBlogs(blogs)), // Update state with loaded blogs
          catchError((error) => {
            this.setError(error); // Save error in state
            throw error; // Propagate the error
          }),
        ),
      ),
    );
  }

  rxGetBlogDetail(id: number): Observable<BlogEntry> {
    // Local state for the last request
    const blogDetailId$ = new BehaviorSubject<number>(id);

    return blogDetailId$.pipe(
      debounceTime(200), // Wait time for rapid changes
      tap(() => this.setLoadingState()), // Activate loading state
      switchMap((blogId) =>
        this.#BlogbackendService.getBlogDetail(blogId).pipe(
          tap((blogDetail) => this.setLoadedBlogDetail(blogDetail)), // Update state with loaded blog detail
          catchError((error) => {
            this.setError(error); // Save error in state
            throw error; // Propagate the error
          }),
        ),
      ),
    );
  }
}
