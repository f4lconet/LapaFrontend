import { Box } from '@mui/material'
import { useAuthStore } from '../../services/stores/useAuthStore'
import { ChatList } from './ChatList'
import { ChatMessages } from './ChatMessages'
import './Chat.scss'
import { BurgerMenu } from '../../components/navigation/BurgerMenu'

export default function Chat() {
  const { user } = useAuthStore()

  return (
    <Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <BurgerMenu />
        </Box>
        <Box className="chat-container" sx={{display: 'flex', gap: '30px'}}>
            <ChatList />
            <ChatMessages currentUserId={user?.id} />
        </Box>
    </Box>
  )
}
