import { Box, List, ListItem, ListItemButton, Avatar, Typography, CircularProgress, Alert, Divider, Card } from '@mui/material'
import { useChatPresenter } from '../../presenters/useChatPresenter'
import { useAuthStore } from '../../services/stores/useAuthStore'
import type { Chat } from '../../models/chat.model'
import '../../pages/Chat/Chat.scss'

interface ChatListProps {
  onChatSelect?: () => void
}

export const ChatList = ({ onChatSelect }: ChatListProps) => {
  const { chats, currentChat, isLoading, error, chooseChat, clearError } = useChatPresenter()
  const { user } = useAuthStore()

  // Удаляем дубликаты по id
  const uniqueChats = Array.from(
    new Map(chats.map(chat => [chat.id, chat])).values()
  )

  const getSortedChats = () => {
    return [...uniqueChats].sort((a, b) => {
      const timeA = new Date(a.last_message_at).getTime()
      const timeB = new Date(b.last_message_at).getTime()
      return timeB - timeA
    })
  }

  const getOtherUser = (chat: Chat) => {
    return chat.user_1_id === user?.id ? chat.user_2 : chat.user_1
  }

  const getLastMessagePreview = (chat: Chat) => {
    if (!chat.last_message) return 'Сообщения отсутствуют'
    const isOwn = chat.last_message.sender_id === user?.id
    const prefix = isOwn ? 'Вы: ' : ''
    return prefix + (chat.last_message.content.length > 50
      ? chat.last_message.content.substring(0, 50) + '...'
      : chat.last_message.content)
  }

  return (
    <Card 
      className="chat-list" 
      sx={{
        border:'1px solid black', 
        borderRadius: { xs: '12px', sm: '16px', md: '20px' }, 
        backgroundColor: 'rgba(248, 247, 255, 1)', 
        maxHeight: { xs: '400px', sm: '500px', md: '700px' },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: { xs: 1, sm: 1.5, md: 2 }}}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '16px', sm: '18px', md: '20px' }
          }}
        >
          Чаты
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" onClose={clearError} sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : chats.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Список чатов пуст
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {getSortedChats().map((chat, index) => {
            const otherUser = getOtherUser(chat)
            const isSelected = currentChat?.id === chat.id

            return (
              <Box key={chat.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      chooseChat(chat)
                      onChatSelect?.()
                    }}
                    selected={isSelected}
                    sx={{
                      p: { xs: 1, sm: 1.5, md: 2 },
                      backgroundColor: isSelected ? '#f5f5f5' : 'transparent',
                      '&:hover': {
                        backgroundColor: '#fafafa',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#f5f5f5',
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                        },
                      },
                    }}
                  >
                    <Avatar
                      src={otherUser.avatar_url}
                      alt={otherUser.name}
                      sx={{ 
                        mr: { xs: 1, sm: 1.5, md: 2 }, 
                        width: { xs: 36, sm: 40, md: 48 }, 
                        height: { xs: 36, sm: 40, md: 48 } 
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          whiteSpace: 'nowrap',
                          fontSize: { xs: '13px', sm: '14px', md: '15px' }
                        }}
                      >
                        {otherUser.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: { xs: '11px', sm: '12px', md: '13px' }
                        }}
                      >
                        {getLastMessagePreview(chat)}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.disabled', 
                          fontSize: { xs: '9px', sm: '10px', md: '11px' }
                        }}
                      >
                        {new Date(chat.last_message_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
                {index < chats.length - 1 && <Divider sx={{ m: 0 }} />}
              </Box>
            )
          })}
        </List>
      )}
    </Card>
  )
}