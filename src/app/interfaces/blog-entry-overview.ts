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
