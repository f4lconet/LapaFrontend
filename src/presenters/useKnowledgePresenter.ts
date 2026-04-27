import { useCallback } from 'react';
import { useKnowledgeStore } from '../services/stores/useKnowledgeStore';
import type { CreateKnowledgeRequest, UpdateKnowledgeRequest } from '../models/knowledge.model';

export const useKnowledgePresenter = () => {
  const {
    articles,
    currentArticle,
    isLoading,
    error,
    totalArticles,
    fetchArticles,
    fetchArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    searchArticles,
    loadMoreArticles,
    clearError,
  } = useKnowledgeStore();

  const handleFetchArticles = useCallback(async (limit?: number, offset?: number) => {
    await fetchArticles(limit, offset);
  }, [fetchArticles]);

  const handleFetchArticleById = useCallback(async (articleId: string) => {
    await fetchArticleById(articleId);
  }, [fetchArticleById]);

  const handleCreateArticle = useCallback(async (data: CreateKnowledgeRequest) => {
    await createArticle(data);
  }, [createArticle]);

  const handleUpdateArticle = useCallback(async (articleId: string, data: UpdateKnowledgeRequest) => {
    await updateArticle(articleId, data);
  }, [updateArticle]);

  const handleDeleteArticle = useCallback(async (articleId: string) => {
    await deleteArticle(articleId);
  }, [deleteArticle]);

  const handleSearchArticles = useCallback(async (query: string, limit?: number, offset?: number) => {
    await searchArticles(query, limit, offset);
  }, [searchArticles]);

  const handleLoadMoreArticles = useCallback(async () => {
    await loadMoreArticles();
  }, [loadMoreArticles]);

  return {
    articles,
    currentArticle,
    isLoading,
    error,
    totalArticles,
    fetchArticles: handleFetchArticles,
    fetchArticleById: handleFetchArticleById,
    createArticle: handleCreateArticle,
    updateArticle: handleUpdateArticle,
    deleteArticle: handleDeleteArticle,
    searchArticles: handleSearchArticles,
    loadMoreArticles: handleLoadMoreArticles,
    clearError,
  };
};