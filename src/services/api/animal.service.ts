import { apiClient } from "./client";
import type { Animal, CreateAnimalRequest } from "../../models/user.model";

export const animalService = {

  async createAnimal(data: CreateAnimalRequest): Promise<Animal> {
    const response = await apiClient.post('/animals', data);
    const item = response.data;

    return {
      id: item.id,
      name: item.name,
      age: item.age,
      description: item.description,
      typeId: item.type_id,
      curatorId: item.curator_id,
      locationText: item.location_text,
      locationLat: item.location_lat,
      locationLng: item.location_lng,
      photoUrl: item.photo_url,
      isActive: item.is_active
    };
  },

  async getAllAnimals(params?: { type_id?: number; curator_id?: string; is_active?: boolean }): Promise<Animal[]> {
    const response = await apiClient.get('/animals', { params });
    const data = response.data;
    
    return (data.items || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      age: item.age,
      description: item.description,
      typeId: item.type_id,
      curatorId: item.curator_id,
      locationText: item.location_text,
      locationLat: item.location_lat,
      locationLng: item.location_lng,
      photoUrl: item.photo_url,
      isActive: item.is_active
    }));
  },

  async getMyAnimals(): Promise<Animal[]> {
    const response = await apiClient.get('/animals/me');
    const data = response.data;
    
    return (data.items || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      age: item.age,
      description: item.description,
      typeId: item.type_id,
      curatorId: item.curator_id,
      locationText: item.location_text,
      locationLat: item.location_lat,
      locationLng: item.location_lng,
      photoUrl: item.photo_url,
      isActive: item.is_active
    }));
  },

  async getAnimal(animalId: string): Promise<Animal> {
    const response = await apiClient.get(`/animals/${animalId}`);
    const item = response.data;
    
    return {
      id: item.id,
      name: item.name,
      age: item.age,
      description: item.description,
      typeId: item.type_id,
      curatorId: item.curator_id,
      locationText: item.location_text,
      locationLat: item.location_lat,
      locationLng: item.location_lng,
      photoUrl: item.photo_url,
      isActive: item.is_active
    };
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

  async getAnimalsByCurator(curatorId: string): Promise<Animal[]> {
    const response = await apiClient.get('/animals', {
      params: { curator_id: curatorId, is_active: true }
    });
    const data = response.data;
    
    return (data.items || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      age: item.age,
      description: item.description,
      typeId: item.type_id,
      curatorId: item.curator_id,
      locationText: item.location_text,
      locationLat: item.location_lat,
      locationLng: item.location_lng,
      photoUrl: item.photo_url,
      isActive: item.is_active
    }));
  },

  async updateAnimal(animalId: string, data: Partial<CreateAnimalRequest>): Promise<Animal> {
    const apiData: any = {};
    if (data.name !== undefined) apiData.name = data.name;
    if (data.age !== undefined) apiData.age = data.age;
    if (data.description !== undefined) apiData.description = data.description;
    if (data.type_id !== undefined) apiData.type_id = data.type_id;
    if (data.location_text !== undefined) apiData.location_text = data.location_text;
    if (data.location_lat !== undefined) apiData.location_lat = data.location_lat;
    if (data.location_lng !== undefined) apiData.location_lng = data.location_lng;

    const response = await apiClient.put(`/animals/${animalId}`, apiData);
    const item = response.data;

    return {
      id: item.id,
      name: item.name,
      age: item.age,
      description: item.description,
      typeId: item.type_id,
      curatorId: item.curator_id,
      locationText: item.location_text,
      locationLat: item.location_lat,
      locationLng: item.location_lng,
      photoUrl: item.photo_url,
      isActive: item.is_active
    };
  },
};