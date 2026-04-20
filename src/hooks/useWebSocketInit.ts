import { useEffect } from 'react'
import { webSocketService } from '../services/websocket.service'
import { useAuthStore } from '../services/stores/useAuthStore'
import { useChatStore } from '../services/stores/useChatStore'

/**
 * Hook to initialize WebSocket connection on app startup
 * Should be called once in the main App component
 */
export const useWebSocketInit = () => {
  const { user, token } = useAuthStore()
  const { setConnected } = useChatStore()

  useEffect(() => {
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
  }, [user, token, setConnected])
}
