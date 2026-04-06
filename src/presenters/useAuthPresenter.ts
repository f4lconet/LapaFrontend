import { useCallback } from 'react'
import { useAuthStore } from '../services/stores/useAuthStore'
import type { RegisterRequest, LoginRequest } from '../models/user.model'

export const useAuthPresenter = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    registrationMessage,
    register: storeRegister,
    login: storeLogin,
    logout: storeLogout,
    checkAuth,
    clearError,
    clearRegistrationMessage,
  } = useAuthStore()
  
  // Регистрация
  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        const response = await storeRegister(data)
        return { success: true, data: response }
      } catch (error) {
        return { success: false, error }
      }
    },
    [storeRegister]
  )
  
  // Логин
  const login = useCallback(
    async (data: LoginRequest) => {
      try {
        await storeLogin(data)
        return { success: true }
      } catch (error) {
        return { success: false, error }
      }
    },
    [storeLogin]
  )
  
  // Выход
  const logout = useCallback(async () => {
    await storeLogout()
  }, [storeLogout])
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    registrationMessage,
    register,
    login,
    logout,
    checkAuth,
    clearError,
    clearRegistrationMessage,
  }
}