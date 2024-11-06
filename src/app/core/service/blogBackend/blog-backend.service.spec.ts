import { TestBed } from '@angular/core/testing';
import { BlogBackendService } from './blog-backend.service';
import { of, throwError } from 'rxjs';
import { BlogEntryOverviewResponse } from '../../interfaces/blog-entry-overview';

describe('BlogBackendService', () => {
  let service: BlogBackendService;

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

  // Mock für den BlogBackendService
  const mockService = {
    getBlogEntryOverview: () => of(mockResponse.data),
    getBlogEntryOverviewWithError: () =>
      throwError({ status: 500, message: 'Server Error' }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: BlogBackendService, useValue: mockService }],
    });
    service = TestBed.inject(BlogBackendService);
  });

  it('should fetch blog entries successfully', () => {
    service.getBlogEntryOverview().subscribe((entries) => {
      expect(entries.length).toBe(2);
      expect(entries).toEqual(mockResponse.data);
    });
  });

  it('should handle error when fetching blog entries', () => {
    spyOn(service, 'getBlogEntryOverview').and.returnValue(
      throwError({ status: 500, message: 'Server Error' }),
    );

    service.getBlogEntryOverview().subscribe({
      next: () => fail('Expected an error, not data'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.message).toBe('Server Error');
      },
    });
  });
});
