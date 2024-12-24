import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { DatePipe, Location, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../../core/service/state.service';
import { AuthService } from '../../core/service/auth/auth.service';
import { MatIcon } from '@angular/material/icon';

export interface BaseBlogEntry {
  id: number;
  title: string;
  author: string;
  likes: number;
  likedByMe: boolean;
  createdByMe: boolean;
  headerImageUrl: string;
}

export type BlogEntryOverview = BaseBlogEntry & {
  updatedAt: string;
  createdAt: string;
  contentPreview: string;
  comments: number;
};

export type BlogEntry = BaseBlogEntry & {
  content: string;
  comments: Comment[];
};

export interface Comment {
  id: number;
  content: string;
  author: string;
  updatedAt: string;
  createdAt: string;
}

export interface NewComment {
  content: string;
}

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
  ],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCardComponent {
  //cardIndex = input<number>;
  //isOverview = input.required<boolean>();
  @Input({ required: true }) blog!: BlogEntryOverview | BlogEntry;
  @Input({ required: true }) isOverview = true;
  @Input() cardIndex?: number;
  @Output() like = new EventEmitter<BlogEntryOverview | BlogEntry>(); // Emit whole blog object for like
  @Output() unlike = new EventEmitter<BlogEntryOverview | BlogEntry>(); /// Emit whole blog object for unlike
  @Output() addComment = new EventEmitter<string>(); // Emit comment content
  @Output() navigateToDetails = new EventEmitter<number>(); // Emit navigation event
  @Output() backButton = new EventEmitter<void>(); // Emit back button event
  @Output() deleteBlog = new EventEmitter<number>();

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  location = inject(Location);
  stateService = inject(StateService);
  authService = inject(AuthService);
  isAuthenticated = this.authService.oidcSecurityService.authenticated;

  newCommentContent = '';

  // Type guard to check if blogEntry is of type BlogEntry
  isBlogEntry(entry: BlogEntryOverview | BlogEntry): entry is BlogEntry {
    return (entry as BlogEntry).content !== undefined;
  }

  commentsCount() {
    if (this.isBlogEntry(this.blog)) {
      return this.blog.comments.length;
    } else {
      return this.blog.comments;
    }
  }

  onLikeClicked() {
    this.like.emit(this.blog); // Trigger event instead of updating state
  }

  onUnlikeClicked() {
    this.unlike.emit(this.blog); // Trigger event instead of updating state
  }

  submitComment() {
    this.addComment.emit(this.newCommentContent); // Pass comment content to parent
    this.newCommentContent = ''; // Reset input field
  }

  goToDetailsPage() {
    this.navigateToDetails.emit(this.blog.id); // Emit the navigation event
  }

  onBack() {
    this.backButton.emit(); // Emit the back button event
  }

  onDeleteBlog() {
    this.deleteBlog.emit(this.blog.id);
  }
}
