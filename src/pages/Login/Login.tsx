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
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthPresenter()
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.PROFILE, { replace: true })
    }
  }, [isAuthenticated, navigate])
  
  const handleSubmit = async (data: { email: string; password: string }) => {
    const result = await login(data)
    if (result.success) {
      navigate(ROUTES.PROFILE, { replace: true })
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
      
      <Box sx={{textAlign:"center", marginTop: '10px'}}>
        <MuiLink component={Link} to={ROUTES.REGISTER}
          sx={{
              fontWeight: 700,
              textDecoration: 'none',
              color: 'black',
          }}
        >
          Нет аккаунта? Зарегистрироваться
        </MuiLink>
      </Box>
    </Container>
  )
}

export default Login