import { useCallback } from 'react';
import { useKnowledgeStore } from '../services/stores/useKnowledgeStore';
import type { CreateArticleDto, UpdateArticleDto, FilterOptions } from '../models/knowledge.model';

export const useKnowledgePresenter = () => {
  const {
    articles,
    featuredArticle, 
    total,                
    loading,              
    error,
    categories,
    tags,
    filters,
    setFilters,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    uploadImage,
    createCategory,
    toggleFilterModal,
    clearError,
  } = useKnowledgeStore();

  // fetchArticles принимает фильтры, а не отдельные параметры
  const handleFetchArticles = useCallback(async (filterParams?: Partial<FilterOptions>) => {
    if (filterParams) {
      setFilters(filterParams);
    } else {
      await fetchArticles();
    }
  }, [fetchArticles, setFilters]);

  // Получение статьи по ID (если нет в store, берём из массива)
  const handleGetArticleById = useCallback((articleId: string) => {
    return articles.find(a => a.id === articleId) || null;
  }, [articles]);

  // Создание статьи
  const handleCreateArticle = useCallback(async (data: CreateArticleDto) => {
    await createArticle(data);
  }, [createArticle]);

  // Обновление статьи
  const handleUpdateArticle = useCallback(async (articleId: string, data: UpdateArticleDto) => {
    await updateArticle(articleId, data);
  }, [updateArticle]);

  // Удаление статьи
  const handleDeleteArticle = useCallback(async (articleId: string) => {
    await deleteArticle(articleId);
  }, [deleteArticle]);

  // Поиск статей (через фильтры)
  const handleSearchArticles = useCallback(async (query: string) => {
    setFilters({ search: query, offset: 0 });
    // fetchArticles вызовется автоматически в setFilters
  }, [setFilters]);

  // Загрузка следующей страницы
  const handleLoadMoreArticles = useCallback(async () => {
    const newOffset = (filters.offset || 0) + (filters.limit || 10);
    setFilters({ offset: newOffset });
  }, [filters, setFilters]);

  return {
    articles,
    featuredArticle,
    currentArticle: featuredArticle, // для обратной совместимости
    isLoading: loading,
    error,
    totalArticles: total,
    categories,
    tags,
    filters,
    fetchArticles: handleFetchArticles,
    fetchArticleById: handleGetArticleById,
    createArticle: handleCreateArticle,
    updateArticle: handleUpdateArticle,
    deleteArticle: handleDeleteArticle,
    searchArticles: handleSearchArticles,
    loadMoreArticles: handleLoadMoreArticles,
    uploadImage,
    createCategory,
    toggleFilterModal,
    clearError,
  };
};