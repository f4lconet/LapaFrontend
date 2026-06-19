// pages/Chat/Chat.tsx
import { Box, Alert, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useAuthStore } from '../../services/stores/useAuthStore'
import { useChatPresenter } from '../../presenters/useChatPresenter'
import { ChatList } from '../../components/chat/ChatList'
import { ChatMessages } from '../../components/chat/ChatMessages'
import './Chat.scss'
import { BurgerMenu } from '../../components/navigation/BurgerMenu'

export default function Chat() {
  const { user } = useAuthStore()
  const [searchParams] = useSearchParams()
  const { createChat, loadChats, chooseChat, chats, currentChat, error, clearError } = useChatPresenter()
  const initRef = useRef(false)
  const creatingChatRef = useRef(false)
  
  // State for mobile view toggle
  const [showChatList, setShowChatList] = useState(true)

  // Load chats on mount - только один раз
  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true
      console.log('Loading chats on mount...')
      loadChats()
    }
  }, [loadChats])

  // Initialize chat with userId parameter
  useEffect(() => {
    const userId = searchParams.get('userId')
    
    if (!userId || !user || creatingChatRef.current) {
      return
    }

    // Проверяем, есть ли уже чат в списке
    const existingChat = chats.find((chat) => {
      return (chat.user_1_id === userId && chat.user_2_id === user.id) ||
             (chat.user_1_id === user.id && chat.user_2_id === userId)
    })

    if (existingChat) {
      console.log('Found existing chat:', existingChat.id)
      chooseChat(existingChat)
      setShowChatList(false)
      return
    }

    // Если чата нет в списке, но у нас уже есть currentChat с этим пользователем
    if (currentChat) {
      const isSameChat = (currentChat.user_1_id === userId && currentChat.user_2_id === user.id) ||
                         (currentChat.user_1_id === user.id && currentChat.user_2_id === userId)
      if (isSameChat) {
        setShowChatList(false)
        return
      }
    }

    // Создаем новый чат
    const initializeChat = async () => {
      creatingChatRef.current = true
      try {
        console.log('Creating new chat with user:', userId)
        const result = await createChat({ user_id: userId })
        
        if (result.success && result.data) {
          console.log('Chat created successfully:', result.data.id)
          setShowChatList(false)
        } else {
          console.error('Failed to create chat:', result.error)
          await loadChats()
        }
      } catch (err) {
        console.error('Error during chat initialization:', err)
      } finally {
        creatingChatRef.current = false
      }
    }

    initializeChat()
  }, [searchParams, user, chats, currentChat, createChat, chooseChat, loadChats])

  // Обновляем видимость при выборе чата
  useEffect(() => {
    if (currentChat) {
      setShowChatList(false)
    }
  }, [currentChat?.id])

  const handleChatSelect = () => {
    setShowChatList(false)
  }

  const handleBackToList = () => {
    setShowChatList(true)
  }

  return (
    <Box sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, px: { xs: 1, sm: 2, md: 3 }, pt: { xs: 1, sm: 2, md: 2 } }}>
        <BurgerMenu />
      </Box>
      
      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2, mx: { xs: 1, sm: 2, md: 3 } }}>
          Ошибка при работе с чатом: {error}
        </Alert>
      )}

      {!showChatList && currentChat && (
        <Box 
          className="mobile-back-button"
          onClick={handleBackToList}
          sx={{ display: { xs: 'flex', md: 'none' } }}
        >
          <ArrowBackIcon fontSize="small" />
          <Typography variant="body2">К списку чатов</Typography>
        </Box>
      )}

      <Box className="chat-container">
        <Box sx={{ 
          display: { 
            xs: showChatList ? 'flex' : 'none', 
            md: 'flex' 
          }
        }}>
          <ChatList onChatSelect={handleChatSelect} />
        </Box>
        
        <Box sx={{ 
          display: { 
            xs: !showChatList ? 'flex' : 'none', 
            md: 'flex' 
          },
          flex: 1
        }}>
          <ChatMessages currentUserId={user?.id} />
        </Box>
      </Box>
    </Box>
  )
}