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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Search, ExpandMore, TrendingUp } from '@mui/icons-material';
import { BurgerMenu } from '../../components/navigation/BurgerMenu';
import { TaskCard } from '../../components/tasks/TaskCard';
import { useTaskStore } from '../../services/stores/useTaskStore';
import { useUserPresenter } from '../../presenters/useUserPresenter';

const TasksFeedPage = () => {
  const { user } = useUserPresenter();
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
    // TODO: Implement chat redirection
    console.log('Chat with curator:', taskId);
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
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="Поиск по названию, описанию или животному..."
            slotProps={{
              input: {
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Фильтры</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showUrgentOnly}
                    onChange={(e) => setShowUrgentOnly(e.target.checked)}
                  />
                }
                label="Только срочные задачи"
              />
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Paper>

      {isLoading && filteredTasks.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Recommended Tasks for Volunteers */}
          {isVolunteer && filteredRecommended.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp color="primary" />
                <Typography variant="h6">Рекомендуемые для вас</Typography>
              </Box>

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