import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { AuthLayout } from '../layouts/AuthLayout'

// Ленивая загрузка страниц
const Feed = lazy(() => import('../pages/Feed/Feed'))
const Login = lazy(() => import('../pages/Login/Login'))
const Register = lazy(() => import('../pages/Register/Register'))

// Обёртка для lazy loading
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
// показывает запасной UI(fallback), пока загружается основной контент
  <Suspense fallback={<div>Загрузка...</div>}>
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  // Публичные маршруты с основным лейаутом
  {
    path: '/',
    // element: <MainLayout />,
    children: [
      { index: true, element: withSuspense(Feed) },
    //   { path: 'login', element: withSuspense(Login) },
    ],
  },
  
  // Маршруты аутентификации (отдельный лейаут)
  {
    // element: <PublicRoute />,
    children: [
      {
        path: '/auth',
        element: <AuthLayout />,
        children: [
          { path: 'login', element: withSuspense(Login) },
          { path: 'register', element: withSuspense(Register) },
        ],
      },
    ],
  },
  
//   // Приватные маршруты (требуют авторизации)
//   {
//     element: <PrivateRoute />,
//     children: [
//       {
//         element: <MainLayout />,
//         children: [
//           { path: 'dashboard', element: withSuspense(Dashboard) },
//         ],
//       },
//     ],
//   },
  
//   // Админские маршруты (требуют роль admin)
//   {
//     element: <PrivateRoute roles={['admin']} />,
//     children: [
//       {
//         element: <AdminLayout />,
//         children: [
//           { path: 'admin/users', element: withSuspense(AdminUsers) },
//         ],
//       },
//     ],
//   },
  
//   // 404 - не найдено
//   {
//     path: '*',
//     element: withSuspense(NotFound),
//   },
])