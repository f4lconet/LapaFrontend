import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Stack,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  Button,
  Popover,
  FormGroup,
} from '@mui/material';
import { Search, Tune } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BurgerMenu } from '../../components/navigation/BurgerMenu';
import { TaskCard } from '../../components/tasks/TaskCard';
import { useTaskStore } from '../../services/stores/useTaskStore';
import { useAuthStore } from '../../services/stores/useAuthStore';

const TasksFeedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    tasks,
    recommendedTasks,
    isLoading,
    error,
    totalTasks,
    totalRecommended,
    fetchTasks,
    fetchRecommendedTasks,
    takeTask,
    loadMoreTasks,
    loadMoreRecommended,
    clearError,
  } = useTaskStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [filteredRecommended, setFilteredRecommended] = useState(recommendedTasks);
  const [hasMoreTasks, setHasMoreTasks] = useState(true);
  const [hasMoreRecommended, setHasMoreRecommended] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const recommendedTarget = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const isVolunteer = user?.role === 'volunteer';

  // Initial load
  useEffect(() => {
    fetchTasks();
    if (isVolunteer) {
      fetchRecommendedTasks();
    }
  }, [isVolunteer, fetchTasks, fetchRecommendedTasks]);

  // Filter tasks based on search and filters
  useEffect(() => {
    let filtered = tasks;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.animal_name.toLowerCase().includes(query)
      );
    }

    if (showUrgentOnly) {
      filtered = filtered.filter((task) => task.is_urgent);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, showUrgentOnly]);

  // Filter recommended tasks
  useEffect(() => {
    let filtered = recommendedTasks;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.animal_name.toLowerCase().includes(query)
      );
    }

    if (showUrgentOnly) {
      filtered = filtered.filter((task) => task.is_urgent);
    }

    setFilteredRecommended(filtered);
  }, [recommendedTasks, searchQuery, showUrgentOnly]);

  // Intersection Observer for infinite scroll - regular tasks
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMoreTasks && tasks.length > 0) {
          loadMoreTasks();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [isLoading, hasMoreTasks, tasks.length, loadMoreTasks]);

  // Intersection Observer for recommended tasks
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          hasMoreRecommended &&
          recommendedTasks.length > 0
        ) {
          loadMoreRecommended();
        }
      },
      { threshold: 0.1 }
    );

    if (recommendedTarget.current) {
      observer.observe(recommendedTarget.current);
    }

    return () => {
      if (recommendedTarget.current) {
        observer.unobserve(recommendedTarget.current);
      }
    };
  }, [isLoading, hasMoreRecommended, recommendedTasks.length, loadMoreRecommended]);

  // Check if more tasks available
  useEffect(() => {
    setHasMoreTasks(tasks.length < totalTasks);
  }, [tasks.length, totalTasks]);

  // Check if more recommended available
  useEffect(() => {
    setHasMoreRecommended(recommendedTasks.length < totalRecommended);
  }, [recommendedTasks.length, totalRecommended]);

  const handleTakeTask = async (taskId: string) => {
    try {
      await takeTask(taskId);
      alert('Задача успешно взята!');
    } catch (err) {
      // Error is handled by store
    }
  };

  const handleChat = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId) || recommendedTasks.find((t) => t.id === taskId);
    if (!task) return;

    // For volunteer: chat with creator (curator/org)
    navigate(`/chat?userId=${task.creator_id}`);
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
        <Typography variant="body2" color="text.secondary">
          Найдите и возьмите подходящую для вас задачу
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
        <TextField
          fullWidth
          placeholder="Поиск по названию, описанию или животному..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }
          }}
        />

        <Button
          variant="contained"
          startIcon={<Tune />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ 
            flexShrink: 0, 
            height: 80,
            px: 3,
            borderRadius: '12px',
            backgroundColor: 'primary.main',
            '&:hover': { backgroundColor: 'primary.dark' },
          }}
        >
          Фильтры
          {showUrgentOnly && (
            <Typography component="span" sx={{ ml: 1, fontSize: '0.75rem', opacity: 0.8 }}>
              (1)
            </Typography>
          )}
        </Button>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
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
                borderRadius: '12px',
                minWidth: 250,
                p: 2,
              }
            }
            
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Фильтры
          </Typography>
          
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showUrgentOnly}
                  onChange={(e) => setShowUrgentOnly(e.target.checked)}
                  color="primary"
                />
              }
              label="Только срочные задачи"
            />
          </FormGroup>
        </Popover>
      </Box>

      {isLoading && filteredTasks.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Recommended Tasks for Volunteers */}
          {isVolunteer && filteredRecommended.length > 0 && (
            <Box sx={{ mb: 4 }}> 
              <Typography variant="h6" sx={{ mb: 2 }}>Рекомендуемые для вас</Typography>

              <Stack spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
                {filteredRecommended.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isVolunteer={true}
                    onTake={handleTakeTask}
                    onChat={handleChat}
                    isLoading={isLoading}
                  />
                ))}
              </Stack>

              {hasMoreRecommended && (
                <Box ref={recommendedTarget} sx={{ py: 2, textAlign: 'center' }}>
                  {isLoading && <CircularProgress size={24} />}
                </Box>
              )}
            </Box>
          )}

          {/* All Tasks */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Все задачи {filteredTasks.length > 0 && `(${filteredTasks.length} из ${totalTasks})`}
            </Typography>

            {filteredTasks.length === 0 ? (
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  {searchQuery || showUrgentOnly
                    ? 'По вашему запросу не найдено задач'
                    : 'Задач пока нет'}
                </Typography>
              </Paper>
            ) : (
              <>
                <Stack spacing={2} sx={{ alignItems: 'center' }}>
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isVolunteer={isVolunteer}
                      onTake={isVolunteer ? handleTakeTask : undefined}
                      onChat={isVolunteer ? handleChat : undefined}
                      isLoading={isLoading}
                    />
                  ))}
                </Stack>

                {hasMoreTasks && (
                  <Box ref={observerTarget} sx={{ py: 4, textAlign: 'center' }}>
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Прокрутите для загрузки ещё задач...
                      </Typography>
                    )}
                  </Box>
                )}
              </>
            )}
          </Box>
        </>
      )}
    </Container>
  );
};

export default TasksFeedPage;