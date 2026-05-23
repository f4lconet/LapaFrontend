import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUserStore } from '../services/stores/useUserStore';
import { useAuthStore } from '../services/stores/useAuthStore';
import { useReviewStore } from '../services/stores/useReviewStore';
import type { CreateAnimalRequest, UpdateProfileRequest } from '../models/user.model';

export const useUserPresenter = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuthStore();

  const {
    user,
    isLoading,
    error,
    isEditing,
    skills,
    preferences,
    competencies,
    myAnimals,
    volunteerStats,
    publicCompetencies,
    publicAnimals, 
    getProfile,
    fetchPublicProfile,
    fetchPublicCompetencies,
    fetchPublicAnimals,
    updateProfile,
    deleteProfile,
    uploadAvatar,
    setEditing,
    clearError,
    fetchVolunteerData,
    fetchMyAnimals,
    fetchVolunteerStats,
    addAnimal,
    deleteAnimal,
    clearVolunteerData,
    updateCompetencies,
    clearPublicData,  
  } = useUserStore();

  const { stats: reviewStats } = useReviewStore();

  // Определяем, свой ли это профиль
  const isOwnProfile = !userId || currentUser?.id === userId;

  // Загрузка профиля
  useEffect(() => {
    if (isOwnProfile) {
      getProfile();
    } else if (userId) {
      fetchPublicProfile(userId);
    }
    
    // Очистка при размонтировании
    return () => {
      if (!isOwnProfile) {
        clearPublicData();
        clearVolunteerData();
      }
    };
  }, [userId]);

  // Загрузка дополнительных данных после получения пользователя
  useEffect(() => {
    if (!user) return;

    if (isOwnProfile) {
      // Свой профиль - используем личные эндпоинты
      if (user.role === 'volunteer') {
        fetchVolunteerData();
        fetchVolunteerStats();
      } else if (user.role === 'curator' || user.role === 'organization') {
        fetchMyAnimals();
      }
    } else {
      // Чужой профиль - используем публичные эндпоинты
      if (user.role === 'volunteer' && userId) {
        fetchPublicCompetencies(userId);
      } else if ((user.role === 'curator' || user.role === 'organization') && userId) {
        fetchPublicAnimals(userId);
      }
    }
  }, [user, isOwnProfile, userId]);

  // Определяем, какие данные показывать
  const displayCompetencies = isOwnProfile ? competencies : publicCompetencies;
  const displayAnimals = isOwnProfile ? myAnimals : publicAnimals;

  // Комбинируем статистику: свои задачи + данные из отзывов
  const combinedVolunteerStats = {
    completedTasksCount: isOwnProfile 
      ? (volunteerStats?.completedTasksCount ?? 0)  // Свой профиль — из fetchVolunteerStats
      : (reviewStats?.tasks_count ?? 0)              // Чужой профиль — из reviewStats
  };

  const handleUpdateProfile = useCallback(async (data: UpdateProfileRequest) => {
    await updateProfile(data);
  }, [updateProfile]);

  const handleDeleteProfile = useCallback(async () => {
    await deleteProfile();
  }, [deleteProfile]);

  const handleUploadAvatar = useCallback(async (file: File) => {
    return await uploadAvatar(file);
  }, [uploadAvatar]);

  const handleAddAnimal = useCallback(async (data: CreateAnimalRequest) => {
    if (isOwnProfile) {
      await addAnimal(data);
    }
  }, [addAnimal, isOwnProfile]);

  const handleDeleteAnimal = useCallback(async (id: string) => {
    if (isOwnProfile) {
      await deleteAnimal(id);
    }
  }, [deleteAnimal, isOwnProfile]);

  return {
    user,
    isLoading,
    error,
    isEditing,
    isOwnProfile,
    skills,
    preferences,
    competencies: displayCompetencies,
    myAnimals: displayAnimals,
    volunteerStats: combinedVolunteerStats,
    updateProfile: handleUpdateProfile,
    deleteProfile: handleDeleteProfile,
    uploadAvatar: handleUploadAvatar,
    setEditing,
    clearError,
    addAnimal: isOwnProfile ? handleAddAnimal : undefined,
    deleteAnimal: isOwnProfile ? handleDeleteAnimal : undefined,
    updateCompetencies: isOwnProfile ? updateCompetencies : undefined,
  };
};