import { apiClient } from "./client";


// Заглушка
export const taskService = {
  // GET /tasks?volunteer_id=me&status=completed - предположим, так можно получить завершенные задачи волонтера
  async getCompletedTasksCount(): Promise<number> {
    // В реальности нужно будет правильно сформировать запрос к вашему API
    // Например: GET /tasks?volunteer_id=me&status=completed
    const response = await apiClient.get('/tasks', {
      params: { volunteer_id: 'me', status: 'completed' }
    });
    // Предположим, что response.data - это массив задач
    return response.data.length;
  }
};