import { create } from 'zustand';
import knowledgeService from '../api/knowledge.service';
import type { Article, FilterOptions, Category, Tag } from '../../models/knowledge.model';

interface KnowledgeState {
  articles: Article[];
  featuredArticle: Article | null;
  total: number;
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  categories: Category[];
  tags: Tag[];
  isFilterModalOpen: boolean;
  
  // Actions
  setFilters: (filters: FilterOptions) => void;
  fetchArticles: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;
  createArticle: (data: any) => Promise<void>;
  updateArticle: (id: string, data: any) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  createCategory: (name: string) => Promise<void>;
  toggleFilterModal: () => void;
  clearError: () => void;
}

export const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
  articles: [],
  featuredArticle: null,
  total: 0,
  loading: false,
  error: null,
  filters: {
    limit: 10,
    offset: 0
  },
  categories: [],
  tags: [],
  isFilterModalOpen: false,

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters, offset: 0 } });
    get().fetchArticles();
  },

  fetchArticles: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const response = await knowledgeService.getArticles(filters);
      set({ 
        articles: response.items, 
        total: response.total,
        featuredArticle: response.items[0] || null,
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Ошибка загрузки статей', loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await knowledgeService.getCategories();
      set({ categories });
    } catch (error: any) {
      set({ error: error.message || 'Ошибка загрузки категорий' });
    }
  },

  fetchTags: async () => {
    try {
      const tags = await knowledgeService.getTags();
      set({ tags });
    } catch (error: any) {
      set({ error: error.message || 'Ошибка загрузки тегов' });
    }
  },

  createArticle: async (data) => {
    set({ loading: true, error: null });
    try {
      const newArticle = await knowledgeService.createArticle(data);
      set((state) => ({ 
        articles: [newArticle, ...state.articles],
        total: state.total + 1,
        loading: false 
      }));
    } catch (error: any) {
      set({ error: error.message || 'Ошибка создания статьи', loading: false });
      throw error;
    }
  },

  updateArticle: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedArticle = await knowledgeService.updateArticle(id, data);
      set((state) => ({
        articles: state.articles.map(article => 
          article.id === id ? updatedArticle : article
        ),
        featuredArticle: state.featuredArticle?.id === id ? updatedArticle : state.featuredArticle,
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Ошибка обновления статьи', loading: false });
      throw error;
    }
  },

  deleteArticle: async (id) => {
    set({ loading: true, error: null });
    try {
      await knowledgeService.deleteArticle(id);
      set((state) => ({
        articles: state.articles.filter(article => article.id !== id),
        featuredArticle: state.featuredArticle?.id === id ? null : state.featuredArticle,
        total: state.total - 1,
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Ошибка удаления статьи', loading: false });
      throw error;
    }
  },

  uploadImage: async (file) => {
    try {
      const url = await knowledgeService.uploadImage(file);
      return url;
    } catch (error: any) {
      set({ error: error.message || 'Ошибка загрузки изображения' });
      throw error;
    }
  },

  createCategory: async (name) => {
    set({ loading: true, error: null });
    try {
      const newCategory = await knowledgeService.createCategory(name);
      set((state) => ({
        categories: [...state.categories, newCategory],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Ошибка создания категории', loading: false });
      throw error;
    }
  },

  toggleFilterModal: () => {
    set((state) => ({ isFilterModalOpen: !state.isFilterModalOpen }));
  },

  clearError: () => {
    set({ error: null });
  }
}));