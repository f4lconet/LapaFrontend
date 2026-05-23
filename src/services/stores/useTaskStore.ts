import { create } from 'zustand';
import { taskService } from '../api/task.service';
import type { Task, TaskListResponse, CreateTaskRequest, UpdateTaskRequest } from '../../models/task.model';

interface TaskStore {
  // State
  tasks: Task[];
  recommendedTasks: Task[];
  archivedTasks: Task[]; // Для архива выполненных задач
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  totalTasks: number;
  totalRecommended: number;
  totalArchived: number;
  currentOffset: number;
  recommendedOffset: number;
  archivedOffset: number;

  // Actions
  fetchTasks: (limit?: number, offset?: number) => Promise<void>;
  fetchRecommendedTasks: (limit?: number, offset?: number) => Promise<void>;
  fetchArchivedTasks: (userId: string, role: string, limit?: number, offset?: number) => Promise<void>;
  fetchTaskById: (taskId: string) => Promise<void>;
  createTask: (data: CreateTaskRequest) => Promise<void>;
  updateTask: (taskId: string, data: UpdateTaskRequest) => Promise<void>;
  takeTask: (taskId: string) => Promise<void>;
  cancelTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  loadMoreTasks: () => Promise<void>;
  loadMoreRecommended: () => Promise<void>;
  loadMoreArchived: (userId: string, role: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const TASKS_PER_PAGE = 20;

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  recommendedTasks: [],
  archivedTasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  totalTasks: 0,
  totalRecommended: 0,
  totalArchived: 0,
  currentOffset: 0,
  recommendedOffset: 0,
  archivedOffset: 0,

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

  // Загрузка архивных задач (выполненных)
  fetchArchivedTasks: async (userId: string, role: string, limit = TASKS_PER_PAGE, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      let response: TaskListResponse;
      
      if (role === 'volunteer') {
        // Для волонтёра - получаем его выполненные задачи
        response = await taskService.getMyVolunteerCompletedTasks(limit, offset);
      } else if (role === 'curator' || role === 'organization') {
        // Для куратора/организации - получаем выполненные задачи создателя
        response = await taskService.getCreatorCompletedTasks(userId, limit, offset);
      } else {
        // Fallback - загружаем все и фильтруем
        response = await taskService.getAllTasks(limit, offset);
        response.items = response.items.filter(
          t => t.status === 'completed' || t.status === 'cancelled'
        );
      }
      
      set({
        archivedTasks: offset === 0 
          ? response.items 
          : [...get().archivedTasks, ...response.items],
        totalArchived: response.total,
        archivedOffset: offset + limit,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Ошибка загрузки архива задач',
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
      // Update task status в зависимости от роли
      const tasks = get().tasks.map((t) =>
        t.id === taskId 
          ? { ...t, status: 'in_pending' as const, assignee_id: undefined, assignee_name: undefined } 
          : t
      );
      set({ tasks, isLoading: false });
      // Перезагружаем задачи
      await get().fetchTasks(TASKS_PER_PAGE, 0);
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
      // Перезагружаем задачи
      await get().fetchTasks(TASKS_PER_PAGE, 0);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Ошибка при завершении задачи',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTask: async (taskId: string) => {
    set({ isLoading: true, error: null });
    try {
      await taskService.deleteTask(taskId);
      // Удаляем задачу из всех списков
      set({
        tasks: get().tasks.filter((t) => t.id !== taskId),
        recommendedTasks: get().recommendedTasks.filter((t) => t.id !== taskId),
        archivedTasks: get().archivedTasks.filter((t) => t.id !== taskId),
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Ошибка при удалении задачи',
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

  loadMoreArchived: async (userId: string, role: string) => {
    const { archivedOffset } = get();
    await get().fetchArchivedTasks(userId, role, TASKS_PER_PAGE, archivedOffset);
  },

  clearError: () => set({ error: null }),
  reset: () => set({
    tasks: [],
    recommendedTasks: [],
    archivedTasks: [],
    currentTask: null,
    isLoading: false,
    error: null,
    totalTasks: 0,
    totalRecommended: 0,
    totalArchived: 0,
    currentOffset: 0,
    recommendedOffset: 0,
    archivedOffset: 0,
  }),
}));