export const ROUTES = {
  // Публичные маршруты
  FEED: '/',
  // Аутентификация
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  PUBLIC_PROFILE: (userId: string) => `/profile/${userId}`,
  ANIMALS: '/animals',
  MYTASKS: '/mytasks',
  TASKSFEED: '/taskfeed',
  ORGANIZATIONS: '/organizations',
  CALENDAR: '/calendar',
  CHAT: '/chat',
  KNOWLEDGE: '/knowledge',
} as const
