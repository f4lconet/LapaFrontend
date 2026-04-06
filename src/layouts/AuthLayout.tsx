import { Outlet } from 'react-router-dom'
import { Box, Container} from '@mui/material'
import './AuthLayout.scss'

export const AuthLayout = () => {
  return (
    <Box className="auth-layout"
    >
      <Container 
        maxWidth="sm" 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          marginRight: { xs: 'auto', md: '15%' },
          marginLeft: { xs: 'auto', md: 'auto' }
        }}>
          <Outlet />
      </Container>
    </Box>
  )
}