import { apiClient } from "./client";
import type { Animal, CreateAnimalRequest } from "../../models/user.model";

export const animalService = {

  async createAnimal(data: CreateAnimalRequest): Promise<Animal> {
    const response = await apiClient.post('/animals', data);
    return response.data;
  },


  async getAllAnimals(params?: { type_id?: number; curator_id?: string; is_active?: boolean }): Promise<Animal[]> {
    const response = await apiClient.get('/animals', { params });
    return response.data?.items || [];
  },


  async getMyAnimals(): Promise<Animal[]> {
    const response = await apiClient.get('/animals/me');
    return response.data?.items || [];
  },

  
  async getAnimal(animalId: string): Promise<Animal> {
    const response = await apiClient.get(`/animals/${animalId}`);
    return response.data;
  },


  async deleteAnimal(animalId: string): Promise<void> {
    await apiClient.delete(`/animals/${animalId}`);
  },


  async uploadAnimalPhoto(animalId: string, file: File): Promise<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/animals/${animalId}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { photoUrl: response.data.photo_url };
  },
};