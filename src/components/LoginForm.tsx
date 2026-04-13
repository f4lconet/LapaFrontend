import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Stack,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

// Схема валидации для логина
const loginSchema = z.object({
  email: z.email('Введите корректный email').min(1, 'Email обязателен'),
  password: z.string().min(1, 'Пароль обязателен'),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => Promise<void>
  isLoading?: boolean
  error?: string | null
  onClearError?: () => void
}

export const LoginForm = ({
  onSubmit,
  isLoading = false,
  error,
  onClearError,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  
  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      color: 'black',
      backgroundColor: 'rgba(230, 226, 255, 1)',
      borderRadius: '12px',
      '& fieldset': {
        border: 'none',
      },
      '&:hover fieldset': {
        border: 'none',
      },
      '&.Mui-focused fieldset': {
        border: 'none',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(0, 0, 0, 1)',
      '&.Mui-focused': {
        color: 'rgba(0, 0, 0, 1)',
      },
    },
    '& .MuiInputBase-input': {
      color: 'black',
    },
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleFormSubmit = async (data: LoginFormValues) => {
    await onSubmit(data)
  }

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={onClearError}
        >
          {error}
        </Alert>
      )}
      
      <Stack spacing={2.5}>
        <TextField
          fullWidth
          label="Эл. почта"
          type="email"
          placeholder="user@example.com"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={isLoading}
          sx={textFieldSx}
        />
        
        <TextField
          fullWidth
          label="Пароль"
          type={showPassword ? 'text' : 'password'}
          placeholder="Введите пароль"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={isLoading}
          sx={textFieldSx}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          }}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          size="large"
          sx={{ mt: 1, py: 1.5, backgroundColor: 'rgba(230, 226, 255, 1)', color: 'rgba(0,0,0,1)', borderRadius: '34px', fontSize: '20px', fontWeight: '700' }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={24} sx={{ position: 'absolute' }} />
              Вход...
            </>
          ) : (
            'Войти'
          )}
        </Button>
      </Stack>
    </Box>
  )
}