import { apiClient } from "./client";
import type { Skill, Preference, AnimalType, MyCompetencies } from "../../models/user.model";

export const volunteerService = {
  
  async getAllSkills(): Promise<Skill[]> {
    const response = await apiClient.get('/volunteer/skills');
    return response.data;
  },

  
  async getAllPreferences(): Promise<Preference[]> {
    const response = await apiClient.get('/volunteer/preferences');
    return response.data;
  },

  
  async getAllAnimalTypes(): Promise<AnimalType[]> {
    const response = await apiClient.get('/volunteer/animal-types');
    return response.data;
  },

  
  async getMyCompetencies(): Promise<MyCompetencies> {
    const response = await apiClient.get('/volunteer/me/competencies');
    return response.data;
  },


  async updateMySkills(skillIds: string[]): Promise<void> {
    await apiClient.put('/volunteer/me/skills', { skillIds: skillIds });
  },


  async updateMyPreferences(preferenceIds: string[]): Promise<void> {
    await apiClient.put('/volunteer/me/preferences', { preferenceIds: preferenceIds });
  },

  // (для публичного профиля)
  async getUserCompetencies(userId: string): Promise<MyCompetencies> {
    const response = await apiClient.get(`/volunteer/${userId}/competencies`);
    return response.data;
  },
};