import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import {
  LocationOn,
  Schedule,
  Flag,
  School,
  Chat,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import type { Task } from '../../models/task.model';

interface TaskCardProps {
  task: Task;
  isOwner?: boolean;
  isVolunteer?: boolean;
  isAssigned?: boolean;
  onTake?: (taskId: string) => void;
  onChat?: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onCancel?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  isLoading?: boolean;
}

export const TaskCard = ({
  task,
  isOwner = false,
  isVolunteer = false,
  isAssigned = false,
  onTake,
  onChat,
  onEdit,
  onCancel,
  onComplete,
  isLoading = false,
}: TaskCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_pending':
        return 'default';
      case 'assigned':
        return 'primary';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      in_pending: 'Ожидает исполнителя',
      assigned: 'Назначена',
      in_progress: 'В процессе',
      completed: 'Завершена',
      cancelled: 'Отменена',
    };
    return labels[status] || status;
  };

  return (
    <Card
      sx={{
        width: '100%',
        mb: 2,
        border: task.is_urgent ? '2px solid' : '1px solid',
        borderColor: task.is_urgent ? 'error.main' : 'divider',
        backgroundColor: task.is_urgent ? 'error.lighter' : 'background.paper',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {task.title}
              </Typography>
              {task.is_urgent && (
                <Chip
                  icon={<Flag />}
                  label="Срочно"
                  size="small"
                  color="error"
                  variant="filled"
                />
              )}
            </Box>
            <Chip
              label={getStatusLabel(task.status)}
              size="small"
              color={getStatusColor(task.status) as any}
              variant="outlined"
              sx={{ mb: 1 }}
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {task.description}
        </Typography>

        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.9rem' }}>
            <LocationOn sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
            <Typography variant="body2">{task.location_text}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.9rem' }}>
            <Schedule sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
            <Typography variant="body2">{formatDate(task.due_time)}</Typography>
          </Box>

          {task.animal_name && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.9rem' }}>
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                {task.animal_name[0]}
              </Avatar>
              <Typography variant="body2">Животное: {task.animal_name}</Typography>
            </Box>
          )}

          {task.required_skills && task.required_skills.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <School sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
              {task.required_skills.map((skill) => (
                <Chip key={skill.skill_id} label={skill.skill_name} size="small" variant="outlined" />
              ))}
            </Box>
          )}

          {task.assignee_name && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.9rem' }}>
              <Typography variant="caption" color="text.secondary">
                Исполнитель: {task.assignee_name}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', gap: 1, pt: 0 }}>
        {/* Для волонтеров - Взять задачу */}
        {isVolunteer && task.status === 'in_pending' && onTake && (
          <Button
            size="small"
            variant="contained"
            onClick={() => onTake(task.id)}
            disabled={isLoading}
          >
            Взять задачу
          </Button>
        )}

        {/* Чат для волонтера */}
        {isVolunteer && isAssigned && onChat && (
          <Button
            size="small"
            startIcon={<Chat />}
            onClick={() => onChat(task.id)}
            disabled={isLoading}
          >
            Чат
          </Button>
        )}

        {/* Отмена для волонтера */}
        {isVolunteer && isAssigned && onCancel && (
          <Button
            size="small"
            startIcon={<Cancel />}
            onClick={() => onCancel(task.id)}
            disabled={isLoading}
            color="warning"
          >
            Отменить
          </Button>
        )}

        {/* Для владельца - Чат с волонтером */}
        {isOwner && task.assignee_name && onChat && (
          <Button
            size="small"
            startIcon={<Chat />}
            onClick={() => onChat(task.id)}
            disabled={isLoading}
          >
            Чат
          </Button>
        )}

        {/* Для владельца - Изменить и Завершить */}
        {isOwner && task.status === 'in_pending' && onEdit && (
          <Button
            size="small"
            startIcon={<Edit />}
            onClick={() => onEdit(task.id)}
            disabled={isLoading}
          >
            Изменить
          </Button>
        )}

        {isOwner && task.status !== 'completed' && task.status !== 'cancelled' && onComplete && (
          <Button
            size="small"
            startIcon={<CheckCircle />}
            onClick={() => onComplete(task.id)}
            disabled={isLoading}
            color="success"
          >
            Завершить
          </Button>
        )}

        {isOwner && onCancel && (
          <Button
            size="small"
            startIcon={<Delete />}
            onClick={() => onCancel(task.id)}
            disabled={isLoading}
            color="error"
          >
            Отменить
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
