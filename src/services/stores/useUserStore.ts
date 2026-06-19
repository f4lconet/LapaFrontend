import { create } from "zustand"
import type { CreateAnimalRequest, UpdateProfileRequest, User } from "../../models/user.model"
import { userService } from "../api/user.service"
import { volunteerService } from "../api/volunteer.service";
import { animalService } from "../api/animal.service";
import type { Skill, Preference, Animal, MyCompetencies, VolunteerStats } from "../../models/user.model";
import { taskService } from "../api/task.service";

interface UserStore {
  user: User | null
  isLoadingProfile: boolean
  isLoadingDetails: boolean
  isLoadingStats: boolean
  isLoadingAvatar: boolean
  isLoadingProfileUpdate: boolean
  isLoadingAnimal: boolean
  error: string | null
  isEditing: boolean
  skills: Skill[]
  preferences: Preference[]
  competencies: MyCompetencies | null;
  myAnimals: Animal[];
  volunteerStats: VolunteerStats | null;
  publicCompetencies: MyCompetencies | null;
  publicAnimals: Animal[];
  isPublicView: boolean;
  
  getProfile: () => Promise<void>
  fetchPublicProfile: (userId: string) => Promise<void>
  fetchPublicCompetencies: (userId: string) => Promise<void>
  fetchPublicAnimals: (userId: string) => Promise<void>
  updateProfile: (data: UpdateProfileRequest) => Promise<void>
  deleteProfile: () => Promise<void>
  uploadAvatar: (file: File) => Promise<string>
  setEditing: (isEditing: boolean) => void
  clearError: () => void
  fetchVolunteerData: () => Promise<void>;
  fetchMyAnimals: () => Promise<void>;
  fetchVolunteerStats: () => Promise<void>;
  addAnimal: (data: CreateAnimalRequest) => Promise<void>;
  updateAnimal: (animalId: string, data: Partial<CreateAnimalRequest>) => Promise<void>;
  deleteAnimal: (animalId: string) => Promise<void>;
  clearVolunteerData: () => void; // для выхода из профиля
  updateCompetencies: () => Promise<void>; // обновление компетенций после редактирования
  clearPublicData: () => void;
  resetStore: () => void; // полный сброс при logout
  
}


export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoadingProfile: false,
  isLoadingDetails: false,
  isLoadingStats: false,
  isLoadingAvatar: false,
  isLoadingProfileUpdate: false,
  isLoadingAnimal: false,
  error: null,
  isEditing: false,
  skills: [],
  preferences: [],
  competencies: null,
  myAnimals: [],
  volunteerStats: null,
  publicCompetencies: null,
  publicAnimals: [],
  isPublicView: false,
  
  getProfile: async () => {
    // Всегда сбрасываем user и детали — это гарантирует что при возврате
    // с чужого профиля в свой мы не используем чужие данные
    set({ 
      user: null,
      isLoadingProfile: true, 
      error: null,
      competencies: null,
      myAnimals: [],
      volunteerStats: null,
    });
    
    try {
      const user = await userService.getMyProfile()
      set({ user, isLoadingProfile: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка загрузки профиля', isLoadingProfile: false })
    }
  },
  
  fetchPublicProfile: async (userId: string) => {
    set({ 
      user: null, 
      isLoadingProfile: true, 
      error: null,
      publicCompetencies: null,
      publicAnimals: []
    });

    try {
      const user = await userService.getProfileById(userId)
      set({ user, isLoadingProfile: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Пользователь не найден', isLoadingProfile: false })
    }
  },

  fetchPublicCompetencies: async (userId: string) => {
    try {
      const competencies = await volunteerService.getVolunteerCompetencies(userId);
      set({ publicCompetencies: competencies });
    } catch (error) {
      console.error('Error fetching public competencies:', error);
      set({ publicCompetencies: null });
    }
  },

  fetchPublicAnimals: async (userId: string) => {
    try {
      const animals = await animalService.getAnimalsByCurator(userId);
      set({ publicAnimals: animals });
    } catch (error) {
      console.error('Error fetching public animals:', error);
      set({ publicAnimals: [] });
    }
  },
  
  updateProfile: async (data: UpdateProfileRequest) => {
    set({ isLoadingProfileUpdate: true, error: null })
    try {
      await userService.updateMyProfile(data)
      // Перезагружаем профиль, чтобы получить актуальные данные
      const updatedUser = await userService.getMyProfile()
      set({ user: updatedUser, isLoadingProfileUpdate: false, isEditing: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка обновления профиля', isLoadingProfileUpdate: false })
      throw error
    }
  },

  deleteProfile: async () => {
    set({ isLoadingProfileUpdate: true, error: null })
    try {
      await userService.deleteMyProfile()
      set({ isLoadingProfileUpdate: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка удаления профиля', isLoadingProfileUpdate: false })
    }
  },
  
  uploadAvatar: async (file: File) => {
    set({ isLoadingAvatar: true })
    try {
      const { avatarUrl } = await userService.uploadAvatar(file)
      const currentUser = get().user
      if (currentUser) {
        set({ user: { ...currentUser, avatarUrl }, isLoadingAvatar: false })
      }
      return avatarUrl
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка загрузки аватара', isLoadingAvatar: false })
      throw error
    }
  },
  
  setEditing: (isEditing: boolean) => set({ isEditing }),
  clearError: () => set({ error: null }),
  
  fetchVolunteerData: async () => {
    set({ isLoadingDetails: true, error: null });
    try {
      const [skills, preferences, competencies] = await Promise.all([
        volunteerService.getAllSkills(),
        volunteerService.getAllPreferences(),
        volunteerService.getMyCompetencies(),
      ]);
      set({ skills, preferences, competencies, isLoadingDetails: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка загрузки данных волонтера', isLoadingDetails: false });
    }
  },

  fetchMyAnimals: async () => {
    set({ isLoadingDetails: true, error: null });
    try {
      const animals = await animalService.getMyAnimals();
      set({ myAnimals: animals, isLoadingDetails: false });
    } catch (error: any) {
      console.error('Error fetching animals:', error);
      set({ 
        myAnimals: [],
        error: error.response?.data?.message || 'Ошибка загрузки животных', 
        isLoadingDetails: false 
      });
    }
  },

  fetchVolunteerStats: async () => {
    set({ isLoadingStats: true, error: null });
    try {
      const response = await taskService.getMyVolunteerCompletedTasks(20, 0);
      set({ volunteerStats: { completedTasksCount: response.total }, isLoadingStats: false });
    } catch (error) {
      console.error("Error fetching volunteer stats:", error);
      set({ volunteerStats: { completedTasksCount: 0 }, isLoadingStats: false });
    }
  },

  addAnimal: async (data: CreateAnimalRequest) => {
    set({ isLoadingAnimal: true, error: null });
    try {
      const newAnimal = await animalService.createAnimal(data);
      set({ myAnimals: [...get().myAnimals, newAnimal], isLoadingAnimal: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка добавления животного', isLoadingAnimal: false });
      throw error;
    }
  },

  updateAnimal: async (animalId: string, data: Partial<CreateAnimalRequest>) => {
    set({ isLoadingAnimal: true, error: null });
    try {
      const updatedAnimal = await animalService.updateAnimal(animalId, data);
      set({ 
        myAnimals: get().myAnimals.map(a => a.id === animalId ? updatedAnimal : a),
        isLoadingAnimal: false 
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка обновления животного', isLoadingAnimal: false });
      throw error;
    }
  },

  deleteAnimal: async (animalId: string) => {
    set({ isLoadingAnimal: true, error: null });
    try {
      await animalService.deleteAnimal(animalId);
      set({ myAnimals: get().myAnimals.filter(a => a.id !== animalId), isLoadingAnimal: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка удаления животного', isLoadingAnimal: false });
      throw error;
    }
  },

  clearVolunteerData: () => {
    set({ 
      skills: [], 
      preferences: [], 
      competencies: null, 
      myAnimals: [], 
      volunteerStats: null,
      publicCompetencies: null,
      publicAnimals: []
    });
  },

  updateCompetencies: async () => {
    try {
      const competencies = await volunteerService.getMyCompetencies();
      set({ competencies });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка обновления компетенций' });
    }
  },

  clearPublicData: () => {
    set({ 
      publicCompetencies: null, 
      publicAnimals: [],
      isPublicView: false 
    });
  },

  // Полный сброс при logout — очищает все данные пользователя
  resetStore: () => {
    set({
      user: null,
      isLoadingProfile: false,
      isLoadingDetails: false,
      isLoadingStats: false,
      isLoadingAvatar: false,
      isLoadingProfileUpdate: false,
      isLoadingAnimal: false,
      error: null,
      isEditing: false,
      skills: [],
      preferences: [],
      competencies: null,
      myAnimals: [],
      volunteerStats: null,
      publicCompetencies: null,
      publicAnimals: [],
      isPublicView: false,
    });
  },

}))