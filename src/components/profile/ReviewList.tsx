import type { Task } from '../../models/task.model';
import type { Review } from '../../models/user.model';
import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  Button,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useReviewStore } from '../../services/stores/useReviewStore';
import { useAuthStore } from '../../services/stores/useAuthStore';
import { taskService } from '../../services/api/task.service';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ReviewListProps {
  volunteerId: string;
  isOwnProfile: boolean;
}

export const ReviewList = ({ volunteerId, isOwnProfile }: ReviewListProps) => {
  const { user: currentUser } = useAuthStore();
  const {
    reviews,
    stats,
    isLoading,
    error,
    fetchVolunteerReviews,
    fetchVolunteerStats,
    createReview,
    updateReview,
    deleteReview,
    loadMoreReviews,
    totalReviews,
  } = useReviewStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({ comment: '', rating: 0, task_id: '' });
  const [formError, setFormError] = useState('');
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const canCreateReview = (currentUser?.role === 'curator' || 
                          currentUser?.role === 'organization' || 
                          isAdmin) && !isOwnProfile;

  useEffect(() => {
    if (volunteerId) {
      fetchVolunteerReviews(volunteerId);
      fetchVolunteerStats(volunteerId);
    }
  }, [volunteerId]);

  // Получаем список task_id, на которые уже оставлены отзывы
  const reviewedTaskIds = new Set(reviews.map(review => review.task_id));

  const loadCompletedTasks = async () => {
    if (!canCreateReview || !volunteerId) return;
    
    setLoadingTasks(true);
    setFormError('');
    
    try {
      // Загружаем ВСЕ выполненные задачи (увеличиваем лимит для выбора)
      const response = await taskService.getVolunteerCompletedTasks(
        volunteerId, 
        100,
        0
      );
      
      // Фильтруем задачи, на которые ещё нет отзывов
      const availableTasks = response.items.filter(
        task => !reviewedTaskIds.has(task.id)
      );
      
      setCompletedTasks(availableTasks);
      
      if (response.items.length === 0) {
        setFormError('У вас нет завершённых задач с этим волонтёром');
      } else if (availableTasks.length === 0) {
        setFormError('Вы уже оставили отзывы на все завершённые задачи с этим волонтёром');
      }
    } catch (error: any) {
      console.error('Error loading completed tasks:', error);
      setFormError(
        error.response?.data?.detail || 
        'Ошибка загрузки задач'
      );
      setCompletedTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
    setFormData({ comment: '', rating: 0, task_id: '' });
    setFormError('');
    loadCompletedTasks();
  };

  const handleCreateReview = async () => {
    // Валидация
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      setFormError('Пожалуйста, поставьте оценку от 1 до 5');
      return;
    }
    if (!formData.task_id) {
      setFormError('Выберите задание');
      return;
    }

    // Проверка на дубликат
    if (reviewedTaskIds.has(formData.task_id)) {
      setFormError('Вы уже оставили отзыв на эту задачу');
      return;
    }

    try {
      await createReview({
        comment: formData.comment,
        rating: formData.rating,
        task_id: formData.task_id,
        volunteer_id: volunteerId,
      });
      
      // Закрываем диалог и сбрасываем форму
      setIsCreateDialogOpen(false);
      setFormData({ comment: '', rating: 0, task_id: '' });
      setFormError('');
      
      // Обновляем отзывы и статистику
      await fetchVolunteerReviews(volunteerId);
      await fetchVolunteerStats(volunteerId);
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.detail || 
        error.response?.data?.message || 
        'Ошибка при создании отзыва. Возможно, вы уже оставили отзыв на эту задачу.';
      
      setFormError(errorMessage);
    }
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;
    
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      setFormError('Пожалуйста, поставьте оценку от 1 до 5');
      return;
    }

    try {
      await updateReview(editingReview.id, {
        comment: formData.comment,
        rating: formData.rating,
      });
      setIsEditDialogOpen(false);
      setEditingReview(null);
      setFormData({ comment: '', rating: 0, task_id: '' });
      setFormError('');
      
      // Обновляем статистику
      await fetchVolunteerStats(volunteerId);
    } catch (error: any) {
      setFormError(
        error.response?.data?.detail || 
        'Ошибка при обновлении отзыва'
      );
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      try {
        await deleteReview(reviewId);
        // Обновляем статистику
        await fetchVolunteerStats(volunteerId);
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: ru });
    } catch {
      return dateString;
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingReview(review);
    setFormData({
      comment: review.comment,
      rating: review.rating,
      task_id: review.task_id,
    });
    setIsEditDialogOpen(true);
  };

  // Получаем информацию о выбранной задаче
  const selectedTask = completedTasks.find(t => t.id === formData.task_id);

  const taskStatusLabels: Record<string, string> = {
    'in_pending': 'Ожидает',
    'assigned': 'Назначена',
    'in_progress': 'В работе',
    'completed': 'Завершена',
    'cancelled': 'Отменена'
  };

  // Проверяем, есть ли доступные задачи для отзыва
  const hasAvailableTasks = completedTasks.length > 0;

  return (
    <Card sx={{ border: '3px solid rgba(49, 40, 114, 1)', backgroundColor: 'rgba(239, 237, 255, 1)', borderRadius: '34px' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontSize: 24, fontWeight: 700}}>
            Отзывы
          </Typography>
          {canCreateReview && (
            <Button
              startIcon={<Add />}
              variant="contained"
              size="small"
              onClick={handleOpenCreateDialog}
            >
              Оставить отзыв
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading && reviews.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : reviews.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            Пока нет отзывов
          </Typography>
        ) : (
          <Stack spacing={2}>
            {reviews.map((review) => (
              <Box key={review.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                      <Typography variant="subtitle2">
                        {review.reviewer_name}
                      </Typography>
                      <Chip 
                        label={review.task_title} 
                        size="small" 
                        variant="outlined" 
                        color="primary"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                    <Rating value={review.rating} readOnly size="small" />
                    {review.comment && (
                      <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-line', color: 'text.primary' }}>
                        {review.comment}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {formatDate(review.created_at)}
                    </Typography>
                  </Box>
                  
                  {isAdmin && (
                    <Box sx={{ display: 'flex', ml: 1 }}>
                      <IconButton size="small" onClick={() => handleEditClick(review)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteReview(review.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Divider sx={{ mt: 1.5 }} />
              </Box>
            ))}
          </Stack>
        )}

        {reviews.length < totalReviews && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button onClick={() => loadMoreReviews(volunteerId)} disabled={isLoading}>
              {isLoading ? 'Загрузка...' : 'Показать ещё'}
            </Button>
          </Box>
        )}
      </CardContent>

      {/* Диалог создания отзыва */}
      <Dialog 
        open={isCreateDialogOpen} 
        onClose={() => !isLoading && setIsCreateDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Оставить отзыв волонтёру</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            
            {!hasAvailableTasks && !loadingTasks && !formError && (
              <Alert severity="info">
                Вы уже оставили отзывы на все завершённые задачи с этим волонтёром.
              </Alert>
            )}
            
            <FormControl fullWidth required disabled={loadingTasks || !hasAvailableTasks}>
              <InputLabel>Завершённая задача</InputLabel>
              <Select
                value={formData.task_id}
                label="Завершённая задача"
                onChange={(e) => setFormData({ ...formData, task_id: e.target.value })}
              >
                {loadingTasks ? (
                  <MenuItem disabled>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Загрузка задач...
                  </MenuItem>
                ) : completedTasks.length === 0 ? (
                  <MenuItem disabled>Нет доступных задач</MenuItem>
                ) : (
                  completedTasks.map((task) => (
                    <MenuItem key={task.id} value={task.id}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {task.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          {task.animal_name && (
                            <Typography variant="caption" color="text.secondary">
                              🐾 {task.animal_name}
                            </Typography>
                          )}
                          {task.is_urgent && (
                            <Chip 
                              label="Срочно" 
                              size="small" 
                              color="error" 
                              sx={{ height: 18, fontSize: '0.65rem' }} 
                            />
                          )}
                        </Box>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {selectedTask && (
              <Alert severity="success" sx={{ backgroundColor: '#F0FFF4' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {selectedTask.title}
                </Typography>
                {selectedTask.animal_name && (
                  <Typography variant="body2" color="text.secondary">
                    Животное: {selectedTask.animal_name}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  Статус: {taskStatusLabels[selectedTask.status] || selectedTask.status}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Обновлено: {formatDate(selectedTask.updated_at)}
                </Typography>
              </Alert>
            )}
            
            <Box>
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                Оценка *
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating
                  value={formData.rating}
                  onChange={(_, newValue) => setFormData({ ...formData, rating: newValue || 0 })}
                  size="large"
                />
                {formData.rating > 0 && (
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                    {formData.rating} / 5
                  </Typography>
                )}
              </Box>
            </Box>
            
            <TextField
              label="Комментарий"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              multiline
              rows={4}
              fullWidth
              placeholder="Расскажите о работе волонтёра, что понравилось или что можно улучшить..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setIsCreateDialogOpen(false)} disabled={isLoading}>
            Отмена
          </Button>
          <Button 
            onClick={handleCreateReview} 
            variant="contained"
            disabled={isLoading || !formData.task_id || formData.rating === 0}
            startIcon={isLoading ? <CircularProgress size={16} /> : null}
          >
            {isLoading ? 'Сохранение...' : 'Отправить отзыв'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования отзыва (admin) */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={() => !isLoading && setIsEditDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Редактировать отзыв</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            
            {editingReview && (
              <Alert severity="info" sx={{ backgroundColor: '#F3F4FF' }}>
                <Typography variant="body2">
                  Задача: <strong>{editingReview.task_title}</strong>
                </Typography>
                <Typography variant="body2">
                  Автор отзыва: <strong>{editingReview.reviewer_name}</strong>
                </Typography>
                <Typography variant="body2">
                  Волонтёр: <strong>{editingReview.volunteer_name}</strong>
                </Typography>
              </Alert>
            )}
            
            <Box>
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                Оценка *
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating
                  value={formData.rating}
                  onChange={(_, newValue) => setFormData({ ...formData, rating: newValue || 0 })}
                  size="large"
                />
                {formData.rating > 0 && (
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                    {formData.rating} / 5
                  </Typography>
                )}
              </Box>
            </Box>
            
            <TextField
              label="Комментарий"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              multiline
              rows={4}
              fullWidth
              placeholder="Отредактируйте комментарий..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>
            Отмена
          </Button>
          <Button 
            onClick={handleUpdateReview} 
            variant="contained" 
            disabled={isLoading || formData.rating === 0}
            startIcon={isLoading ? <CircularProgress size={16} /> : null}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};