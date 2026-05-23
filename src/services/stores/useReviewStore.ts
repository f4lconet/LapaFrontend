import { create } from "zustand";
import { reviewService } from "../api/review.service";
import type {
  Review,
  ReviewStats,
  DetailedStats,
  CreateReviewRequest,
  UpdateReviewRequest,
} from "../../models/user.model";

interface ReviewStore {
  // State
  reviews: Review[];
  stats: ReviewStats | null;
  detailedStats: DetailedStats | null;
  isLoading: boolean;
  error: string | null;
  totalReviews: number;
  currentOffset: number;

  // Actions
  fetchVolunteerReviews: (
    volunteerId: string,
    limit?: number,
    offset?: number
  ) => Promise<void>;
  fetchMyReviews: (limit?: number, offset?: number) => Promise<void>;
  fetchVolunteerStats: (volunteerId: string) => Promise<void>;
  fetchMyStats: () => Promise<void>;
  fetchVolunteerDetailedStats: (volunteerId: string) => Promise<void>;
  fetchMyDetailedStats: () => Promise<void>;
  createReview: (data: CreateReviewRequest) => Promise<void>;
  updateReview: (
    reviewId: string,
    data: UpdateReviewRequest
  ) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  loadMoreReviews: (volunteerId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const REVIEWS_PER_PAGE = 20;

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviews: [],
  stats: null,
  detailedStats: null,
  isLoading: false,
  error: null,
  totalReviews: 0,
  currentOffset: 0,

  fetchVolunteerReviews: async (
    volunteerId: string,
    limit = REVIEWS_PER_PAGE,
    offset = 0
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewService.getVolunteerReviews(
        volunteerId,
        limit,
        offset
      );
      set({
        reviews: offset === 0 ? response.items : [...get().reviews, ...response.items],
        totalReviews: response.total,
        currentOffset: offset + limit,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Ошибка загрузки отзывов",
        isLoading: false,
      });
    }
  },

  fetchMyReviews: async (limit = REVIEWS_PER_PAGE, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewService.getMyReviews(limit, offset);
      set({
        reviews: offset === 0 ? response.items : [...get().reviews, ...response.items],
        totalReviews: response.total,
        currentOffset: offset + limit,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Ошибка загрузки отзывов",
        isLoading: false,
      });
    }
  },

  fetchVolunteerStats: async (volunteerId: string) => {
    try {
      const stats = await reviewService.getVolunteerStats(volunteerId);
      set({ stats });
    } catch (error) {
      console.error("Error fetching volunteer stats:", error);
      set({ stats: null });
    }
  },

  fetchMyStats: async () => {
    try {
      const stats = await reviewService.getMyStats();
      set({ stats });
    } catch (error) {
      console.error("Error fetching my stats:", error);
      set({ stats: null });
    }
  },

  fetchVolunteerDetailedStats: async (volunteerId: string) => {
    try {
      const detailedStats = await reviewService.getVolunteerDetailedStats(
        volunteerId
      );
      set({ detailedStats });
    } catch (error) {
      console.error("Error fetching volunteer detailed stats:", error);
      set({ detailedStats: null });
    }
  },

  fetchMyDetailedStats: async () => {
    try {
      const detailedStats = await reviewService.getMyDetailedStats();
      set({ detailedStats });
    } catch (error) {
      console.error("Error fetching my detailed stats:", error);
      set({ detailedStats: null });
    }
  },

  createReview: async (data: CreateReviewRequest) => {
    set({ isLoading: true, error: null });
    try {
      await reviewService.createReview(data);
      // Reload reviews
      if (data.volunteer_id) {
        await get().fetchVolunteerReviews(data.volunteer_id);
        await get().fetchVolunteerStats(data.volunteer_id);
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Ошибка создания отзыва",
        isLoading: false,
      });
      throw error;
    }
  },

  updateReview: async (reviewId: string, data: UpdateReviewRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedReview = await reviewService.updateReview(reviewId, data);
      const reviews = get().reviews.map((r) =>
        r.id === reviewId ? updatedReview : r
      );
      set({ reviews, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Ошибка обновления отзыва",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteReview: async (reviewId: string) => {
    set({ isLoading: true, error: null });
    try {
      await reviewService.deleteReview(reviewId);
      set({
        reviews: get().reviews.filter((r) => r.id !== reviewId),
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Ошибка удаления отзыва",
        isLoading: false,
      });
      throw error;
    }
  },

  loadMoreReviews: async (volunteerId: string) => {
    const { currentOffset } = get();
    await get().fetchVolunteerReviews(volunteerId, REVIEWS_PER_PAGE, currentOffset);
  },

  clearError: () => set({ error: null }),
  reset: () =>
    set({
      reviews: [],
      stats: null,
      detailedStats: null,
      isLoading: false,
      error: null,
      totalReviews: 0,
      currentOffset: 0,
    }),
}));