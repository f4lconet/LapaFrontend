import { useNavigate } from 'react-router-dom';
import { Box, Alert, Container, CircularProgress } from '@mui/material';
import { useAuthPresenter } from '../../presenters/useAuthPresenter';
import { useUserPresenter } from '../../presenters/useUserPresenter';
import { ProfileInfo } from '../../components/profile/ProfileInfo';
import { BurgerMenu } from '../../components/navigation/BurgerMenu';
import { useReviewStore } from '../../services/stores/useReviewStore';
import { useEffect } from 'react';

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuthPresenter();
  const {
    user,
    isLoading,
    isLoadingProfile,
    error,
    isEditing,
    isOwnProfile,
    competencies,
    myAnimals,
    volunteerStats,
    updateProfile,
    uploadAvatar,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    updateCompetencies,
  } = useUserPresenter();

  const { fetchVolunteerStats: fetchReviewStats } = useReviewStore();

  // Загружаем статистику отзывов при просмотре чужого профиля волонтёра
  useEffect(() => {
    if (user && !isOwnProfile && user.role === 'volunteer') {
      fetchReviewStats(user.id);
    }
  }, [user?.id, isOwnProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleChat = () => {
    if (user?.id) {
      navigate(`/chat?userId=${user.id}`);
    }
  };

  // Показываем спиннер только пока идёт загрузка профиля и user ещё не получен
  if (isLoadingProfile && !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Показываем ошибку только если загрузка завершена и user так и не получен
  if (!isLoadingProfile && (error || !user)) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">{error || 'Ошибка загрузки профиля'}</Alert>
      </Container>
    );
  }

  // Пока user ещё null но загрузка идёт — не рендерим ничего лишнего
  if (!user) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <BurgerMenu onLogout={isOwnProfile ? handleLogout : undefined} />
      </Box>

      <ProfileInfo
        user={user}
        isEditing={isEditing}
        isLoading={isLoading}
        isOwnProfile={isOwnProfile}
        competencies={competencies}
        volunteerStats={volunteerStats}
        myAnimals={myAnimals}
        onUpdate={updateProfile}
        onUploadAvatar={uploadAvatar}
        onChat={!isOwnProfile ? handleChat : undefined}
        onCompetenciesUpdate={updateCompetencies}
        onAddAnimal={isOwnProfile && (user.role === 'curator' || user.role === 'organization') ? addAnimal : undefined}
        onUpdateAnimal={isOwnProfile && (user.role === 'curator' || user.role === 'organization') ? updateAnimal : undefined}
        onDeleteAnimal={isOwnProfile && (user.role === 'curator' || user.role === 'organization') ? deleteAnimal : undefined}
      />
    </Container>
  );
};

export default Profile;
