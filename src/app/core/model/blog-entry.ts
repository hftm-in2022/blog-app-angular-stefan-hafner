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
export interface BlogEntry extends BaseBlogEntry {
  content: string;
  comments: Comment[];
}

export interface BlogEntryOverview extends BaseBlogEntry {
  updatedAt: string;
  createdAt: string;
  contentPreview: string;
  comments: number;
}

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
