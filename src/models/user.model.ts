export type UserRole = "user" | "volunteer" | "curator" | "organization"

export interface User {
    id: string
    email: string
    name: string
    description: string
    role: UserRole
    phone: string
    locationText: string
    locationLat: number
    locationLng: number
    radiusPref: number
    isUrgentAvailable: boolean
    avatarUrl: string
    isActive: boolean
}

export interface UpdateProfileRequest {
    name?: string
    description?: string
    phone?: string
    locationText?: string
    locationLat?: number
    locationLng?: number
    radiusPreference?: number
    isUrgentAvailable?: boolean
    avatarUrl?: string
}

export interface RegisterRequest {
    email: string
    password: string
    role: UserRole
    name: string
}

export interface RegisterCredentials extends RegisterRequest {
    confirmPassword: string
}

export interface  RegisterResponse {
    message: string
    userId: string
    email: string
    isActive: boolean
}

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    accessToken: string
    refreshToken: string
    tokenType: "bearer"
    isActive: boolean
}

// Состояние авторизации
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  registrationMessage: string | null
}

// Добавим тип для роли на русском
export type UserRoleRu = "Пользователь" | "Волонтёр" | "Куратор" | "Организация";

export const roleRuMap: Record<UserRole, UserRoleRu> = {
  user: "Пользователь",
  volunteer: "Волонтёр",
  curator: "Куратор",
  organization: "Организация",
};

// Модели для компетенций волонтера
export interface Skill {
  id: string
  name: string
}

export interface Preference {
  id: string
  name: string
}

export interface AnimalType {
  id: number
  name: string
}

export interface ScheduleItem {
  dayOfWeek: number // 0-6, где 0 - понедельник
  startTime: string // "09:00:00"
  endTime: string // "18:00:00"
  isWorking: boolean
}

export interface Availability {
  schedule: ScheduleItem[]
  timezone: string
}

export interface MyCompetencies {
  animalPreferences: AnimalType[]
  availability: Availability
  interactionPreferences: string[]
  preferences: Preference[]
  skills?: Skill[]
}

// Модели для животных
export interface Animal {
  age: number
  curatorId: string
  description: string
  id: string
  isActive: boolean
  locationLat: number
  locationLng: number
  locationText: string
  name: string
  photoUrl: string
  typeId: number
}

// Модель для статистики волонтера (заглушка)
export interface VolunteerStats {
  completedTasksCount: number;
}

// Запрос на создание животного
export interface CreateAnimalRequest {
  age: number;
  description: string;
  location_lat: number;
  location_lng: number;
  location_text: string;
  name: string;
  type_id: number;
}