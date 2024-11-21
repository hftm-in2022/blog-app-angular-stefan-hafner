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
