import type { User } from "../../models/user.model";
import { apiClient } from "./client";

export const userService = {
    async getMyProfile(): Promise<User> {
        const response = await apiClient.get('/users/me')
        return response.data
    },

    async deleteMyProfile(): Promise<void> {
        const response = await apiClient.delete('/users/me')
        return response.data
    },

    async updateMyProfile(data: Partial<User>): Promise<User> {
        const response = await apiClient.patch('/users/me', data)
        return response.data
    },

    async uploadAvatar(file: File): Promise<{avatarUrl: string}> {
        const formData = new FormData()
        formData.append('file', file)
        const response = await apiClient.post<{ avatar_url: string }>('/users/me/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return { avatarUrl: response.data.avatar_url }
    },
}