import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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

  getBlogEntryOverview(): Observable<BlogEntryOverview[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const params = new HttpParams().set('page', '1').set('pageSize', '10');

    return this.http
      .get<BlogEntryOverviewResponse>(`${environment.backendUrl}/entries`, {
        params,
        headers,
      })
      .pipe(map((response) => response.data));
  }

  getBlogDetail(id: number): Observable<BlogEntry> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log('Fetching blog detail...');
    return this.http.get<BlogEntry>(`${environment.backendUrl}/entries/${id}`, {
      headers,
    });
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
