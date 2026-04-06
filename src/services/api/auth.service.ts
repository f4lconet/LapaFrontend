import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from "../../models/user.model"
import { apiClient } from "./client"


export const authService = {
    // Регистрация
    async register(data: RegisterRequest): Promise<RegisterResponse> {
        const response = await apiClient.post<RegisterResponse>('/auth/register', {
            email: data.email,
            password: data.password,
            role: data.role,
            name: data.name,
        })
        return response.data
    },

    // Вход
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post('/auth/login', {
            email: data.email,
            password: data.password,
        })
        
        // Трансформируем данные из snake_case в camelCase
        const backendData = response.data
        return {
            accessToken: backendData.access_token,
            refreshToken: backendData.refresh_token,
            tokenType: backendData.token_type,
            isActive: backendData.is_active,
        }
    },

        // Получение текущего пользователя
    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<User>('/users/me')
        return response.data
    },

    // Выход
    async logout(): Promise<void> {
        await apiClient.post('/auth/sign_out')
    },

    // Обновление профиля
    async updateProfile(data: Partial<User>): Promise<User> {
        const response = await apiClient.patch<User>('/users/me', data)
        return response.data
    },

    // // Обновление токена
    // async refreshToken(): Promise<{ accessToken: string }> {
    //     const refreshToken = localStorage.getItem('refreshToken')
    //     const response = await apiClient.post<{ accessToken: string }>('/auth/refresh', {
    //     refreshToken,
    //     })
    //     return response.data
    // },
}