import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BlogBackendService } from './blog-backend.service';
import { environment } from '../../../../environments/environment';
import { BlogEntryOverviewResponse } from '../../interfaces/blog-entry-overview';

describe('BlogBackendService', () => {
  let service: BlogBackendService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BlogBackendService],
    });
    service = TestBed.inject(BlogBackendService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch blog entries successfully', () => {
    const mockResponse: BlogEntryOverviewResponse = {
      data: [
        {
          id: 1,
          title: 'Test Blog 1',
          updatedAt: '',
          createdAt: '',
          contentPreview: '',
          author: '',
          likes: 0,
          comments: 0,
          likedByMe: false,
          createdByMe: false,
          headerImageUrl: '',
        },
        {
          id: 2,
          title: 'Test Blog 2',
          updatedAt: '',
          createdAt: '',
          contentPreview: '',
          author: '',
          likes: 0,
          comments: 0,
          likedByMe: false,
          createdByMe: false,
          headerImageUrl: '',
        },
      ],
      pageIndex: 0,
      pageSize: 0,
      totalCount: 0,
      maxPageSize: 0,
    };

    service.getBlogEntryOverview().subscribe((entries) => {
      expect(entries.length).toBe(2);
      expect(entries).toEqual(mockResponse.data);
    });

    const req = httpMock.expectOne(
      `${environment.backendUrl}/entries?page=1&pageSize=10`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error when fetching blog entries', () => {
    service.getBlogEntryOverview().subscribe((entries) => {
      expect(entries.length).toBe(0);
    });

    const req = httpMock.expectOne(
      `${environment.backendUrl}/entries?page=1&pageSize=10`,
    );
    expect(req.request.method).toBe('GET');
    req.flush('Error fetching blog entries', {
      status: 500,
      statusText: 'Server Error',
    });
  });
});
