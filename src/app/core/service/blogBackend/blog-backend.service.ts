import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';

import {
  BlogEntryOverview,
  BlogEntryOverviewResponse,
} from '../../interfaces/blog-entry-overview';
import { environment } from '../../../../environments/environment';
import { BlogEntry } from '../../interfaces/blog-entry';

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

    console.log('Fetching blog entries...');
    return this.http
      .get<BlogEntryOverviewResponse>(`${environment.backendUrl}/entries`, {
        params,
        headers,
      })
      .pipe(
        map((response) => response.data),
        tap((data) => console.log('Received data:', data)),
        catchError((error) => {
          console.error('Error fetching blog entries:', error);
          return of([]); // Fallback auf leeres Array bei Fehler
        }),
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
        tap((data) => console.log('Received data:', data)),
        catchError((error) => {
          console.error('Error fetching blog detail:', error);
          return of({} as BlogEntry);
        }),
      );
  }
}
