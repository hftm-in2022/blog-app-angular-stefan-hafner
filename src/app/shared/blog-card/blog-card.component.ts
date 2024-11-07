import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

export interface BlogEntryOverview {
  id: number;
  title: string;
  updatedAt: string;
  createdAt: string;
  contentPreview: string;
  author: string;
  likes: number;
  comments: number;
  likedByMe: boolean;
  createdByMe: boolean;
  headerImageUrl: string;
}

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss',
})
export class BlogCardComponent implements OnInit {
  @Input({ required: true }) blogEntryOverview!: BlogEntryOverview;
  @Input({ required: true }) cardIndex?: number;

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('BlogCardComponent initialized index: ' + this.cardIndex);
  }

  onLikeClicked() {
    this.blogEntryOverview.likedByMe = true;
    this.blogEntryOverview.likes++;
  }

  onUnlikeClicked() {
    this.blogEntryOverview.likedByMe = false;
    this.blogEntryOverview.likes--;
  }

  goToDeatilsPage() {
    const blogId = this.blogEntryOverview.id; // Get the blog ID
    this.router.navigate(['/blog-detail', blogId]); // Navigate to the blog-detail route
  }
}
