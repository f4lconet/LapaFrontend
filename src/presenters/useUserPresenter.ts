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
    isLoadingProfile,
    isLoadingDetails,
    isLoadingStats,
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
    updateAnimal,
    deleteAnimal,
    clearVolunteerData,
    updateCompetencies,
    clearPublicData,  
  } = useUserStore();

  const { stats: reviewStats } = useReviewStore();

  // Определяем, свой ли это профиль
  const isOwnProfile = !userId || currentUser?.id === userId;

  // Загрузка профиля — только при реальной смене userId
  useEffect(() => {
    if (isOwnProfile) {
      getProfile();
    } else if (userId) {
      fetchPublicProfile(userId);
    }
    
    // Очистка при размонтировании (только для чужого профиля)
    return () => {
      if (!isOwnProfile) {
        clearPublicData();
        clearVolunteerData();
      }
    };
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Загрузка дополнительных данных после получения пользователя.
  // Важно: проверяем isLoadingProfile чтобы не запустить детали
  // по стейлому user пока новый ещё грузится.
  useEffect(() => {
    if (!user || isLoadingProfile) return;

    // Дополнительная защита: для своего профиля убеждаемся что user
    // в сторе — это действительно мы, а не чужой пользователь
    if (isOwnProfile && currentUser && user.id !== currentUser.id) return;

    if (isOwnProfile) {
      if (user.role === 'volunteer') {
        fetchVolunteerData();
        fetchVolunteerStats();
      } else if (user.role === 'curator' || user.role === 'organization') {
        fetchMyAnimals();
      }
    } else {
      if (user.role === 'volunteer' && userId) {
        fetchPublicCompetencies(userId);
      } else if ((user.role === 'curator' || user.role === 'organization') && userId) {
        fetchPublicAnimals(userId);
      }
    }
  }, [user?.id, isLoadingProfile, isOwnProfile, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Определяем, какие данные показывать
  const displayCompetencies = isOwnProfile ? competencies : publicCompetencies;
  const displayAnimals = isOwnProfile ? myAnimals : publicAnimals;

  // Комбинируем статистику
  const combinedVolunteerStats = {
    completedTasksCount: isOwnProfile 
      ? (volunteerStats?.completedTasksCount ?? 0)
      : (reviewStats?.tasks_count ?? 0)
  };

  // Общий флаг загрузки для UI
  const isLoading = isLoadingProfile || isLoadingDetails || isLoadingStats;

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

  const handleUpdateAnimal = useCallback(async (animalId: string, data: Partial<CreateAnimalRequest>) => {
    if (isOwnProfile) {
      await updateAnimal(animalId, data);
    }
  }, [updateAnimal, isOwnProfile]);

  const handleDeleteAnimal = useCallback(async (id: string) => {
    if (isOwnProfile) {
      await deleteAnimal(id);
    }
  }, [deleteAnimal, isOwnProfile]);

  return {
    user,
    isLoading,
    isLoadingProfile,
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
    updateAnimal: isOwnProfile ? handleUpdateAnimal : undefined,
    deleteAnimal: isOwnProfile ? handleDeleteAnimal : undefined,
    updateCompetencies: isOwnProfile ? updateCompetencies : undefined,
  };
};
