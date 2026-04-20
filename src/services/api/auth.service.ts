import axios from 'axios'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, RefreshTokenResponse, User } from "../../models/user.model"
import { apiClient } from "./client"

const API_BASE_URL = import.meta.env.VITE_BASE_URL

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
        const response = await apiClient.get('/users/me')
        return response.data
    },

    // Выход
    async logout(): Promise<void> {
        await apiClient.post('/auth/sign_out')
    },

    // Обновление токена
    async refreshToken(refreshToken?: string): Promise<RefreshTokenResponse> {
        const token = refreshToken || localStorage.getItem('refreshToken')
        if (!token) {
            throw new Error('Refresh token is missing')
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: token,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const backendData = response.data

        return {
            accessToken: backendData.access_token || backendData.accessToken,
            refreshToken: backendData.refresh_token || backendData.refreshToken,
            tokenType: backendData.token_type || 'bearer',
        }
    },
}