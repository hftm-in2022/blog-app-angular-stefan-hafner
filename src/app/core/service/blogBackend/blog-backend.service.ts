import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  BlogEntryOverviewResponse,
  NewBlogEntry,
} from '../../model/blog-entry';
import { environment } from '../../../../environments/environment';
import { BlogEntry } from '../../model/blog-entry';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BlogBackendService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getBlogEntryOverview(
    page = 0,
    pageSize = 10,
    searchString?: string,
  ): Observable<BlogEntryOverviewResponse> {
    let params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageIndex', page.toString());

    if (searchString) {
      params = params.set('searchstring', searchString);
    }
    console.log('Fetching blog entries with search string:', searchString);
    const debugUrl = `${environment.backendUrl}/entries?${params.toString()}`;
    console.log('Generated URL:', debugUrl);
    return this.http
      .get<BlogEntryOverviewResponse>(`${environment.backendUrl}/entries`, {
        params,
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        // delay(Math.floor(Math.random() * 1000)), // Zum Testen des Loading Spinners Verzögerung zwischen 0 und 1000 ms
        map((response) => ({
          data: response.data,
          pageIndex: response.pageIndex,
          pageSize: response.pageSize,
          totalCount: response.totalCount,
          maxPageSize: response.maxPageSize,
        })),
      );
  }

  getBlogDetail(id: number): Observable<BlogEntry> {
    console.log('Fetching blog detail...');
    return this.http
      .get<BlogEntry>(`${environment.backendUrl}/entries/${id}`, {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      })
      .pipe
      //delay(Math.floor(Math.random() * 1000)),  // Zum Testen des Loading Spinners Verzögerung zwischen 0 und 1000 ms
      ();
  }

  createBlogEntry(payload: NewBlogEntry): Observable<BlogEntry> {
    return this.http.post<BlogEntry>(
      `${environment.backendUrl}/entries`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  addComment(comment: string, blogId: number): Observable<void> {
    return this.http.post<void>(
      `${environment.backendUrl}/entries/${blogId}/comments`,
      { content: comment },
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  likeBlogEntry(id: number): Observable<void> {
    console.log('Liking blog entry...');

    return this.http.put<void>(
      `${environment.backendUrl}/entries/${id}/like-info`,
      { likedByMe: true }, // JSON body
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  unlikeBlogEntry(id: number): Observable<void> {
    console.log('Unliking blog entry...');

    return this.http.put<void>(
      `${environment.backendUrl}/entries/${id}/like-info`,
      { likedByMe: false }, // JSON body
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  deleteBlogEntry(blogId: number) {
    console.log('Deleting blog entry...');

    return this.http.delete<void>(
      `${environment.backendUrl}/entries/${blogId}`,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
