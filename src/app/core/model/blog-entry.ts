import { Comment } from './comment';

export interface BaseBlogEntry {
  id: number;
  title: string;
  author: string;
  likes: number;
  likedByMe: boolean;
  createdByMe: boolean;
  headerImageUrl: string;
}
export type BlogEntry = BaseBlogEntry & {
  content: string;
  comments: Comment[];
};

export type BlogEntryOverview = BaseBlogEntry & {
  updatedAt: string;
  createdAt: string;
  contentPreview: string;
  comments: number;
};

export type BlogEntryType = BlogEntry | BlogEntryOverview;

export interface BlogEntryOverviewResponse {
  data: BlogEntryOverview[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  maxPageSize: number;
}

export interface NewBlogEntry {
  title: string;
  content: string;
  headerImageUrl: string;
}

export interface LikeInfo {
  likedByMe: boolean;
}
