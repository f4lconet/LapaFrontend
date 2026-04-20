import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000'

class WebSocketService {
  private socket: Socket | null = null
  private listeners: Map<string, Set<Function>> = new Map()

  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const options = {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          ...(token && { auth: { token } }),
        }

        this.socket = io(SOCKET_URL, options)

        this.socket.on('connect', () => {
          console.log('WebSocket connected')
          resolve()
        })

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error)
          reject(error)
        })

        this.socket.on('disconnect', (reason) => {
          console.log('WebSocket disconnected:', reason)
        })

        this.socket.on('error', (error) => {
          console.error('WebSocket error:', error)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.listeners.clear()
  }

  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn(`Socket not connected, cannot emit ${event}`)
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    this.listeners.get(event)!.add(callback)

    if (this.socket) {
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

  getSocket(): Socket | null {
    return this.socket
  }
}

export const webSocketService = new WebSocketService()
