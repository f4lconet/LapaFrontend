import { Box, Alert, CircularProgress, Typography } from '@mui/material'
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
  const { createChat, loadChats, chooseChat, chats, currentChat, error, clearError, isLoading } = useChatPresenter()
  const initRef = useRef(false)
  
  // State for mobile view toggle
  const [showChatList, setShowChatList] = useState(true)

  // Load chats on mount
  useEffect(() => {
    if (!initRef.current && chats.length === 0) {
      loadChats()
    }
  }, [chats.length, loadChats])

  // Initialize chat with userId parameter
  useEffect(() => {
    const userId = searchParams.get('userId')
    
    if (!userId || !user || currentChat || initRef.current) {
      return
    }

    initRef.current = true

    const initializeChat = async () => {
      try {
        const existingChat = chats.find((chat) => {
          return (chat.user_1_id === userId && chat.user_2_id === user.id) ||
                 (chat.user_1_id === user.id && chat.user_2_id === userId)
        })

        if (existingChat) {
          chooseChat(existingChat)
          setShowChatList(false)
          return
        }

        await loadChats()

        const reloadedChat = chats.find((chat) => {
          return (chat.user_1_id === userId && chat.user_2_id === user.id) ||
                 (chat.user_1_id === user.id && chat.user_2_id === userId)
        })

        if (reloadedChat) {
          chooseChat(reloadedChat)
          setShowChatList(false)
          return
        }

        const result = await createChat({ user_id: userId })
        
        if (result.success && result.data) {
          chooseChat(result.data)
          setShowChatList(false)
        } else {
          await loadChats()
        }
      } catch (err) {
        console.error('Error during chat initialization:', err)
      }
    }

    initializeChat()
  }, [searchParams, user, chats, currentChat, createChat, loadChats, chooseChat])

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

      {isLoading && chats.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3, mb: 2 }}>
          <CircularProgress size={24} />
        </Box>
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