import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../api/auth.service'
import type { 
  RegisterRequest, 
  RegisterResponse,
  LoginRequest,
  AuthState 
} from '../../models/user.model'

interface AuthStore extends AuthState {
  // Actions
  register: (data: RegisterRequest) => Promise<RegisterResponse>
  login: (data: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
  clearRegistrationMessage: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isInitializing: true,
      isLoading: false,
      error: null,
      registrationMessage: null,
      
      // Регистрация
      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null, registrationMessage: null })
        
        try {
          const response = await authService.register(data)
          
          // Сохраняем сообщение от API
          set({
            registrationMessage: response.message,
            isLoading: false,
          })
          
          // Если isActive true, можно сразу авторизовать
          if (response.isActive) {
            set({
              user: {
                id: response.userId,
                email: response.email,
                name: data.name,
                role: data.role,
                isActive: response.isActive,

                description: '',
                phone: '',
                locationText: '',
                locationLat: 0,
                locationLng: 0,
                radiusPref: 0,
                isUrgentAvailable: false,
                avatarUrl: '',
              },
              isAuthenticated: true,
            })
          }
          
          return response
        } catch (error: any) {
          // Обработка validation error (422)
          let errorMessage = 'Ошибка при регистрации'
          
          if (error.response?.status === 422) {
            const validationError = error.response.data
            if (validationError.detail) {
              errorMessage = validationError.detail
                .map((err: any) => err.msg)
                .join(', ')
            }
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw error
        }
      },
      
      // Логин
      login: async (data: LoginRequest) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authService.login(data)

          localStorage.setItem('accessToken', response.accessToken)
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken)
          }

          await new Promise(resolve => setTimeout(resolve, 100))

          const user = await authService.getCurrentUser()

          set({
            user,
            isAuthenticated: response.isActive,
            isInitializing: false,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          const message = error.response?.data?.message || 'Ошибка при входе'
          set({
            error: message,
            isLoading: false,
          })
          throw error
        }
      },
      
      // Выход
      logout: async () => {
        set({ isLoading: true })
        try {
          await authService.logout()
        } catch {
          // ignore logout errors, still clear client state
        }

        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({
          user: null,
          isAuthenticated: false,
          isInitializing: false,
          isLoading: false,
          error: null,
          registrationMessage: null,
        })
      },
      
      // Проверка авторизации
      checkAuth: async () => {
        set({ isLoading: true })
        const token = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')

        if (!token && !refreshToken) {
          set({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
            isLoading: false,
          })
          return
        }

        try {
          const user = await authService.getCurrentUser()
          set({
            user,
            isAuthenticated: true,
            isInitializing: false,
            isLoading: false,
          })
          return
        } catch {
          if (refreshToken) {
            try {
              const refreshResponse = await authService.refreshToken(refreshToken)
              localStorage.setItem('accessToken', refreshResponse.accessToken)
              if (refreshResponse.refreshToken) {
                localStorage.setItem('refreshToken', refreshResponse.refreshToken)
              }
              const user = await authService.getCurrentUser()
              set({
                user,
                isAuthenticated: true,
                isInitializing: false,
                isLoading: false,
              })
              return
            } catch {
              // refresh failed, fall through to logout state
            }
          }

          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          set({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
            isLoading: false,
          })
        }
      },
      
      // Очистка ошибки
      clearError: () => set({ error: null }),
      
      // Очистка сообщения о регистрации
      clearRegistrationMessage: () => set({ registrationMessage: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
)