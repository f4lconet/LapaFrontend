import { create } from "zustand"
import type { CreateAnimalRequest, UpdateProfileRequest, User } from "../../models/user.model"
import { userService } from "../api/user.service"
import { volunteerService } from "../api/volunteer.service";
import { animalService } from "../api/animal.service";
import type { Skill, Preference, Animal, MyCompetencies, VolunteerStats } from "../../models/user.model";
import { taskService } from "../api/task.service";

interface UserStore {
  user: User | null
  isLoading: boolean
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
  
}


export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoading: false,
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
    // set({ isLoading: true, error: null })
    set({ 
      user: null, 
      isLoading: true, 
      error: null,
      competencies: null,
      myAnimals: [],
      volunteerStats: null
    });
    
    try {
      const user = await userService.getMyProfile()
      set({ user, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка загрузки профиля', isLoading: false })
    }
  },
  
  fetchPublicProfile: async (userId: string) => {
    // set({ isLoading: true, error: null })
    set({ 
      user: null, 
      isLoading: true, 
      error: null,
      publicCompetencies: null,
      publicAnimals: []
    });

    try {
      const user = await userService.getProfileById(userId)
      set({ user, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Пользователь не найден', isLoading: false })
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
    set({ isLoading: true, error: null })
    try {
      await userService.updateMyProfile(data)
      // Перезагружаем профиль, чтобы получить актуальные данные
      const updatedUser = await userService.getMyProfile()
      set({ user: updatedUser, isLoading: false, isEditing: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка обновления профиля', isLoading: false })
      throw error
    }
  },

  deleteProfile: async () => {
    set({ isLoading: true, error: null })
    try {
      await userService.deleteMyProfile()
      set({ isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка удаления профиля', isLoading: false })
    }
  },
  
  uploadAvatar: async (file: File) => {
    set({ isLoading: true })
    try {
      const { avatarUrl } = await userService.uploadAvatar(file)
      const currentUser = get().user
      if (currentUser) {
        set({ user: { ...currentUser, avatarUrl }, isLoading: false })
      }
      return avatarUrl
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка загрузки аватара', isLoading: false })
      throw error
    }
  },
  
  setEditing: (isEditing: boolean) => set({ isEditing }),
  clearError: () => set({ error: null }),
  
  fetchVolunteerData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [skills, preferences, competencies] = await Promise.all([
        volunteerService.getAllSkills(),
        volunteerService.getAllPreferences(),
        volunteerService.getMyCompetencies(),
      ]);
      set({ skills, preferences, competencies, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка загрузки данных волонтера', isLoading: false });
    }
  },

  fetchMyAnimals: async () => {
    set({ isLoading: true, error: null });
    try {
      const animals = await animalService.getMyAnimals();
      set({ myAnimals: animals, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching animals:', error);
      set({ 
        myAnimals: [],
        error: error.response?.data?.message || 'Ошибка загрузки животных', 
        isLoading: false 
      });
    }
  },

  fetchVolunteerStats: async () => {
    try {
      const response = await taskService.getMyVolunteerCompletedTasks(20, 0);
      set({ volunteerStats: { completedTasksCount: response.total } });
    } catch (error) {
      console.error("Error fetching volunteer stats:", error);
      set({ volunteerStats: { completedTasksCount: 0 } });
    }
  },

  addAnimal: async (data: CreateAnimalRequest) => {
    set({ isLoading: true, error: null });
    try {
      const newAnimal = await animalService.createAnimal(data);
      set({ myAnimals: [...get().myAnimals, newAnimal], isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка добавления животного', isLoading: false });
      throw error;
    }
  },

  updateAnimal: async (animalId: string, data: Partial<CreateAnimalRequest>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAnimal = await animalService.updateAnimal(animalId, data);
      set({ 
        myAnimals: get().myAnimals.map(a => a.id === animalId ? updatedAnimal : a),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка обновления животного', isLoading: false });
      throw error;
    }
  },

  deleteAnimal: async (animalId: string) => {
    set({ isLoading: true, error: null });
    try {
      await animalService.deleteAnimal(animalId);
      set({ myAnimals: get().myAnimals.filter(a => a.id !== animalId), isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка удаления животного', isLoading: false });
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

}))