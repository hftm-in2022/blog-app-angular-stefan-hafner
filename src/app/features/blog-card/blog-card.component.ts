import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BlogEntryOverview } from '../../interfaces/blog-entry-overview';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss',
})
export class BlogCardComponent implements OnInit {
  @Input() blogEntryOverview!: BlogEntryOverview;
  @Input() cardIndex?: number;

  ngOnInit() {
    console.log('BlogCardComponent initialized');
  }

  onLikeClicked() {
    this.blogEntryOverview.likedByMe = true;
    this.blogEntryOverview.likes++;
  }

  onUnlikeClicked() {
    this.blogEntryOverview.likedByMe = false;
    this.blogEntryOverview.likes--;
  }

  onSaveClicked(newTitle: string) {
    this.blogEntryOverview.title = newTitle;
  }
}
