export type TaskStatus = 'in_pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export interface RequiredSkill {
  skill_id: string;
  skill_name: string;
}

export interface Task {
  id: string;
  animal_id: string;
  animal_name: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  due_time: string;
  creator_id: string;
  assignee_id?: string;
  assignee_name?: string;
  assigned_at?: string;
  status: TaskStatus;
  is_urgent: boolean;
  location_text: string;
  location_lat: number;
  location_lng: number;
  required_skills: RequiredSkill[];
}

export interface TaskListResponse {
  items: Task[];
  total: number;
}

export interface CreateTaskRequest {
  animal_id: string;
  title: string;
  description: string;
  due_time: string;
  is_urgent: boolean;
  skill_ids: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  due_time?: string;
  is_urgent?: boolean;
  skill_ids?: string[];
  status?: TaskStatus;
}

export interface TaskFilters {
  isUrgent?: boolean;
  animalTypeId?: number;
  skillIds?: string[];
  createdBy?: string;
}
