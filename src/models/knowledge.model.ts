export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  cover_image: string | null;
  pub_time: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  categories: Category[];
  tags: Tag[];
}

export interface CreateArticleDto {
  title: string;
  content: string;
  cover_image?: string;
  category_ids: string[];
  tag_ids: string[];
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
  cover_image?: string;
  category_ids?: string[];
  tag_ids?: string[];
}

export interface ArticlesResponse {
  items: Article[];
  total: number;
}

export interface ImageUploadResponse {
  url: string;
}

export interface FilterOptions {
  search?: string;
  category_id?: string;
  tag_id?: string;
  limit?: number;
  offset?: number;
}