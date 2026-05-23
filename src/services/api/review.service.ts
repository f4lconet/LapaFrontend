import { apiClient } from "./client";
import type {
  Review,
  ReviewListResponse,
  ReviewStats,
  DetailedStats,
  CreateReviewRequest,
  UpdateReviewRequest,
  TopVolunteer,
} from "../../models/user.model";

export const reviewService = {
  // Создать отзыв на волонтёра
  async createReview(data: CreateReviewRequest): Promise<Review> {
    const response = await apiClient.post("/reviews", {
      comment: data.comment,
      rating: data.rating,
      task_id: data.task_id,
      volunteer_id: data.volunteer_id,
    });
    return response.data;
  },

  // Получить все отзывы о волонтёре
  async getVolunteerReviews(
    volunteerId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<ReviewListResponse> {
    const response = await apiClient.get(`/reviews/volunteer/${volunteerId}`, {
      params: { limit, offset },
    });
    return response.data;
  },

  // Получить базовую статистику волонтёра
  async getVolunteerStats(volunteerId: string): Promise<ReviewStats> {
    const response = await apiClient.get(
      `/reviews/volunteer/${volunteerId}/stats`
    );
    return response.data;
  },

  // Получить детальную статистику волонтёра
  async getVolunteerDetailedStats(volunteerId: string): Promise<DetailedStats> {
    const response = await apiClient.get(
      `/reviews/volunteer/${volunteerId}/detailed-stats`
    );
    return response.data;
  },

  // Получить отзывы о текущем волонтёре
  async getMyReviews(
    limit: number = 20,
    offset: number = 0
  ): Promise<ReviewListResponse> {
    const response = await apiClient.get("/reviews/me", {
      params: { limit, offset },
    });
    return response.data;
  },

  // Получить статистику текущего волонтёра
  async getMyStats(): Promise<ReviewStats> {
    const response = await apiClient.get("/reviews/me/stats");
    return response.data;
  },

  // Получить детальную статистику текущего волонтёра
  async getMyDetailedStats(): Promise<DetailedStats> {
    const response = await apiClient.get("/reviews/me/detailed-stats");
    return response.data;
  },

  // Получить топ волонтёров по рейтингу
  async getTopVolunteers(limit: number = 10): Promise<TopVolunteer[]> {
    const response = await apiClient.get("/reviews/top-volunteers", {
      params: { limit },
    });
    return response.data;
  },

  // Получить отзыв по ID
  async getReviewById(reviewId: string): Promise<Review> {
    const response = await apiClient.get(`/reviews/${reviewId}`);
    return response.data;
  },

  // Обновить отзыв (только admin)
  async updateReview(
    reviewId: string,
    data: UpdateReviewRequest
  ): Promise<Review> {
    const response = await apiClient.put(`/reviews/${reviewId}`, {
      comment: data.comment,
      rating: data.rating,
    });
    return response.data;
  },

  // Удалить отзыв (только admin)
  async deleteReview(reviewId: string): Promise<string> {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};