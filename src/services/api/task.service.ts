import { apiClient } from "./client";
import type { Task, TaskListResponse, CreateTaskRequest, UpdateTaskRequest } from "../../models/task.model";

export const taskService = {
  // GET /tasks - list all tasks with pagination
  async getAllTasks(limit: number = 20, offset: number = 0): Promise<TaskListResponse> {
    const response = await apiClient.get<TaskListResponse>('/tasks', {
      params: { limit, offset }
    });
    return response.data;
  },

  // GET /tasks/recommendations - get recommended tasks for volunteer
  async getRecommendedTasks(limit: number = 20, offset: number = 0): Promise<TaskListResponse> {
    const response = await apiClient.get<TaskListResponse>('/tasks/recommendations', {
      params: { limit, offset }
    });
    return response.data;
  },

  // GET /tasks/{task_id} - get task details
  async getTaskById(taskId: string): Promise<Task> {
    const response = await apiClient.get<Task>(`/tasks/${taskId}`);
    return response.data;
  },

  // POST /tasks - create task (curator/organization only)
  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', data);
    return response.data;
  },

  // PUT /tasks/{task_id} - update task (curator/organization only)
  async updateTask(taskId: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await apiClient.put<Task>(`/tasks/${taskId}`, data);
    return response.data;
  },

  // POST /tasks/{task_id}/take - take task (volunteer only)
  async takeTask(taskId: string): Promise<Task> {
    const response = await apiClient.post<Task>(`/tasks/${taskId}/take`);
    return response.data;
  },

  // POST /tasks/{task_id}/cancel - cancel task
  async cancelTask(taskId: string): Promise<Task> {
    const response = await apiClient.post<Task>(`/tasks/${taskId}/cancel`);
    return response.data;
  },

  // POST /tasks/{task_id}/complete - complete task
  async completeTask(taskId: string): Promise<Task> {
    const response = await apiClient.post<Task>(`/tasks/${taskId}/complete`);
    return response.data;
  },

  // GET /tasks - get completed tasks count (for volunteer stats)
  async getCompletedTasksCount(): Promise<number> {
    try {
      const response = await apiClient.get<TaskListResponse>('/tasks', {
        params: { status: 'completed', limit: 1, offset: 0 }
      });
      return response.data.total;
    } catch (error) {
      console.error('Error fetching completed tasks count:', error);
      return 0;
    }
  }
};
