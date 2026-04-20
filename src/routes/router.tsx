import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { AuthLayout } from '../layouts/AuthLayout'
import { ProfileLayout } from '../layouts/ProfileLayout'
import { ROUTES } from './routes'

// Ленивая загрузка страниц
const Feed = lazy(() => import('../pages/Feed/Feed'))
const Login = lazy(() => import('../pages/Login/Login'))
const Register = lazy(() => import('../pages/Register/Register'))
const Profile = lazy(() => import('../pages/Profile/Profile'))
const Animals = lazy(() => import('../pages/Animals/Animals'))
const MyTasks = lazy(() => import('../pages/MyTasks/MyTasks'))
const TasksFeed = lazy(() => import('../pages/TasksFeed/TasksFeed'))
const Organizations = lazy(() => import('../pages/Organizations/Organizations'))
const Calendar = lazy(() => import('../pages/Calendar/Calendar'))
const Chat = lazy(() => import('../pages/Chat/Chat'))

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
    path: ROUTES.FEED,
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
        element: <AuthLayout />,
        children: [
          { path: ROUTES.LOGIN, element: withSuspense(Login) },
          { path: ROUTES.REGISTER, element: withSuspense(Register) },
        ],
      },
    ],
  },

  {
    element: <ProfileLayout />,
    children: [
      {
        children: [
          { path: '/profile/:userId?', element: withSuspense(Profile) },
          { path: ROUTES.ANIMALS, element: withSuspense(Animals) },
          { path: ROUTES.MYTASKS, element: withSuspense(MyTasks) },
          { path: ROUTES.TASKSFEED, element: withSuspense(TasksFeed) },
          { path: ROUTES.ORGANIZATIONS, element: withSuspense(Organizations) },
          { path: ROUTES.CALENDAR, element: withSuspense(Calendar) },
          { path: ROUTES.CHAT, element: withSuspense(Chat) },
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