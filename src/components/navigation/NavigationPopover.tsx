import { useNavigate, useLocation } from 'react-router-dom'
import {
  Popover,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
} from '@mui/material'
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Close,
} from '@mui/icons-material'
import { ROUTES } from '../../routes/routes'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { path: ROUTES.FEED, label: 'Главная', icon: <HomeIcon /> },
  { path: ROUTES.PROFILE, label: 'Профиль', icon: <PersonIcon /> },
]

interface NavigationPopoverProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
}

export const NavigationPopover = ({ anchorEl, open, onClose }: NavigationPopoverProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  const isPathActive = (path: string) => {
    if (path === ROUTES.PROFILE) {
      return location.pathname === ROUTES.PROFILE || location.pathname.startsWith('/profile/')
    }
    return location.pathname === path
  }

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            width: 250,
            borderRadius: 2,
            boxShadow: 3,
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* Верхняя панель с бургером и заголовком */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1.5,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MenuIcon />
          <Typography variant="subtitle1" sx={{fontWeight: 600}}>
            Навигация
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: 'primary.contrastText' }}>
          <div>gfdgdf</div>
        </IconButton>
      </Box>
      
      <List sx={{ py: 1 }}>
        {navItems.map((item) => {
          const isActive = isPathActive(item.path)
          
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  mx: 1,
                  borderRadius: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {item.label}
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Popover>
  )
}