import { useEffect, useRef } from 'react'
import { Box, Avatar, Typography, TextField, IconButton, CircularProgress, Alert, Card } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useChatPresenter } from '../../presenters/useChatPresenter'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes/routes'
import type { ChatMessage } from '../../models/chat.model'
import './Chat.scss'

interface ChatMessagesProps {
  currentUserId?: string
}

export const ChatMessages = ({ currentUserId }: ChatMessagesProps) => {
  const { currentChat, messages, isLoading, error, connectToChat, disconnectFromChat, sendMessage, clearError } = useChatPresenter()
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Get the other user in the chat
  const otherUser = currentChat
    ? currentChat.user_1_id === currentUserId
      ? currentChat.user_2
      : currentChat.user_1
    : null

  // Connect to chat room when chat changes
  useEffect(() => {
    if (currentChat?.id) {
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
    const content = inputRef.current?.value?.trim()
    if (!content || !currentChat?.id) return

    await sendMessage(currentChat.id, { content })
    if (inputRef.current) {
      inputRef.current.value = ''
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
      navigate(ROUTES.PUBLIC_PROFILE(otherUser.id))
    }
  }

  if (!currentChat) {
    return (
      <Box sx={{borderRadius: '20px', backgroundColor:'rgba(248, 247, 255, 1)', maxHeight: '700px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Для начала переписки выберите чат из списка
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="chat-messages">
      {/* Chat Header */}
      <Box className="chat-header">
        <Box className="chat-header-content" onClick={navigateToProfile} sx={{ cursor: 'pointer' }}>
          <Avatar
            src={otherUser?.avatar_url}
            alt={otherUser?.name}
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {otherUser?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {otherUser?.role}
            </Typography>
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={clearError} sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {/* Messages Container */}
      <Box className="messages-container">
        {isLoading && messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          messages.map((message) => (
            <Box
              key={message.id}
              className={`message ${message.sender_id === currentUserId ? 'sent' : 'received'}`}
            >
              <Box className="message-content">
                <Typography variant="body2">{message.content}</Typography>
                <Typography variant="caption" className="message-time">
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
      <Box className="message-input-container">
        <TextField
          ref={inputRef}
          fullWidth
          multiline
          maxRows={4}
          placeholder="Write a message..."
          variant="outlined"
          size="small"
          onKeyPress={handleKeyPress}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
            },
          }}
        />
        <IconButton
          onClick={handleSendMessage}
          disabled={isLoading}
          sx={{
            color: '#6366f1',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  )
}
