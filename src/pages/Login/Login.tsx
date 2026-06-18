import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Typography,
  Container,
  Link as MuiLink,
} from '@mui/material'
import { useAuthPresenter } from '../../presenters/useAuthPresenter'
import { LoginForm } from '../../components/LoginForm'
import { ROUTES } from '../../routes/routes'

export const Login = () => {
  const navigate = useNavigate()
  const { login, isLoading, error, isAuthenticated, isInitializing, clearError, user } = useAuthPresenter()
  
  // Автоматический редирект если уже авторизован
  useEffect(() => {
    if (!isInitializing && isAuthenticated && user) {
      navigate(`/profile/${user.id}`, { replace: true })
    }
  }, [isAuthenticated, isInitializing, user, navigate])
  
  const handleSubmit = async (data: { email: string; password: string }) => {
    const result = await login(data)
    if (result.success && result.user) {
      navigate(`/profile/${result.user.id}`, { replace: true })
    }
  }
  
  return (
    <Container maxWidth="sm">
      <Box sx={{textAlign:"center", mb:4}}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 400,
            fontSize: '48px',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'black',
          }}
        >
          Авторизация
        </Typography>
      </Box>
      
      <LoginForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        onClearError={clearError}
      />

      <Box sx={{textAlign:"center", mt: 1}}>
        <MuiLink component={Link} to={ROUTES.REGISTER}
          sx={{
              fontWeight: 400,
              textDecoration: 'none',
              color: 'black',
              ":hover": {
                opacity: 0.8
              }
          }}
        >
          Восстановление пароля
        </MuiLink>
      </Box>
      
      <Box sx={{textAlign:"center", mt: 2}}>
        <MuiLink component={Link} to={ROUTES.REGISTER}
          sx={{
              fontWeight: 700,
              textDecoration: 'none',
              color: 'black',
              ":hover": {
                opacity: 0.8
              }
          }}
        >
          Нет аккаунта? Зарегистрироваться
        </MuiLink>
      </Box>
    </Container>
  )
}

export default Login