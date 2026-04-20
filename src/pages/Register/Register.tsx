import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Typography,
  Container,
  Link as MuiLink,
  Alert,
} from '@mui/material'
import { useAuthPresenter } from '../../presenters/useAuthPresenter'
import { RegisterForm } from '../../components/RegisterForm'
import { ROUTES } from '../../routes/routes'
import type { UserRole } from '../../models/user.model'

const Register = () => {
  const navigate = useNavigate()
  const { 
    register, 
    isLoading, 
    error, 
    registrationMessage,
    isAuthenticated,
    isInitializing,
    clearError,
    clearRegistrationMessage,
  } = useAuthPresenter()
  
  // Если уже авторизован, перенаправляем на главную
  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      navigate(ROUTES.FEED, { replace: true })
    }
  }, [isAuthenticated, isInitializing, navigate])
  
  const handleSubmit = async (data: {
    email: string
    password: string
    name: string
    role: UserRole
  }) => {
    const result = await register(data)
    if (result.success) {
      // Если есть сообщение об успехе, показываем его, потом редирект на логин
      if (registrationMessage) {
        setTimeout(() => {
          clearRegistrationMessage()
          navigate(ROUTES.LOGIN)
        }, 3000)
      } else {
        navigate(ROUTES.LOGIN)
      }
    }
  }
  
  const handleClearError = () => {
    clearError()
  }
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
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
          Регистрация
        </Typography>
      </Box>
      
      {/* Сообщение об успешной регистрации */}
      {registrationMessage && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          onClose={clearRegistrationMessage}
        >
          {registrationMessage}
        </Alert>
      )}
      
      <RegisterForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        onClearError={handleClearError}
      />
      
      <Box sx={{ textAlign: 'center', marginTop: '10px' }}>
        <MuiLink component={Link} to={ROUTES.LOGIN}
          sx={{
            fontWeight: 700,
            textDecoration: 'none',
            color: 'black',
          }}
        >
          Есть аккаунт? Авторизоваться
        </MuiLink>
      </Box>
    </Container>
  )
}

export default Register