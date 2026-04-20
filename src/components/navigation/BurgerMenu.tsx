import { useState } from 'react'
import { IconButton, Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material'
import { Home as HomeIcon, Person as PersonIcon, Share as ShareIcon, Logout as LogoutIcon, Task, Pets, Feed, Work, CalendarMonth, Chat } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../../routes/routes'
import OpenDrawerIcon from '../../assets/images/drawer-open-button.svg?react'
import CloseDrawerIcon from '../../assets/images/drawer-close-button.svg?react'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
}

interface BurgerMenuProps {
  onShare?: () => void
  onLogout?: () => void
}

const navItems: NavItem[] = [
  { path: ROUTES.FEED, label: 'Главная', icon: <HomeIcon /> },
  { path: ROUTES.PROFILE, label: 'Профиль', icon: <PersonIcon /> },
  { path: ROUTES.ANIMALS, label: 'Животные', icon: <Pets /> },
  { path: ROUTES.MYTASKS, label: 'Мои задачи', icon: <Task /> },
  { path: ROUTES.TASKSFEED, label: 'Лента задач', icon: <Feed /> },
  { path: ROUTES.ORGANIZATIONS, label: 'Организации', icon: <Work /> },
  { path: ROUTES.CALENDAR, label: 'Календарь', icon: <CalendarMonth/> },
  { path: ROUTES.CHAT, label: 'Чаты', icon: <Chat/> },
]

export const BurgerMenu = ({ onShare, onLogout }: BurgerMenuProps) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    handleClose()
  }

  const handleShare = () => {
    if (onShare) {
      onShare()
      handleClose()
    }
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
      handleClose()
    }
  }

  // Проверка активности пути
  const isPathActive = (path: string) => {
    if (path === ROUTES.PROFILE) {
      return location.pathname === ROUTES.PROFILE || location.pathname.startsWith('/profile/')
    }
    return location.pathname === path
  }

  return (
    <>
      {/* Кнопка-бургер */}
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 48,
          height: 48,
          bgcolor: 'background.paper',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            transform: 'scale(1.05)',
          },
        }}
      >
        <OpenDrawerIcon />
      </IconButton>

      {/* Drawer (выезжающая панель) */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        ModalProps={{
          keepMounted: true,
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }
          },
          paper: {
            sx: {
              width: 321,
              height: 620,
              top: 0,
              right: 0,
              bottom: 'auto',
              left: 'auto',
              borderRadius: '0 0 0 16px',
              boxShadow: 3,
              bgcolor: 'rgba(93, 75, 216, 1)',
              color: '#ffffff',
              border: '1px solid black'
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Кнопка закрытия внутри Drawer'а */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={handleClose} size="small" sx={{ color: '#ffffff' }}>
              <CloseDrawerIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
          
          <List>
            {navItems.map((item) => {
              const isActive = isPathActive(item.path)
              
              return (
                <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    selected={isActive}
                    sx={{
                      borderRadius: 2,
                      color: '#ffffff',
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: '#ffffff',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                        },
                        '& .MuiListItemIcon-root': {
                          color: '#ffffff',
                        },
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: '#ffffff' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: isActive ? 600 : 400,
                          color: '#ffffff',
                        }}
                      >
                        {item.label}
                      </Typography>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              )
            })}
            
            {/* Дополнительные пункты меню для публичного профиля */}
            {onShare && (
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={handleShare}
                  sx={{
                    borderRadius: 2,
                    color: '#ffffff',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: '#ffffff' }}>
                    <ShareIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body1" sx={{ color: '#ffffff' }}>
                      Поделиться
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            )}
            
            {onLogout && (
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    color: '#ffffff',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: '#ffffff' }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body1" sx={{ color: '#ffffff' }}>
                      Выйти
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  )
}