import { Container, Typography, Box, Button, Stack, Paper } from '@mui/material';
import { Add, Assignment, CheckCircle } from '@mui/icons-material';
import { BurgerMenu } from '../../components/navigation/BurgerMenu';

const MyTasksPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <BurgerMenu />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Мои задачи
        </Typography>
      </Box>

      <Stack spacing={4}>
        {/* Активные задачи */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Assignment color="primary" />
            <Typography variant="h6">
              Активные
            </Typography>
          </Box>
          
          <Box sx={{ 
            textAlign: 'center', 
            py: 6,
            bgcolor: 'background.default',
            borderRadius: 1,
          }}>
            <Assignment sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              Задач нет
            </Typography>
          </Box>
        </Paper>

        {/* Завершенные задачи */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CheckCircle color="success" />
            <Typography variant="h6">
              Завершенные
            </Typography>
          </Box>
          
          <Box sx={{ 
            textAlign: 'center', 
            py: 6,
            bgcolor: 'background.default',
            borderRadius: 1,
          }}>
            <CheckCircle sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              Задач нет
            </Typography>
          </Box>
        </Paper>

        {/* Кнопка добавления (неактивная) */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            disabled
            sx={{ 
              minWidth: 200,
              opacity: 0.5,
              cursor: 'not-allowed',
            }}
          >
            Добавить задачу
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

export default MyTasksPage;