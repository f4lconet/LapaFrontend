import {
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
  Person,
  RateReview,
} from '@mui/icons-material';
import type { Task } from '../../models/task.model';
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  task: Task;
  isOwner?: boolean;
  isVolunteer?: boolean;
  isAssigned?: boolean;
  onTake?: (taskId: string) => void;
  onChat?: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onCancel?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  isLoading?: boolean;
  showCreatorProfile?: boolean;
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
  onDelete,
  onComplete,
  isLoading = false,
  showCreatorProfile = true,
}: TaskCardProps) => {
  const navigate = useNavigate();

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

  const handleViewCreatorProfile = () => {
    navigate(`/profile/${task.creator_id}`);
  };

  const handleViewAssigneeProfile = () => {
    if (task.assignee_id) {
      navigate(`/profile/${task.assignee_id}`);
    }
  };

  const isActiveTask = task.status !== 'completed' && task.status !== 'cancelled';
  const isArchived = task.status === 'completed' || task.status === 'cancelled';
  const isCompleted = task.status === 'completed';

  return (
    <Box
      sx={{
        maxWidth: '500px',
        width: '100%',
        mb: 2,
        backgroundColor: 'rgba(248, 247, 255, 1)',
        borderRadius: '20px'
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
              {/* Кнопка перехода к профилю исполнителя */}
              {task.assignee_id && (
                <Button
                  size="small"
                  variant="text"
                  onClick={handleViewAssigneeProfile}
                  sx={{ textTransform: 'none', minWidth: 'auto', p: 0, fontSize: '0.75rem' }}
                >
                  профиль
                </Button>
              )}
            </Box>
          )}

          {showCreatorProfile && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Автор задачи:
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  onClick={handleViewCreatorProfile}
                  sx={{ textTransform: 'none', minWidth: 'auto', p: 0 }}
                >
                  перейти в профиль
                </Button>
              </Box>
            </Box>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', gap: 1, pt: 0, flexWrap: 'wrap' }}>
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

        {/* Чат для волонтера и владельца (только в активных задачах) */}
        {!isArchived && ((isVolunteer && isAssigned) || (isOwner && task.assignee_name)) && onChat && (
          <Button
            size="small"
            startIcon={<Chat />}
            onClick={() => onChat(task.id)}
            disabled={isLoading}
          >
            Чат
          </Button>
        )}

        {/* Завершить задачу - для волонтёра */}
        {isVolunteer && isAssigned && isActiveTask && onComplete && (
          <Button
            size="small"
            startIcon={<CheckCircle />}
            onClick={() => onComplete(task.id)}
            disabled={isLoading}
            color="success"
            variant="contained"
          >
            Завершить
          </Button>
        )}

        {/* Для владельца - Изменить (только для pending) */}
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

        {/* Отмена для волонтера (отказ от задачи) */}
        {isVolunteer && isAssigned && isActiveTask && onCancel && (
          <Button
            size="small"
            startIcon={<Cancel />}
            onClick={() => onCancel(task.id)}
            disabled={isLoading}
            color="warning"
          >
            Отказаться
          </Button>
        )}

        {/* Кнопка "Оставить отзыв" для создателя в завершённых задачах */}
        {isOwner && isCompleted && task.assignee_id && (
          <Button
            size="small"
            startIcon={<RateReview />}
            onClick={handleViewAssigneeProfile}
            disabled={isLoading}
            color="primary"
            variant="outlined"
          >
            Оставить отзыв
          </Button>
        )}

        {/* Удаление задачи для создателя (только для активных задач, не в архиве) */}
        {isOwner && !isArchived && onDelete && (
          <Button
            size="small"
            startIcon={<Delete />}
            onClick={() => {
              if (window.confirm('Вы уверены, что хотите полностью удалить эту задачу? Это действие нельзя отменить.')) {
                onDelete(task.id);
              }
            }}
            disabled={isLoading}
            color="error"
          >
            Удалить
          </Button>
        )}

        {/* Отмена для создателя (если задача активна и есть исполнитель) */}
        {isOwner && isActiveTask && task.assignee_name && onCancel && (
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
      </CardActions>
    </Box>
  );
};