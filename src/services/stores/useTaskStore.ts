import { create } from 'zustand';
import { taskService } from '../api/task.service';
import type { Task, TaskListResponse, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '../../models/task.model';

interface TaskStore {
  // State
  tasks: Task[];
  recommendedTasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  totalTasks: number;
  totalRecommended: number;
  currentOffset: number;
  recommendedOffset: number;

  // Actions
  fetchTasks: (limit?: number, offset?: number) => Promise<void>;
  fetchRecommendedTasks: (limit?: number, offset?: number) => Promise<void>;
  fetchTaskById: (taskId: string) => Promise<void>;
  createTask: (data: CreateTaskRequest) => Promise<void>;
  updateTask: (taskId: string, data: UpdateTaskRequest) => Promise<void>;
  takeTask: (taskId: string) => Promise<void>;
  cancelTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  loadMoreTasks: () => Promise<void>;
  loadMoreRecommended: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const TASKS_PER_PAGE = 20;

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  recommendedTasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  totalTasks: 0,
  totalRecommended: 0,
  currentOffset: 0,
  recommendedOffset: 0,

  fetchTasks: async (limit = TASKS_PER_PAGE, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.getAllTasks(limit, offset);
      set({
        tasks: offset === 0 ? response.items : [...get().tasks, ...response.items],
        totalTasks: response.total,
        currentOffset: offset + limit,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Ошибка загрузки задач',
        isLoading: false,
      });
    }
  },

  fetchRecommendedTasks: async (limit = TASKS_PER_PAGE, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.getRecommendedTasks(limit, offset);
      set({
        recommendedTasks:
          offset === 0 ? response.items : [...get().recommendedTasks, ...response.items],
        totalRecommended: response.total,
        recommendedOffset: offset + limit,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Ошибка загрузки рекомендаций',
        isLoading: false,
      });
    }
  },

  fetchTaskById: async (taskId: string) => {
    set({ isLoading: true, error: null });
    try {
      const task = await taskService.getTaskById(taskId);
      set({ currentTask: task, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Ошибка загрузки задачи',
        isLoading: false,
      });
    }
  },

  createTask: async (data: CreateTaskRequest) => {
    set({ isLoading: true, error: null });
    try {
      await taskService.createTask(data);
      // Reload tasks
      await get().fetchTasks(TASKS_PER_PAGE, 0);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Ошибка создания задачи',
        isLoading: false,
      });
      throw error;
    }
  },

  updateTask: async (taskId: string, data: UpdateTaskRequest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await taskService.updateTask(taskId, data);
      // Update in tasks list
      const tasks = get().tasks.map((t) => (t.id === taskId ? updatedTask : t));
      set({ tasks, currentTask: updatedTask, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Ошибка обновления задачи',
        isLoading: false,
      });
      throw error;
    }
  },

  takeTask: async (taskId: string) => {
    set({ isLoading: true, error: null });
    try {
      await taskService.takeTask(taskId);
      // Remove from tasks/recommended and reload
      set({
        tasks: get().tasks.filter((t) => t.id !== taskId),
        recommendedTasks: get().recommendedTasks.filter((t) => t.id !== taskId),
      });
      await get().fetchTasks(TASKS_PER_PAGE, 0);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Ошибка при взятии задачи',
        isLoading: false,
      });
      throw error;
    }
  },

  cancelTask: async (taskId: string) => {
    set({ isLoading: true, error: null });
    try {
      await taskService.cancelTask(taskId);
      // Update task status
      const tasks = get().tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'in_pending' as const } : t
      );
      set({ tasks, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Ошибка при отмене задачи',
        isLoading: false,
      });
      throw error;
    }
  },

  completeTask: async (taskId: string) => {
    set({ isLoading: true, error: null });
    try {
      await taskService.completeTask(taskId);
      // Remove from active tasks
      set({
        tasks: get().tasks.filter((t) => t.id !== taskId),
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Ошибка при завершении задачи',
        isLoading: false,
      });
      throw error;
    }
  },

  loadMoreTasks: async () => {
    const { currentOffset } = get();
    await get().fetchTasks(TASKS_PER_PAGE, currentOffset);
  },

  loadMoreRecommended: async () => {
    const { recommendedOffset } = get();
    await get().fetchRecommendedTasks(TASKS_PER_PAGE, recommendedOffset);
  },

  clearError: () => set({ error: null }),
  reset: () => set({
    tasks: [],
    recommendedTasks: [],
    currentTask: null,
    isLoading: false,
    error: null,
    totalTasks: 0,
    totalRecommended: 0,
    currentOffset: 0,
    recommendedOffset: 0,
  }),
}));
