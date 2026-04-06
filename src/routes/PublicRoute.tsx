// import { Navigate, Outlet } from 'react-router-dom'
// import { useAuthStore } from '@/services/stores/useAuthStore'
// import { ROUTES } from './routes'

// interface PublicRouteProps {
//   redirectTo?: string
// }

// export const PublicRoute = ({ redirectTo = ROUTES.HOME }: PublicRouteProps) => {
//   const { isAuthenticated } = useAuthStore()
  
//   // Если авторизован, перенаправляем на главную
//   if (isAuthenticated) {
//     return <Navigate to={redirectTo} replace />
//   }
  
//   return <Outlet />
// }