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
    const data = response.data;
    
    // Преобразование snake_case в camelCase
    return {
      ...data,
      availability: data.availability ? {
        ...data.availability,
        schedule: data.availability.schedule?.map((item: any) => ({
          dayOfWeek: item.day_of_week,
          startTime: item.start_time,
          endTime: item.end_time,
          isWorking: item.is_working
        })) || []
      } : undefined
    };
  },


  async updateMySkills(skillIds: string[]): Promise<void> {
    await apiClient.put('/volunteer/me/skills', { skill_ids: skillIds });
  },


  async updateMyPreferences(preferenceIds: string[]): Promise<void> {
    await apiClient.put('/volunteer/me/preferences', { preference_ids: preferenceIds });
  },

  // (для публичного профиля)
  async getUserCompetencies(userId: string): Promise<MyCompetencies> {
    const response = await apiClient.get(`/volunteer/${userId}/competencies`);
    return response.data;
  },

  async updateMyAnimalPreferences(animalTypeIds: number[]): Promise<void> {
    await apiClient.put('/volunteer/me/animal-preferences', { animal_type_ids: animalTypeIds });
  },

  async updateMyInteractionPreferences(interactionTypes: string[]): Promise<void> {
    await apiClient.put('/volunteer/me/interaction-preferences', { interaction_types: interactionTypes });
  },

  async updateMySchedule(schedule: any[]): Promise<void> {
    // Преобразование camelCase в snake_case для API
    const apiSchedule = schedule.map(item => ({
      day_of_week: item.dayOfWeek,
      start_time: item.startTime,
      end_time: item.endTime,
      is_working: item.isWorking
    }));
    await apiClient.put('/volunteer/me/schedule', { schedule: apiSchedule });
  },
};