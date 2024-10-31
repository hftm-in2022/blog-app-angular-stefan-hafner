export interface BlogEntryOverview {
  id: number;
  updatedAt: string;
  createdAt: string;
  title: string;
  contentPreview: string;
  author: string;
  likes: number;
  comments: number;
  likedByMe: boolean;
  createdByMe: boolean;
  headerImageUrl: string;
}
