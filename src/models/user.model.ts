export type UserRole = "user" | "volunteer" | "curator" | "admin"

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