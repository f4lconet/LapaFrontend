import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUserStore } from '../services/stores/useUserStore';
import { useAuthStore } from '../services/stores/useAuthStore';
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
    getProfile,
    fetchPublicProfile,
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
  } = useUserStore();

  // Определяем, свой ли это профиль
  const isOwnProfile = !userId || currentUser?.id === userId;

  // Загрузка профиля
  useEffect(() => {
    if (isOwnProfile) {
      getProfile();
    } else if (userId) {
      fetchPublicProfile(userId);
    }
  }, [isOwnProfile, userId, getProfile, fetchPublicProfile]);

  // Загрузка дополнительных данных в зависимости от роли
  useEffect(() => {
    if (user) {
      if (user.role === 'volunteer') {
        fetchVolunteerData();
        fetchVolunteerStats();
      } else if (user.role === 'curator' || user.role === 'organization') {
        fetchMyAnimals();
      }
    }
  }, [user, fetchVolunteerData, fetchVolunteerStats, fetchMyAnimals]);

  // Очистка при размонтировании (опционально)
  useEffect(() => {
    return () => {
      if (!isOwnProfile) {
        clearVolunteerData();
      }
    };
  }, [isOwnProfile, clearVolunteerData]);

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
    await addAnimal(data);
  }, [addAnimal]);

  const handleDeleteAnimal = useCallback(async (id: string) => {
    await deleteAnimal(id);
  }, [deleteAnimal]);

  return {
    user,
    isLoading,
    error,
    isEditing,
    isOwnProfile,
    skills,
    preferences,
    competencies,
    myAnimals,
    volunteerStats,
    updateProfile: handleUpdateProfile,
    deleteProfile: handleDeleteProfile,
    uploadAvatar: handleUploadAvatar,
    setEditing,
    clearError,
    addAnimal: handleAddAnimal,
    deleteAnimal: handleDeleteAnimal,
    updateCompetencies,
  };
};