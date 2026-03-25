export interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  publishedAt: string;
  genre: string;
  featured: boolean;
  isNew: boolean;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  date: string;
  category: string;
  thumbnail?: string;
}

export interface Author {
  id: string;
  name: string;
  photo: string;
  bio: string;
  books: string[];
}
