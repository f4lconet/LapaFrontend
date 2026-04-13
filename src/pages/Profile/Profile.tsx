import { useNavigate } from 'react-router-dom';
import { Box, Alert, Container } from '@mui/material';
import { useAuthPresenter } from '../../presenters/useAuthPresenter';
import { useUserPresenter } from '../../presenters/useUserPresenter';
import { ProfileInfo } from '../../components/profile/ProfileInfo';
import { BurgerMenu } from '../../components/navigation/BurgerMenu';

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuthPresenter();
  const {
    user,
    isLoading,
    error,
    isEditing,
    isOwnProfile,
    competencies,
    myAnimals,
    volunteerStats,
    updateProfile,
    uploadAvatar,
    deleteProfile,
    setEditing,
    clearError,
    addAnimal,
    deleteAnimal,
  } = useUserPresenter();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleShare = () => {
    if (user) {
      const url = `${window.location.origin}/profile/${user.id}`;
      navigator.clipboard.writeText(url);
      alert('Ссылка на профиль скопирована!');
    }
  };

  if (isLoading && !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>Загрузка профиля...</Box>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">{error || 'Ошибка загрузки профиля'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <BurgerMenu onShare={isOwnProfile ? handleShare : undefined} onLogout={isOwnProfile ? handleLogout : undefined} />
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
        // onCancel={() => setEditing(false)}
        onAddAnimal={isOwnProfile && (user.role === 'curator' || user.role === 'organization') ? addAnimal : undefined}
        onDeleteAnimal={isOwnProfile && (user.role === 'curator' || user.role === 'organization') ? deleteAnimal : undefined}
      />
    </Container>
  );
};

export default Profile;