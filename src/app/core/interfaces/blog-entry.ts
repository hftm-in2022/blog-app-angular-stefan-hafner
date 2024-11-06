export interface BlogEntry {
  id: number;
  title: string;
  content: string;
  comments: Comment[];
  author: string;
  likes: number;
  likedByMe: boolean;
  createdByMe: boolean;
  headerImageUrl: string;
}
