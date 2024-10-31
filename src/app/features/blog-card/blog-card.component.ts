import { Component, Input, OnInit } from '@angular/core';
import { BlogEntryOverview } from '../../interfaces/blog-entry-overview';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [DatePipe],
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
