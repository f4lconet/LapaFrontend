// components/ProfileRedirect.tsx
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuthPresenter } from '../presenters/useAuthPresenter';

export const ProfileRedirect = () => {
  const { user, isAuthenticated, isInitializing } = useAuthPresenter();
  
  // Показываем загрузку, пока проверяем авторизацию
  if (isInitializing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Если не авторизован - отправляем на логин
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // Если авторизован - редиректим на профиль с ID
  return <Navigate to={`/profile/${user.id}`} replace />;
};