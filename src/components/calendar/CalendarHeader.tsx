import { Box, Typography } from '@mui/material'
import { BurgerMenu } from '../navigation/BurgerMenu'

export const CalendarHeader = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: { xs: 1.5, sm: 2, md: 2 },
      flexDirection: { xs: 'row' },
      gap: { xs: 1, sm: 2 }
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 600,
          fontSize: { xs: '20px', sm: '28px', md: '32px' },
          whiteSpace: { xs: 'nowrap', sm: 'normal' },
          overflow: { xs: 'hidden', sm: 'visible' },
          textOverflow: { xs: 'ellipsis', sm: 'clip' }
        }}
      >
        Календарь мероприятий
      </Typography>
      <BurgerMenu />
    </Box>
  )
}