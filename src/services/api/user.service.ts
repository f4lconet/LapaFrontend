import type { User, UpdateProfileRequest } from "../../models/user.model";
import { apiClient } from "./client";

export const userService = {
    async getMyProfile(): Promise<User> {
        const response = await apiClient.get('/users/me')
        const data = response.data;
        // Преобразование snake_case в camelCase
        return {
            id: data.id,
            email: data.email,
            name: data.name,
            description: data.description,
            role: data.role,
            phone: data.phone,
            locationText: data.location_text,
            locationLat: data.location_lat,
            locationLng: data.location_lng,
            radiusPref: data.radius_preference,
            isUrgentAvailable: data.is_urgent_available,
            avatarUrl: data.avatar_url,
            isActive: data.is_active,
        };
    },

    async deleteMyProfile(): Promise<void> {
        const response = await apiClient.delete('/users/me')
        return response.data
    },

    async updateMyProfile(data: UpdateProfileRequest): Promise<User> {
        // Преобразование camelCase в snake_case для API
        const apiData: any = {
            name: data.name,
            description: data.description,
            phone: data.phone,
            location_text: data.locationText,
            location_lat: data.locationLat,
            location_lng: data.locationLng,
            radius_preference: data.radiusPreference,
            is_urgent_available: data.isUrgentAvailable,
            avatar_url: data.avatarUrl,
        };
        
        const response = await apiClient.patch('/users/me', apiData)
        const responseData = response.data;
        // Преобразование snake_case в camelCase
        return {
            id: responseData.id,
            email: responseData.email,
            name: responseData.name,
            description: responseData.description,
            role: responseData.role,
            phone: responseData.phone,
            locationText: responseData.location_text,
            locationLat: responseData.location_lat,
            locationLng: responseData.location_lng,
            radiusPref: responseData.radius_preference,
            isUrgentAvailable: responseData.is_urgent_available,
            avatarUrl: responseData.avatar_url,
            isActive: responseData.is_active,
        };
    },

    async uploadAvatar(file: File): Promise<{avatarUrl: string}> {
        const formData = new FormData()
        formData.append('file', file)
        const response = await apiClient.post<{ avatar_url: string }>('/users/me/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return { avatarUrl: response.data.avatar_url }
    },

    async getProfileById(userId: string): Promise<User> {
        const response = await apiClient.get(`/users/${userId}`)
        const data = response.data;
        // Преобразование snake_case в camelCase
        return {
            id: data.id,
            email: data.email,
            name: data.name,
            description: data.description,
            role: data.role,
            phone: data.phone,
            locationText: data.location_text,
            locationLat: data.location_lat,
            locationLng: data.location_lng,
            radiusPref: data.radius_preference,
            isUrgentAvailable: data.is_urgent_available,
            avatarUrl: data.avatar_url,
            isActive: data.is_active,
        };
    },

    async getUsers(limit: number = 20, offset: number = 0, search?: string): Promise<{ items: User[], total: number, nextOffset: number }> {
        const params: any = {
            limit,
            offset,
        };
        if (search) {
            params.search = search;
        }
        const response = await apiClient.get('/users', { params });
        const data = response.data;
        return {
            items: data.items.map((item: any) => ({
                id: item.id,
                email: item.email,
                name: item.name,
                description: item.description,
                role: item.role,
                phone: item.phone,
                locationText: item.location_text,
                locationLat: item.location_lat,
                locationLng: item.location_lng,
                radiusPref: item.radius_preference,
                isUrgentAvailable: item.is_urgent_available,
                avatarUrl: item.avatar_url,
                isActive: item.is_active,
            })),
            total: data.total,
            nextOffset: data.next_offset,
        };
    },
}