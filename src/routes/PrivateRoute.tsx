// import { Navigate, Outlet } from 'react-router-dom'
// import { useAuthStore } from '@/services/stores/useAuthStore'
// import { ROUTES } from './routes'

// interface PrivateRouteProps {
//   redirectTo?: string
//   roles?: ('admin' | 'manager' | 'user')[]
// }

// export const PrivateRoute = ({ 
//   redirectTo = ROUTES.LOGIN, 
//   roles = [] 
// }: PrivateRouteProps) => {
//   const { isAuthenticated, user } = useAuthStore()
  
//   // Не авторизован
//   if (!isAuthenticated) {
//     return <Navigate to={redirectTo} replace />
//   }
  
//   // Проверка роли
//   if (roles.length > 0 && user && !roles.includes(user.role)) {
//     return <Navigate to={ROUTES.DASHBOARD} replace />
//   }
  
//   return <Outlet />
// }