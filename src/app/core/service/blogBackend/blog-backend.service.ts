import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { delay, map, Observable } from 'rxjs';

import {
  BlogEntryOverview,
  BlogEntryOverviewResponse,
} from '../../model/blog-entry';
import { environment } from '../../../../environments/environment';
import { BlogEntry } from '../../model/blog-entry';

@Injectable({
  providedIn: 'root',
})
export class BlogBackendService {
  constructor(private http: HttpClient) {}

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
        delay(Math.floor(Math.random() * 1000)), // Verzögerung zwischen 0 und 1000 ms
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
      .pipe(
        delay(Math.floor(Math.random() * 1000)), // Verzögerung zwischen 0 und 1000 ms);
      );
  }

  likeBlogEntry(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log('Liking blog entry...');

    return this.http.put<void>(
      `${environment.backendUrl}/entries/${id}/like-info`,
      { likedByMe: true }, // JSON body
      { headers },
    );
  }

  unlikeBlogEntry(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log('Unliking blog entry...');

    return this.http.put<void>(
      `${environment.backendUrl}/entries/${id}/like-info`,
      { likedByMe: false }, // JSON body
      { headers },
    );
  }
}
