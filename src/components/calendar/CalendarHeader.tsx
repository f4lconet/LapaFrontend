import { Box, Typography } from '@mui/material'
import { BurgerMenu } from '../navigation/BurgerMenu'

export const CalendarHeader = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Календарь мероприятий
      </Typography>
      <BurgerMenu />
    </Box>
  )
}