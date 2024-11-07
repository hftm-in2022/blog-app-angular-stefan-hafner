import { Component, OnInit } from '@angular/core';
import { BlogEntry } from '../../core/interfaces/blog-entry';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-detail-page',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './blog-detail-page.component.html',
  styleUrl: './blog-detail-page.component.scss',
})
export class BlogDetailPageComponent implements OnInit {
  blogEntry!: BlogEntry;
  newCommentContent = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Access to the data loaded by the resolver
    this.blogEntry = this.route.snapshot.data['blog'];
    this.blogEntry.comments = this.blogEntry.comments || [];
    console.log(this.blogEntry.comments);
  }

  addComment() {
    console.log('Adding comment');
  }

  onLikeClicked() {
    this.blogEntry.likedByMe = true;
    this.blogEntry.likes++;
  }

  onUnlikeClicked() {
    this.blogEntry.likedByMe = false;
    this.blogEntry.likes--;
  }
}
