import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgba(93, 75, 216, 1)', // Основной фиолетовый
      light: 'rgba(123, 105, 246, 1)',
      dark: 'rgba(63, 45, 186, 1)',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: 'rgba(122, 0, 118, 1)', // Вторичный пурпурный
      light: 'rgba(152, 30, 148, 1)',
      dark: 'rgba(92, 0, 88, 1)',
      contrastText: '#FFFFFF',
    },
    background: {
      paper: '#FFFFFF',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: 48,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: 24,
      fontWeight: 700,
    },
    body1: {
      fontSize: 16,
    },
    body2: {
      fontSize: 14,
    },
    caption: {
      fontSize: 12,
    },
  },
  shape: {
    borderRadius: 20, // Глобальный border-radius
  },
  components: {
    MuiCssBaseline: {
        styleOverrides: {
        body: {
            scrollbarColor: 'rgba(93, 75, 216, 0.3) #F5F5F5',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
            width: '8px',
            backgroundColor: '#F5F5F5',
            },
            '&::-webkit-scrollbar-track': {
            backgroundColor: '#F5F5F5',
            },
            '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(93, 75, 216, 0.3)',
            borderRadius: '4px',
            },
        },
        },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Убираем uppercase
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
});

export default theme;