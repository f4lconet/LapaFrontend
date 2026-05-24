import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_BASE_URL

class WebSocketService {
  private socket: Socket | null = null
  private listeners: Map<string, Set<Function>> = new Map()
  private connectionPromise: Promise<void> | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  async connect(token?: string): Promise<void> {
    if (this.socket?.connected) {
      console.log('WebSocket already connected')
      return Promise.resolve()
    }

    if (this.connectionPromise) {
      console.log('WebSocket connection already in progress')
      return this.connectionPromise
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        const authToken = token || localStorage.getItem('accessToken')
        
        if (!authToken) {
          reject(new Error('No authentication token available'))
          return
        }

        console.log('WebSocket connecting to:')
        
        const options = {
          transports: ['polling', 'websocket'],
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
          auth: {
            token: authToken
          },
          path: '/socket.io/',
          withCredentials: true,
        }

        this.socket = io(SOCKET_URL, options)

        const timeout = setTimeout(() => {
          if (this.connectionPromise) {
            const error = new Error('WebSocket connection timeout')
            console.error(error.message)
            reject(error)
            this.connectionPromise = null
          }
        }, 15000)

        this.socket.on('connect', () => {
          clearTimeout(timeout)
          console.log('✅ WebSocket connected successfully')
          this.reconnectAttempts = 0
          this.connectionPromise = null
          resolve()
        })

        this.socket.on('connect_error', (error) => {
          clearTimeout(timeout)
          console.error('❌ WebSocket connection error:', error.message)
          
          this.reconnectAttempts++
          
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.connectionPromise = null
            reject(error)
          }
        })

        this.socket.on('disconnect', (reason) => {
          console.log('WebSocket disconnected:', reason)
          if (reason === 'io server disconnect') {
            // Сервер отключил, пробуем переподключиться
            this.socket?.connect()
          }
        })

        this.socket.on('error', (error) => {
          console.error('WebSocket error:', error)
        })

        // Прослушиваем все входящие события для отладки
        this.socket.onAny((event, ...args) => {
          console.log(`📨 Socket event received: ${event}`, args)
        })

      } catch (error) {
        console.error('Error creating WebSocket connection:', error)
        this.connectionPromise = null
        reject(error)
      }
    })

    return this.connectionPromise
  }

  disconnect(): void {
    if (this.socket) {
      console.log('Disconnecting WebSocket...')
      this.socket.removeAllListeners()
      this.socket.disconnect()
      this.socket = null
    }
    this.connectionPromise = null
    this.reconnectAttempts = 0
  }

  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      console.log(`📤 Emitting event: ${event}`, data)
      this.socket.emit(event, data)
    } else {
      console.warn(`⚠️ Socket not connected (state: ${this.socket?.connected}), cannot emit ${event}`)
      // Пробуем переподключиться
      const token = localStorage.getItem('accessToken')
      if (token && !this.connectionPromise) {
        this.connect(token).catch(console.error)
      }
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
    
    if (this.socket) {
      // Удаляем старый listener, чтобы не было дубликатов
      this.socket.off(event)
      this.socket.on(event, callback)
    }
  }

  off(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.off(event, callback)
    }

    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback)
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  getSocketId(): string | undefined {
    return this.socket?.id
  }
}

export const webSocketService = new WebSocketService()