import { useEffect, useRef, useState } from 'react'
import { Box, Avatar, Typography, TextField, IconButton, CircularProgress, Alert } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useChatPresenter } from '../../presenters/useChatPresenter'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes/routes'
import '../../pages/Chat/Chat.scss'

interface ChatMessagesProps {
  currentUserId?: string
}

export const ChatMessages = ({ currentUserId }: ChatMessagesProps) => {
  const { currentChat, messages, isLoading, error, connectToChat, disconnectFromChat, sendMessage, clearError } = useChatPresenter()
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messageText, setMessageText] = useState('')  // Используем state вместо ref
  const [isSending, setIsSending] = useState(false)

  // Get the other user in the chat
  const otherUser = currentChat
    ? currentChat.user_1_id === currentUserId
      ? currentChat.user_2
      : currentChat.user_1
    : null

  // Connect to chat room when chat changes
  useEffect(() => {
    if (currentChat?.id) {
      console.log('Connecting to chat:', currentChat.id)
      connectToChat(currentChat.id)
    }

    return () => {
      disconnectFromChat()
    }
  }, [currentChat?.id, connectToChat, disconnectFromChat])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    console.log('handleSendMessage called', {
      chatId: currentChat?.id,
      messageText,
      isSending
    })

    // Проверяем все условия
    if (!currentChat?.id) {
      console.error('Cannot send message: no chat selected')
      return
    }

    const content = messageText.trim()
    if (!content) {
      console.error('Cannot send message: message is empty')
      return
    }

    if (isSending) {
      console.warn('Already sending message')
      return
    }

    try {
      setIsSending(true)
      console.log('Sending message:', content)
      await sendMessage(currentChat.id, { content })
      setMessageText('') // Очищаем поле после отправки
      console.log('Message sent successfully')
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const navigateToProfile = () => {
    if (otherUser?.id) {
      navigate(`${ROUTES.PROFILE}/${otherUser.id}`)
    }
  }

  if (!currentChat) {
    return (
      <Box sx={{
        borderRadius: { xs: '12px', sm: '16px', md: '20px' }, 
        backgroundColor:'rgba(248, 247, 255, 1)', 
        maxHeight: { xs: '400px', sm: '500px', md: '700px' }, 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        p: { xs: 1.5, sm: 2 }
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            fontSize: { xs: '14px', sm: '16px', md: '18px' }
          }}
        >
          Для начала переписки выберите чат из списка
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="chat-messages" sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      width: '100%',
      maxHeight: { xs: '400px', sm: '500px', md: '700px' },  // ← как у ChatList
      borderRadius: { xs: '12px', sm: '16px', md: '20px' },
      backgroundColor: 'rgba(248, 247, 255, 1)',
      border: '1px solid black'
    }}>
      {/* Chat Header */}
      <Box className="chat-header" sx={{ 
        p: { xs: 1, sm: 1.5, md: 2 }, 
        borderBottom: '1px solid #e0e0e0' 
      }}>
        <Box 
          className="chat-header-content" 
          onClick={navigateToProfile} 
          sx={{ 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 1.5, md: 2 }
          }}
        >
          <Avatar
            src={otherUser?.avatar_url}
            alt={otherUser?.name}
            sx={{ 
              width: { xs: 32, sm: 36, md: 40 }, 
              height: { xs: 32, sm: 36, md: 40 } 
            }}
          />
          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '14px', sm: '15px', md: '16px' }
              }}
            >
              {otherUser?.name}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: { xs: '11px', sm: '12px', md: '13px' }
              }}
            >
              {otherUser?.role}
            </Typography>
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          onClose={clearError} 
          sx={{ 
            m: { xs: 1, sm: 1.5, md: 2 },
            fontSize: { xs: '12px', sm: '13px', md: '14px' }
          }}
        >
          {error}
        </Alert>
      )}

      {/* Messages Container */}
      <Box 
        className="messages-container" 
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: { xs: 1, sm: 1.5, md: 2 }, 
          minHeight: { xs: '250px', sm: '350px', md: '400px' }, 
          maxHeight: { xs: '350px', sm: '450px', md: '500px' }
        }}
      >
        {isLoading && messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Нет сообщений. Начните диалог!
            </Typography>
          </Box>
        ) : (
          messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.sender_id === currentUserId ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Box
                sx={{
                  maxWidth: '70%',
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: message.sender_id === currentUserId ? '#6366f1' : '#f0f0f0',
                  color: message.sender_id === currentUserId ? 'white' : 'black'
                }}
              >
                <Typography variant="body2">{message.content}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem', display: 'block', mt: 0.5 }}>
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box className="message-input-container" sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Напишите сообщение..."
          variant="outlined"
          size="small"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSending}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
            },
          }}
        />
        <IconButton
          onClick={handleSendMessage}
          disabled={isSending || !messageText.trim()}
          sx={{
            color: '#6366f1',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
            },
          }}
        >
          {isSending ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Box>
  )
}