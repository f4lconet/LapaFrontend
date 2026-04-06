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
  MenuItem,
  Stack,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

// Схема валидации
const registerSchema = z.object({
  email: z.string().email('Введите корректный email').min(1, 'Email обязателен'),
  password: z
    .string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
    .regex(
      /[!@#$%^&*()_+\-=[\]{};':"\\|<>?,./`~]/,
      'Пароль должен содержать хотя бы один специальный символ'
    ),
  role: z.enum(['user', 'volunteer', 'curator', 'admin']),
  name: z.string().min(2, 'Должно быть не менее 2 символов').max(50, 'Должно быть не более 50 символов'),
  confirmPassword: z.string().min(1, 'Подтвердите пароль'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

type RegisterFormValues = z.infer<typeof registerSchema>

// Доступные роли
const roles = [
  { value: 'user', label: 'Пользователь' },
  { value: 'volunteer', label: 'Волонтёр' },
  { value: 'curator', label: 'Куратор' },
  { value: 'admin', label: 'Администратор' },
]

interface RegisterFormProps {
  onSubmit: (data: Omit<RegisterFormValues, 'confirmPassword'>) => Promise<void>
  isLoading?: boolean
  error?: string | null
  onClearError?: () => void
}

export const RegisterForm = ({
  onSubmit,
  isLoading = false,
  error,
  onClearError,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

   // Общие стили для всех полей
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
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'user',
      name: '',
      confirmPassword: '',
    },
  })

  const handleFormSubmit = async (data: RegisterFormValues) => {
    const { confirmPassword, ...submitData } = data
    await onSubmit(submitData)
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
        {/* Email поле */}
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
        
        {/* Имя поле */}
        <TextField
          fullWidth
          label="Имя"
          placeholder="Введите ваше имя"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          disabled={isLoading}
          sx={textFieldSx}
        />
        
        {/* Роль (select) */}
        <TextField
          fullWidth
          select
          label="Роль"
          {...register('role')}
          error={!!errors.role}
          helperText={errors.role?.message}
          disabled={isLoading}
          sx={textFieldSx}
        >
          {roles.map((role) => (
            <MenuItem key={role.value} value={role.value}>
              {role.label}
            </MenuItem>
          ))}
        </TextField>
        
        {/* Пароль поле*/}
        <TextField
          fullWidth
          label="Пароль"
          type={showPassword ? 'text' : 'password'}
          placeholder="Придумайте пароль"
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
            },
          }}
        />
        
        {/* Подтверждение пароля */}
        <TextField
          fullWidth
          label="Подтвердите пароль"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Повторите пароль"
          {...register('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          disabled={isLoading}
          sx={textFieldSx}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        
        {/* Кнопка регистрации */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          size="large"
          sx={{ mt: 1, py: 1.5, backgroundColor: 'rgba(230, 226, 255, 1)', color: 'rgba(0,0,0,1)', borderRadius: '34px', fontSize: '20px', fontWeight: '700' }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Зарегистрироваться'}
        </Button>
      </Stack>
    </Box>
  )
}