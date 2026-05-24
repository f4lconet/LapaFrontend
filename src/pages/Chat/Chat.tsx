import { Box, Alert, CircularProgress } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../services/stores/useAuthStore'
import { useChatPresenter } from '../../presenters/useChatPresenter'
import { ChatList } from '../../components/chat/ChatList'
import { ChatMessages } from '../../components/chat/ChatMessages'
import './Chat.scss'
import { BurgerMenu } from '../../components/navigation/BurgerMenu'

export default function Chat() {
  const { user } = useAuthStore()
  const [searchParams] = useSearchParams()
  const { createChat, loadChats, chooseChat, chats, currentChat, error, clearError, isLoading } = useChatPresenter()
  const initRef = useRef(false)

  // Load chats on mount
  useEffect(() => {
    if (!initRef.current && chats.length === 0) {
      loadChats()
    }
  }, [chats.length, loadChats])

  // Initialize chat with userId parameter
  useEffect(() => {
    const userId = searchParams.get('userId')
    
    // Skip if:
    // - No userId in URL
    // - No current user
    // - We already have a current chat selected
    // - Already tried to initialize
    if (!userId || !user || currentChat || initRef.current) {
      return
    }

    initRef.current = true

    const initializeChat = async () => {
      try {
        console.log('Chat initialization started')
        console.log('Current user ID:', user.id)
        console.log('Target user ID:', userId)
        console.log('Existing chats count:', chats.length)
        
        // Check if chat already exists
        const existingChat = chats.find((chat) => {
          const isMatch = (chat.user_1_id === userId && chat.user_2_id === user.id) ||
                          (chat.user_1_id === user.id && chat.user_2_id === userId)
          if (isMatch) {
            console.log('Found matching chat:', chat.id)
          }
          return isMatch
        })

        if (existingChat) {
          console.log('Using existing chat:', existingChat.id)
          chooseChat(existingChat)
          return
        }

        // Reload chats to ensure we have latest list
        console.log('No matching chat found, reloading chat list...')
        await loadChats()

        // Try to find again after reload
        const reloadedChat = chats.find((chat) => {
          return (chat.user_1_id === userId && chat.user_2_id === user.id) ||
                 (chat.user_1_id === user.id && chat.user_2_id === userId)
        })

        if (reloadedChat) {
          console.log('Found chat after reload:', reloadedChat.id)
          chooseChat(reloadedChat)
          return
        }

        // Create new chat
        console.log('Creating new chat with user:', userId)
        const result = await createChat({ user_id: userId })
        
        if (result.success && result.data) {
          console.log('Chat created successfully:', result.data.id)
          chooseChat(result.data)
        } else {
          console.error('Failed to create chat:', result.error)
          // Reload one more time in case it was created
          await loadChats()
        }
      } catch (err) {
        console.error('Error during chat initialization:', err)
      }
    }

    initializeChat()
  }, [searchParams, user, chats, currentChat, createChat, loadChats, chooseChat])

  return (
    <Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <BurgerMenu />
        </Box>
        
        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
            Ошибка при работе с чатом: {error}
          </Alert>
        )}

        {isLoading && chats.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3, mb: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        <Box className="chat-container" sx={{display: 'flex', gap: '30px'}}>
            <ChatList />
            <ChatMessages currentUserId={user?.id} />
        </Box>
    </Box>
  )
}
