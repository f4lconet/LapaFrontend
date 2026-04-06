export const ROUTES = {
  // Публичные маршруты
  FEED: '/',

  // Аутентификация
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
} as const

// Группы маршрутов для проверок
export const PUBLIC_ROUTES = [
  ROUTES.FEED,

  ROUTES.LOGIN,
  ROUTES.REGISTER,
]

export const PROTECTED_ROUTES = [

]

export const ADMIN_ROUTES = [

]