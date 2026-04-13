import { Container, Typography, Box, Stack, Paper, Chip, Button, Card, CardContent, CardActions, Grid } from '@mui/material';
import { Assignment, LocationOn, Schedule, Person, Flag, CheckCircle } from '@mui/icons-material';
import { BurgerMenu } from '../../components/navigation/BurgerMenu';

// Временные типы для задач (пока без сервисов)
interface Task {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  organization: string;
  organizationId: string;
  status: 'active' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

// Временные данные для демонстрации
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Помощь в приюте для собак',
    description: 'Нужна помощь в выгуле собак и уборке вольеров. Приветствуется опыт общения с животными.',
    location: 'Москва, ул. Ленина 15',
    date: '15 апреля 2026',
    time: '10:00 - 14:00',
    organization: 'Приют "Доброе сердце"',
    organizationId: 'org1',
    status: 'active',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Сбор корма для кошек',
    description: 'Помогите собрать корм для бездомных кошек. Требуются волонтеры для организации сбора.',
    location: 'Санкт-Петербург, Невский пр. 25',
    date: '18 апреля 2026',
    time: '12:00 - 16:00',
    organization: 'Кошкин дом',
    organizationId: 'org2',
    status: 'active',
    priority: 'medium',
  },
  
];

const TasksFeedPage = () => {
  const handleTakeTask = (taskId: string) => {
    // TODO: добавить логику взятия задачи
    console.log('Take task:', taskId);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'Высокий приоритет';
      case 'medium':
        return 'Средний приоритет';
      case 'low':
        return 'Низкий приоритет';
      default:
        return '';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <BurgerMenu />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Лента задач
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Выберите задачу, которую хотите выполнить
        </Typography>
      </Box>

      {mockTasks.length === 0 ? (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
          <Assignment sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Задач пока нет
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Задачи появятся здесь, когда организации добавят их
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {mockTasks.map((task) => (
            <Grid sx={{xs: 12}} key={task.id}>
              <Card sx={{ 
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {task.title}
                    </Typography>
                    <Chip 
                      label={getPriorityText(task.priority)} 
                      color={getPriorityColor(task.priority)} 
                      size="small"
                      icon={<Flag />}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {task.description}
                  </Typography>

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2">{task.location}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Schedule fontSize="small" color="action" />
                      <Typography variant="body2">{task.date} • {task.time}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="body2">Организатор: {task.organization}</Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={task.status === 'active' ? 'Активна' : 'Завершена'} 
                      size="small" 
                      color={task.status === 'active' ? 'success' : 'default'}
                      icon={task.status === 'active' ? <Assignment /> : <CheckCircle />}
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<Assignment />}
                    onClick={() => handleTakeTask(task.id)}
                    fullWidth
                  >
                    Взять задачу
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default TasksFeedPage;