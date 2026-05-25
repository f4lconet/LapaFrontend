import { useState } from 'react';
import {
  CardActions,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  Flag,
  School,
  Chat,
  Delete,
  CheckCircle,
  Cancel,
  RateReview,
  OpenInNew,
  EditOutlined,
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  // Общий стиль для обрезания текста в 1 строку
  const truncateStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  // Контент карточки (переиспользуется в диалоге)
  const TaskContent = ({ isDialog = false }: { isDialog?: boolean }) => (
    <Stack spacing={1}>
      <Box sx={{ alignSelf: 'center', display: 'flex', gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '20px' }}>
          {task.title}
        </Typography>
        {isOwner && task.status === 'in_pending' && onEdit && !isDialog && (
          <Button
            size='small'
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task.id);
            }}
            disabled={isLoading}
            variant="text"
            sx={{ minWidth: 'auto', position: 'relative', bottom: 10 }}
          >
            <EditOutlined sx={{ fontSize: '20' }} />
          </Button>
        )}
      </Box>

      {task.animal_name && (
        <Typography sx={{ borderBottom: '1px solid rgba(201, 201, 201, 1)', ...(!isDialog && truncateStyle) }}>
          Животное: {task.animal_name}
        </Typography>
      )}

      <Typography sx={{ borderBottom: '1px solid rgba(201, 201, 201, 1)' }}>
        Статус: {getStatusLabel(task.status)}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, pb: '1px', borderBottom: '1px solid rgba(201, 201, 201, 1)' }}>
        <Typography>Срочность:</Typography>
        <Chip
          icon={<Flag />}
          label="Срочно"
          size="small"
          color="secondary"
          variant="filled"
        />
      </Box>

      <Typography sx={{ borderBottom: '1px solid rgba(201, 201, 201, 1)', ...(!isDialog && truncateStyle) }}>
        Локация: {task.location_text}
      </Typography>

      <Typography sx={{ borderBottom: '1px solid rgba(201, 201, 201, 1)', ...(!isDialog && truncateStyle) }}>
        Дата и время: {formatDate(task.due_time)}
      </Typography>

      <Typography sx={{ borderBottom: '1px solid rgba(201, 201, 201, 1)', ...(!isDialog && truncateStyle) }}>
        Описание: {task.description}
      </Typography>

      {task.required_skills && task.required_skills.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', borderBottom: '1px solid rgba(201, 201, 201, 1)' }}>
          <School sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
          {task.required_skills.map((skill) => (
            <Chip key={skill.skill_id} label={skill.skill_name} size="small" variant="outlined" color="secondary" />
          ))}
        </Box>
      )}

      {task.assignee_name && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.9rem', borderBottom: '1px solid rgba(201, 201, 201, 1)', ...(!isDialog && truncateStyle) }}>
          <Typography>Исполнитель: {task.assignee_name}</Typography>
          {task.assignee_id && (
            <Button
              size="small"
              variant="text"
              onClick={(e) => {
                e.stopPropagation();
                handleViewAssigneeProfile();
              }}
              sx={{ textTransform: 'none', minWidth: 'auto', p: 0 }}
            >
              <OpenInNew />
            </Button>
          )}
        </Box>
      )}

      {showCreatorProfile && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, borderBottom: '1px solid rgba(201, 201, 201, 1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>Автор задачи:</Typography>
            <Button
              size="small"
              variant="text"
              onClick={(e) => {
                e.stopPropagation();
                handleViewCreatorProfile();
              }}
              sx={{ minWidth: 'auto', p: 0 }}
            >
              <OpenInNew />
            </Button>
          </Box>
        </Box>
      )}
    </Stack>
  );

  return (
    <>
      <Box
        onClick={() => setIsDialogOpen(true)}
        sx={{
          maxWidth: '500px',
          width: '100%',
          mb: 2,
          backgroundColor: 'rgba(248, 247, 255, 1)',
          borderRadius: '20px',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3,
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
          <TaskContent />
        </Box>

        <CardActions 
          sx={{ justifyContent: 'flex-end', gap: 1, pt: 0, flexWrap: 'wrap' }}
          onClick={(e) => e.stopPropagation()}
        >
          {isVolunteer && task.status === 'in_pending' && onTake && (
            <Button size="small" variant="contained" onClick={() => onTake(task.id)} disabled={isLoading}>
              Взять задачу
            </Button>
          )}

          {!isArchived && ((isVolunteer && isAssigned) || (isOwner && task.assignee_name)) && onChat && (
            <Button size="small" variant="outlined" startIcon={<Chat />} onClick={() => onChat(task.id)} disabled={isLoading}>
              Чат
            </Button>
          )}

          {isOwner && isActiveTask && task.assignee_name && onComplete && (
            <Button size="small" startIcon={<CheckCircle />} onClick={() => onComplete(task.id)} disabled={isLoading} variant="contained">
              Завершить
            </Button>
          )}

          {isVolunteer && isAssigned && isActiveTask && onCancel && (
            <Button size="small" startIcon={<Cancel />} onClick={() => onCancel(task.id)} disabled={isLoading} variant="contained">
              Отказаться
            </Button>
          )}

          {isOwner && isCompleted && task.assignee_id && (
            <Button size="small" startIcon={<RateReview />} onClick={handleViewAssigneeProfile} disabled={isLoading} variant="outlined">
              Оставить отзыв
            </Button>
          )}

          {isOwner && !isArchived && onDelete && (
            <Button size="small" startIcon={<Delete />} onClick={() => {
              if (window.confirm('Вы уверены, что хотите полностью удалить эту задачу?')) {
                onDelete(task.id);
              }
            }} disabled={isLoading} variant="contained">
              Удалить
            </Button>
          )}

          {isOwner && isActiveTask && task.assignee_name && onCancel && (
            <Button size="small" startIcon={<Cancel />} onClick={() => onCancel(task.id)} disabled={isLoading} variant="contained">
              Отменить
            </Button>
          )}
        </CardActions>
      </Box>

      {/* Диалог с полной информацией */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <TaskContent isDialog />
        </DialogContent>
      </Dialog>
    </>
  );
};