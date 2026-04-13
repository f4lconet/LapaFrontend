import { Outlet } from 'react-router-dom'
import { Box, Container} from '@mui/material'

export const ProfileLayout = () => {
  return (
    <Box className="profile-layout"
    >
      <Container 
        maxWidth="xl" 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
        }}
      >
        <Outlet />
      </Container>
    </Box>
  )
}