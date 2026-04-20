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
  
  getProfile: () => Promise<void>
  fetchPublicProfile: (userId: string) => Promise<void>
  updateProfile: (data: UpdateProfileRequest) => Promise<void>
  deleteProfile: () => Promise<void>
  uploadAvatar: (file: File) => Promise<string>
  setEditing: (isEditing: boolean) => void
  clearError: () => void
  fetchVolunteerData: () => Promise<void>;
  fetchMyAnimals: () => Promise<void>;
  fetchVolunteerStats: () => Promise<void>;
  addAnimal: (data: CreateAnimalRequest) => Promise<void>;
  deleteAnimal: (animalId: string) => Promise<void>;
  clearVolunteerData: () => void; // для выхода из профиля
  updateCompetencies: () => Promise<void>; // обновление компетенций после редактирования
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
  
  getProfile: async () => {
    set({ isLoading: true, error: null })
    try {
      const user = await userService.getMyProfile()
      set({ user, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка загрузки профиля', isLoading: false })
    }
  },
  
  fetchPublicProfile: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const user = await userService.getProfileById(userId)
      set({ user, isLoading: false })
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Пользователь не найден', isLoading: false })
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
    // Пока заглушка, но вызовет реальный API
    try {
      const count = await taskService.getCompletedTasksCount();
      set({ volunteerStats: { completedTasksCount: count } });
    } catch (error) {
      console.error("Error fetching volunteer stats:", error);
      set({ volunteerStats: { completedTasksCount: 0 } }); // заглушка
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
    set({ skills: [], preferences: [], competencies: null, myAnimals: [], volunteerStats: null });
  },

  updateCompetencies: async () => {
    try {
      const competencies = await volunteerService.getMyCompetencies();
      set({ competencies });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка обновления компетенций' });
    }
  }
}))