import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  BlogCardComponent,
  BlogEntry,
  BlogEntryOverview,
} from './blog-card.component';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardTitle } from '@angular/material/card';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../core/service/auth/auth.service';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BlogCardComponent', () => {
  let component: BlogCardComponent;
  let fixture: ComponentFixture<BlogCardComponent>;
  let testBlogEntryOverview: BlogEntryOverview;
  let testBlogEntry: BlogEntry;
  const authServiceMock = {
    oidcSecurityService: {
      authenticated: signal<{ isAuthenticated: boolean }>({
        isAuthenticated: false,
      }),
    },
  };

  const activatedRouteMock = {
    snapshot: { paramMap: { get: () => '1' } },
    paramMap: of({ get: () => '1' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BlogCardComponent,
        DatePipe,
        NgClass,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardTitle,
        MatIcon,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogCardComponent);
    component = fixture.componentInstance;

    testBlogEntry = {
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

    testBlogEntryOverview = {
      id: 1,
      title: 'Test Blog',
      author: 'John Doe',
      likes: 10,
      likedByMe: true,
      createdByMe: false,
      headerImageUrl: 'assets/images/test.jpg',
      updatedAt: '2024-01-01',
      createdAt: '2024-01-01',
      contentPreview: 'This is a preview',
      comments: 5,
    } as BlogEntryOverview;
    fixture.componentRef.setInput('blog', testBlogEntryOverview);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly set isAuthenticated from AuthService signal', () => {
    const isAuthenticatedValue =
      authServiceMock.oidcSecurityService.authenticated();
    expect(isAuthenticatedValue.isAuthenticated).toBe(false);
  });

  it('BlogEntryOverview should not be recognised as BlogEntry', () => {
    expect(component.isBlogEntry(component.blog)).toBe(false);
  });

  it('BlogEntry should be recognised as BlogEntry', () => {
    fixture.componentRef.setInput('blog', testBlogEntry);
    fixture.detectChanges();
    expect(component.isBlogEntry(component.blog)).toBe(true);
  });

  it('should correctly set the blog content', () => {
    fixture.componentRef.setInput('blog', testBlogEntry);
    fixture.detectChanges();
    expect(component.blog).toEqual(testBlogEntry);
  });

  it('should correctly set the blog overview content', () => {
    expect(component.blog).toEqual(testBlogEntryOverview);
  });

  it('should correctly the methode commentCount', () => {
    const count = component.commentsCount();
    expect(count).toBe(5);
  });

  it('should emit onLikeClicked event with the correct blog entry', () => {
    spyOn(component.like, 'emit');
    component.onLikeClicked();
    expect(component.like.emit).toHaveBeenCalledWith(testBlogEntryOverview);
  });

  it('should emit unlike event with the correct blog entry', () => {
    spyOn(component.unlike, 'emit');
    component.onUnlikeClicked();
    expect(component.unlike.emit).toHaveBeenCalledWith(testBlogEntryOverview);
  });

  it('should emit addComment event with the correct comment content', () => {
    spyOn(component.addComment, 'emit');
    component.newCommentContent = 'This is a test comment';
    component.submitComment();
    expect(component.addComment.emit).toHaveBeenCalledWith(
      'This is a test comment',
    );
  });

  it('should emit navigateToDetails event with the correct blog id', () => {
    spyOn(component.navigateToDetails, 'emit');
    component.goToDetailsPage();
    expect(component.navigateToDetails.emit).toHaveBeenCalledWith(1);
  });

  it('should emit backButton event', () => {
    spyOn(component.backButton, 'emit');
    component.onBack();
    expect(component.backButton.emit).toHaveBeenCalled();
  });

  it('should emit deleteBlog event with the correct blog id', () => {
    spyOn(component.deleteBlog, 'emit');
    component.onDeleteBlog();
    expect(component.deleteBlog.emit).toHaveBeenCalledWith(1);
  });

  it('should render blog-card when blog is defined', () => {
    const cardElement = fixture.debugElement.query(
      By.css('[data-testid="blog-card"]'),
    );
    expect(cardElement).not.toBeNull();
  });

  it('testing all Attribute that on the HTML isOverview true or false', () => {
    const title = fixture.debugElement.query(By.css('[data-testid="title"]'));
    const author = fixture.debugElement.query(By.css('[data-testid="author"]'));
    const likes = fixture.debugElement.query(By.css('[data-testid="likes"]'));
    const comments = fixture.debugElement.query(
      By.css('[data-testid="comments"]'),
    );

    expect(title.nativeElement.textContent).toContain(
      testBlogEntryOverview.title,
    );
    expect(author.nativeElement.textContent).toContain(
      testBlogEntryOverview.author,
    );
    expect(likes.nativeElement.textContent).toContain(
      testBlogEntryOverview.likes,
    );
    expect(comments.nativeElement.textContent).toContain(
      testBlogEntryOverview.comments,
    );
  });

  // IS OVERVIEW IS FALSE
  it('create by me is true. sholud by a delete butten', () => {
    fixture.componentRef.setInput('isOverview', false);
    fixture.componentRef.setInput('blog', testBlogEntry);
    fixture.detectChanges();
    const clickableDeleteButton = fixture.debugElement.query(
      By.css('[data-testid="delete-button"]'),
    );
    expect(clickableDeleteButton).not.toBeNull();
    spyOn(component, 'onDeleteBlog');
    clickableDeleteButton.triggerEventHandler('click', null);
    expect(component.onDeleteBlog).toHaveBeenCalled();
  });
  // IS OVERVIEW IS TRUE

  it('isOverview is Ture> check Image', () => {
    fixture.componentRef.setInput('isOverview', true);
    fixture.detectChanges();
    const clickableImage = fixture.debugElement.query(
      By.css('[data-testid="clickable-image"]'),
    );
    expect(clickableImage).not.toBeNull();
    spyOn(component, 'goToDetailsPage');
    clickableImage.triggerEventHandler('click', null);
    expect(component.goToDetailsPage).toHaveBeenCalled();
  });

  it('isOverview is false and input is a BlogEntry> commentCard', () => {
    fixture.componentRef.setInput('isOverview', false);
    fixture.componentRef.setInput('blog', testBlogEntry);
    fixture.detectChanges();
    let commentCards = fixture.debugElement.queryAll(
      By.css('[data-testid="commentCards"]'),
    );
    expect(commentCards[0].nativeElement.textContent).toContain(
      testBlogEntry.comments[0].author,
    );
    expect(commentCards[0].nativeElement.textContent).toContain(
      testBlogEntry.comments[0].content,
    );
    expect(commentCards[1].nativeElement.textContent).toContain(
      testBlogEntry.comments[1].author,
    );
    expect(commentCards[1].nativeElement.textContent).toContain(
      testBlogEntry.comments[1].content,
    );
    fixture.componentRef.setInput('blog', {
      ...testBlogEntry,
      comments: [], // leeres Array
    });
    fixture.detectChanges();
    commentCards = fixture.debugElement.queryAll(
      By.css('[data-testid="commentCards"]'),
    );
    expect(commentCards.length).toBe(0);
  });

  it('can create a comment', () => {
    fixture.componentRef.setInput('isOverview', false);
    fixture.componentRef.setInput('blog', testBlogEntry);
    authServiceMock.oidcSecurityService.authenticated.set({
      isAuthenticated: true,
    });
    fixture.detectChanges();
    const isAuthenticatedValue =
      authServiceMock.oidcSecurityService.authenticated();
    expect(isAuthenticatedValue.isAuthenticated).toBe(true);
    const clickableSubmitCommentButton = fixture.debugElement.query(
      By.css('[data-testid="submit-comment"]'),
    );
    expect(clickableSubmitCommentButton).not.toBeNull();
    spyOn(component, 'submitComment');
    clickableSubmitCommentButton.triggerEventHandler('click', null);
    expect(component.submitComment).toHaveBeenCalled();
  });

  it('should emit back button event', () => {
    fixture.componentRef.setInput('isOverview', false);
    fixture.componentRef.setInput('blog', testBlogEntry);
    authServiceMock.oidcSecurityService.authenticated.set({
      isAuthenticated: true,
    });
    fixture.detectChanges();
    const clickableBackButton = fixture.debugElement.query(
      By.css('[data-testid="back-button"]'),
    );
    expect(clickableBackButton).not.toBeNull();
    spyOn(component, 'onBack');
    clickableBackButton.triggerEventHandler('click', null);
    expect(component.onBack).toHaveBeenCalledTimes(1);
    authServiceMock.oidcSecurityService.authenticated.set({
      isAuthenticated: false,
    });
    fixture.detectChanges();
    const clickableSubmitCommentButton = fixture.debugElement.query(
      By.css('[data-testid="submit-comment"]'),
    );
    expect(clickableSubmitCommentButton).toBeNull();
    const clickableBackButton2 = fixture.debugElement.query(
      By.css('[data-testid="back-button"]'),
    );
    expect(clickableBackButton2).not.toBeNull();
    clickableBackButton2.triggerEventHandler('click', null);
    expect(component.onBack).toHaveBeenCalledTimes(2);
  });
});
