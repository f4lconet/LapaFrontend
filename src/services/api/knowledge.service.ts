import { apiClient } from './client';
import type {
  Article,
  ArticlesResponse,
  CreateArticleDto,
  UpdateArticleDto,
  FilterOptions,
  ImageUploadResponse,
  Category,
  Tag
} from '../../models/knowledge.model';

class KnowledgeService {
  private readonly baseUrl = '/articles';

  async getArticles(filters: FilterOptions): Promise<ArticlesResponse> {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.tag_id) params.append('tag_id', filters.tag_id);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const response = await apiClient.get<ArticlesResponse>(`${this.baseUrl}?${params.toString()}`);
    return response.data;
  }

  async getArticleById(id: string): Promise<Article> {
    const response = await apiClient.get<Article>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createArticle(data: CreateArticleDto): Promise<Article> {
    const response = await apiClient.post<Article>(this.baseUrl, data);
    return response.data;
  }

  async updateArticle(id: string, data: UpdateArticleDto): Promise<Article> {
    const response = await apiClient.put<Article>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteArticle(id: string): Promise<string> {
    const response = await apiClient.delete<string>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<ImageUploadResponse>(`${this.baseUrl}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url;
  }

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(`${this.baseUrl}/categories`);
    return response.data;
  }

  async createCategory(name: string): Promise<Category> {
    const response = await apiClient.post<Category>(`${this.baseUrl}/categories`, { name });
    return response.data;
  }

  async getTags(): Promise<Tag[]> {
    const response = await apiClient.get<Tag[]>(`${this.baseUrl}/tags`);
    return response.data;
  }
}

export default new KnowledgeService();