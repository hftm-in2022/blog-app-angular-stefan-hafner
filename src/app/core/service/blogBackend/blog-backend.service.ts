import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  BlogEntryOverview,
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

  getBlogEntryOverview(searchString?: string): Observable<BlogEntryOverview[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let params = new HttpParams().set('page', '1').set('pageSize', '10');

    if (searchString) {
      params = params.set('searchstring', searchString);
    }
    console.log('Fetching blog entries with search string:', searchString);
    const debugUrl = `${environment.backendUrl}/entries?${params.toString()}`;
    console.log('Generated URL:', debugUrl);
    return this.http
      .get<BlogEntryOverviewResponse>(`${environment.backendUrl}/entries`, {
        params,
        headers,
      })
      .pipe(
        // delay(Math.floor(Math.random() * 1000)), // Zum Testen des Loading Spinners Verzögerung zwischen 0 und 1000 ms
        map((response) => response.data),
      );
  }

  getBlogDetail(id: number): Observable<BlogEntry> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log('Fetching blog detail...');
    return this.http
      .get<BlogEntry>(`${environment.backendUrl}/entries/${id}`, {
        headers,
      })
      .pipe
      //delay(Math.floor(Math.random() * 1000)),  // Zum Testen des Loading Spinners Verzögerung zwischen 0 und 1000 ms
      ();
  }
  /*
  createBlogEntry(formData: FormData): Observable<BlogEntry> {
    console.log('Creating new blog entry...');

    return this.http.post<BlogEntry>(
        `${environment.backendUrl}/entries`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${yourAuthToken}`,
          },
        }
    );
  }
*/
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
}
