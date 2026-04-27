import { useEffect } from 'react'
import { webSocketService } from '../services/websocket.service'
import { useAuthStore } from '../services/stores/useAuthStore'
import { useChatStore } from '../services/stores/useChatStore'

export const useWebSocketInit = () => {
  const { user } = useAuthStore()
  const { setConnected } = useChatStore()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!user || !token) return

    // Connect to WebSocket
    webSocketService
      .connect(token)
      .then(() => {
        setConnected(true)
        console.log('WebSocket initialized successfully')

        // Listen for connection events
        const handleConnect = () => {
          setConnected(true)
        }

        const handleDisconnect = () => {
          setConnected(false)
        }

        webSocketService.on('connect', handleConnect)
        webSocketService.on('disconnect', handleDisconnect)

        // Cleanup listeners on unmount
        return () => {
          webSocketService.off('connect', handleConnect)
          webSocketService.off('disconnect', handleDisconnect)
        }
      })
      .catch((error) => {
        console.error('Failed to initialize WebSocket:', error)
        setConnected(false)
      })

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect()
    }
  }, [user, setConnected])
}

