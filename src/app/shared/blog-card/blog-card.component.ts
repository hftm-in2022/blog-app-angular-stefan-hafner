import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export interface BaseBlogEntry {
  id: number;
  title: string;
  author: string;
  likes: number;
  likedByMe: boolean;
  createdByMe: boolean;
  headerImageUrl: string;
}

export interface BlogEntryOverview extends BaseBlogEntry {
  updatedAt: string;
  createdAt: string;
  contentPreview: string;
  comments: number;
}

export interface BlogEntry extends BaseBlogEntry {
  content: string;
  comments: Comment[];
}

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
  imports: [DatePipe, NgClass, ReactiveFormsModule, FormsModule],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss',
})
export class BlogCardComponent implements OnInit {
  @Input({ required: true }) blog!: BlogEntryOverview | BlogEntry;
  @Input({ required: true }) isOverview = true;
  @Input() cardIndex?: number;
  @Output() like = new EventEmitter<BlogEntryOverview | BlogEntry>(); // Emit whole blog object for like
  @Output() unlike = new EventEmitter<BlogEntryOverview | BlogEntry>(); /// Emit whole blog object for unlike
  @Output() addComment = new EventEmitter<string>(); // Emit comment content
  @Output() navigateToDetails = new EventEmitter<number>(); // Emit navigation event
  newCommentContent = '';

  ngOnInit() {
    console.log('BlogCardComponent initialized index: ' + this.cardIndex);
  }
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
}
