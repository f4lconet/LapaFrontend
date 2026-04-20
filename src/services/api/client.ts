import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_BASE_URL

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface FailedRequest {
    resolve: (value?: unknown) => void
    reject: (error: any) => void
}

let isRefreshing = false
const failedQueue: FailedRequest[] = []

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue.length = 0
}

const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
        throw new Error('Refresh token missing')
    }

    const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refresh_token: refreshToken },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )

    const backendData = response.data
    const accessToken = backendData.access_token || backendData.accessToken
    const newRefreshToken = backendData.refresh_token || backendData.refreshToken

    if (!accessToken) {
        throw new Error('Bad refresh response')
    }

    localStorage.setItem('accessToken', accessToken)
    if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken)
    }

    return accessToken
}

const clearAuthStorage = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('auth-storage')
}

// Интерцептор для добавления токена
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true

            if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
                clearAuthStorage()
                window.location.href = '/login'
                return Promise.reject(error)
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        if (token && originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`
                        }
                        return apiClient(originalRequest)
                    })
                    .catch((err) => Promise.reject(err))
            }

            isRefreshing = true

            try {
                const accessToken = await refreshAccessToken()
                processQueue(null, accessToken)
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                }
                return apiClient(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                clearAuthStorage()
                window.location.href = '/login'
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)