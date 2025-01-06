import { computed, inject, Injectable, signal } from '@angular/core';
import {
  BlogEntry,
  BlogEntryOverview,
  BlogEntryOverviewResponse,
} from '../model/blog-entry';
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
  isSubmitting: boolean;
  blogs: BlogEntryOverview[] | null;
  blogDetail: BlogEntry | null;
  error: Error | null;
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  // Sidenav States
  private sidenavInfoSource = new BehaviorSubject<{
    title: string;
    isOverview: boolean;
  }>({
    title: 'Default',
    isOverview: false,
  });

  sidenavInfo$ = this.sidenavInfoSource.asObservable();

  updateSidenavInfo(title: string, isOverview: boolean) {
    this.sidenavInfoSource.next({ title, isOverview });
  }

  // Blog States
  #BlogbackendService = inject(BlogBackendService);

  #state = signal<BlogState>({
    isLoading: false,
    isSubmitting: false,
    blogs: [],
    blogDetail: null,
    error: null,
  });

  loading = computed(() => this.#state().isLoading);
  isSubmitting = computed(() => this.#state().isSubmitting);

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

  setSubmittingState() {
    this.#state.update((state) => ({
      ...state,
      isSubmitting: true,
    }));
  }

  setSubmitSuccess() {
    this.#state.update((state) => ({
      ...state,
      isSubmitting: false,
    }));
  }

  setSubmitError(error: Error) {
    this.#state.update((state) => ({
      ...state,
      isLoading: false,
      error,
    }));
  }

  // async actions
  rxGetBlogs(filter?: {
    searchString?: string;
    page?: number;
    pageSize?: number;
  }): Observable<BlogEntryOverviewResponse> {
    const searchString$ = new BehaviorSubject<string>(
      filter?.searchString || '',
    );

    return searchString$.pipe(
      debounceTime(200),
      tap(() => this.setLoadingState()),
      switchMap(() =>
        this.#BlogbackendService
          .getBlogEntryOverview(
            filter?.page || 0,
            filter?.pageSize || 10,
            filter?.searchString,
          )
          .pipe(
            tap((blogs) => this.setLoadedBlogs(blogs.data)),
            catchError((error) => {
              this.setError(error);
              throw error;
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
