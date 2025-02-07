import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogDetailPageComponent } from './blog-detail-page.component';
import { BlogEntry } from '../../core/model/blog-entry';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogBackendService } from '../../core/service/blogBackend/blog-backend.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../core/service/auth/auth.service';
import { Signal, signal } from '@angular/core';

const rootTestBlogEntry: BlogEntry = {
  id: 1,
  title: 'Test Blog',
  author: 'John Doe',
  likes: 10,
  likedByMe: false,
  createdByMe: true,
  headerImageUrl: 'assets/images/test.jpg',
  content: 'This is the content',
  comments: [
    {
      id: 99,
      content: 'This is a test comment',
      author: 'Jane Doe',
      updatedAt: '2024-02-02',
      createdAt: '2024-02-01',
    },
    {
      id: 98,
      content: 'This is a test comment',
      author: 'Jane Doe',
      updatedAt: '2024-02-02',
      createdAt: '2024-02-01',
    },
  ],
} as BlogEntry;

describe('BlogDetailPageComponent', () => {
  let component: BlogDetailPageComponent;
  let fixture: ComponentFixture<BlogDetailPageComponent>;
  let testBlogEntry: BlogEntry;
  let mockRouter: Partial<Router>;

  // Combined mock for BlogBackendService, embedding a reference to mockAuthService
  const mockBlogBackendService: Partial<BlogBackendService> = {
    // Mock for getBlogDetail

    getBlogDetail: jasmine.createSpy('getBlogDetail').and.callFake(() => {
      return of(component.route.snapshot.data['blog']);
    }),

    // Mock for createBlogEntry
    /* was never used
        createBlogEntry: jasmine.createSpy('createBlogEntry').and.callFake((newBlogEntry: BlogEntry) => {
            return of(rootTestBlogEntry);
        }),
        */

    addComment: jasmine
      .createSpy('addComment')
      .and.callFake((comment: string, blogId: number) => {
        // Check if the blog entry exists in the test setup
        if (
          component.route.snapshot.data['blog'] &&
          component.route.snapshot.data['blog'].id === blogId
        ) {
          // Add a new comment to the blog entry
          component.route.snapshot.data['blog'].comments.push({
            id: Math.floor(Math.random() * 1000), // Simulate an ID
            content: comment,
            author: 'Test User', // Simulate an author (could be dynamic)
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          });
        }

        return of(null); // Simulate API response
      }),
    // Mock for likeBlogEntry
    likeBlogEntry: jasmine
      .createSpy('likeBlogEntry')
      .and.callFake((id: number) => {
        // Check if the blog entry exists in the test setup
        if (
          component.route.snapshot.data['blog'] &&
          component.route.snapshot.data['blog'].id === id
        ) {
          // Update the likes counter
          component.route.snapshot.data['blog'].likes++;
          component.route.snapshot.data['blog'].likedByMe = true;
        }

        return of(null); // Simulate API response
      }),
    // Mock for unlikeBlogEntry
    unlikeBlogEntry: jasmine
      .createSpy('unlikeBlogEntry')
      .and.callFake((id: number) => {
        // Check if the blog entry exists in the test setup
        if (
          component.route.snapshot.data['blog'] &&
          component.route.snapshot.data['blog'].id === id
        ) {
          // Update the likes counter
          component.route.snapshot.data['blog'].likes--;
          component.route.snapshot.data['blog'].likedByMe = false;
        }

        return of(null); // Simulate API response
      }),
    // Mock for deleteBlogEntry
    deleteBlogEntry: jasmine
      .createSpy('deleteBlogEntry')
      .and.callFake((id: number) => {
        // Check if the blog entry exists in the test setup

        if (
          component.route.snapshot.data['blog'] &&
          component.route.snapshot.data['blog'].id == id
        ) {
          // Remove the blog entry from the test setup
          component.route.snapshot.data['blog'] = null;
        }

        return of(null); // Simulate API response
      }),
  };

  // Mock for AuthService
  const mockAuthService = {
    getToken: jasmine.createSpy('getToken').and.returnValue('fake-jwt-token'),
    oidcSecurityService: {
      authenticated: signal<{ isAuthenticated: boolean }>({
        isAuthenticated: false,
      }) as Signal<{ isAuthenticated: boolean }>,
    },
  };

  // Mock for Location
  const mockLocation = {
    back: jasmine.createSpy('back').and.callFake(() => {
      console.log('Location back called'); // Debugging
    }),
  };

  // Mock for Router
  mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        data: {},
        paramMap: { get: () => '1' },
      },
      paramMap: of({ get: () => '1' }), // Falls Observables genutzt werden
    };

    await TestBed.configureTestingModule({
      imports: [BlogDetailPageComponent, BrowserAnimationsModule],
      providers: [
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: BlogBackendService, useValue: mockBlogBackendService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Location, useValue: mockLocation },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogDetailPageComponent);
    component = fixture.componentInstance;

    testBlogEntry = rootTestBlogEntry;
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    component.route.snapshot.data['blog'] = { ...testBlogEntry };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load blogEntry and comments correctly and update the sidenav (ngOnInit)', () => {
    component.route.snapshot.data['blog'] = { ...testBlogEntry };
    component.ngOnInit();
    expect(component.blogEntry).toBeDefined();
    expect(component.blogEntry.id).toBe(testBlogEntry.id);
    expect(component.blogEntry).toEqual(testBlogEntry);
  });

  it('should handle like', () => {
    component.handleLike(testBlogEntry);
    expect(mockBlogBackendService.likeBlogEntry).toHaveBeenCalled();
    expect(component.blogEntry.likes).toBe(11);
  });

  it('should handle unlike', () => {
    component.handleUnlike(testBlogEntry);
    expect(mockBlogBackendService.unlikeBlogEntry).toHaveBeenCalled();
    expect(component.blogEntry.likes).toBe(9);
  });

  it('should handle add comment', () => {
    const comment = 'Test comment';
    component.handleAddComment(comment);
    expect(mockBlogBackendService.addComment).toHaveBeenCalled();
    expect(component.blogEntry.comments.length).toBe(3);
    expect(component.blogEntry.comments[2].author).toBe('Test User');
  });

  it('call back button', () => {
    spyOnProperty(window.history, 'length', 'get').and.returnValue(2);
    spyOn(component['location'], 'back').and.callThrough(); // Spy direkt auf die Instanz setzen
    component.handleBackButton();
    expect(component['location'].back).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should handle delete blog entry', () => {
    spyOn(component, 'handleBackButton');
    component.handleDelete(testBlogEntry.id);
    expect(mockBlogBackendService.deleteBlogEntry).toHaveBeenCalledWith(
      testBlogEntry.id,
    );
    expect(component.handleBackButton).toHaveBeenCalled();
    expect(component.route.snapshot.data['blog']).toBeNull();
  });
});
