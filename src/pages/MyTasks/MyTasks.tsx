import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Collapse,
  IconButton,
} from '@mui/material';
import { Add, ArrowDropDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BurgerMenu } from '../../components/navigation/BurgerMenu';
import { TaskCard } from '../../components/tasks/TaskCard';
import { AddTaskDialog } from '../../components/tasks/AddTaskDialog';
import { useTaskStore } from '../../services/stores/useTaskStore';
import { useAuthStore } from '../../services/stores/useAuthStore';
import { useUserStore } from '../../services/stores/useUserStore';
import type { CreateTaskRequest, UpdateTaskRequest } from '../../models/task.model';

const MyTasksPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { myAnimals } = useUserStore();
  const {
    tasks,
    archivedTasks,
    isLoading,
    error,
    totalArchived,
    fetchTasks,
    fetchArchivedTasks,
    createTask,
    updateTask,
    cancelTask,
    completeTask,
    deleteTask,
    loadMoreArchived,
    clearError,
  } = useTaskStore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  // Состояние аккордеона
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const isVolunteer = user?.role === 'volunteer';
  const isCuratorOrOrg = user?.role === 'curator' || user?.role === 'organization';

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchArchivedTasks(user.id, user.role);
    }
  }, [user, fetchTasks, fetchArchivedTasks]);

  const pendingTasks = tasks.filter((t) => t.status === 'in_pending');
  const activeTasks = tasks.filter(
    (t) => t.status === 'assigned' || t.status === 'in_progress'
  );

  const handleCreateTask = async (data: CreateTaskRequest) => {
    try {
      await createTask(data);
      setIsAddDialogOpen(false);
    } catch (err) {}
  };

  const handleUpdateTask = async (taskId: string, data: UpdateTaskRequest) => {
    try {
      await updateTask(taskId, data);
      setEditingTaskId(null);
    } catch (err) {}
  };

  const handleCancelTask = async (taskId: string) => {
    try {
      await cancelTask(taskId);
    } catch (err) {}
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
      if (user) {
        fetchArchivedTasks(user.id, user.role);
      }
    } catch (err) {}
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      if (user) {
        fetchArchivedTasks(user.id, user.role);
      }
    } catch (err) {}
  };

  const handleChat = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId) || archivedTasks.find((t) => t.id === taskId);
    if (!task) return;

    if (isCuratorOrOrg && task.assignee_id) {
      navigate(`/chat?userId=${task.assignee_id}`);
    } else if (isVolunteer && task.creator_id) {
      navigate(`/chat?userId=${task.creator_id}`);
    }
  };

  const handleLoadMoreArchived = () => {
    if (user) {
      loadMoreArchived(user.id, user.role);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Секция аккордеона
  const AccordionSection = ({
    title,
    count,
    section,
    children,
  }: {
    title: string;
    count: number;
    section: string;
    children: React.ReactNode;
  }) => (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          borderRadius: '12px',
        }}
        onClick={() => toggleSection(section)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleSection(section);
            }}
            sx={{
              transform: expandedSection === section ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          >
            <ArrowDropDown sx={{color: 'rgba(0, 0, 0, 1)', fontSize: '40px'}} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography
            sx={{
              backgroundColor: 'rgba(93, 75, 216, 0.15)',
              color: 'rgba(49, 40, 114, 1)',
              px: 1.5,
              py: 0.5,
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {count}
          </Typography>
        </Box>
      </Box>

      <Collapse in={expandedSection === section}>
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <BurgerMenu />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Мои задачи
        </Typography>
        {isVolunteer && (
          <Typography variant="body2" color="text.secondary">
            Задачи, которые вы взяли из Ленты задач
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading && tasks.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {isCuratorOrOrg && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setIsAddDialogOpen(true);
              }}
              sx={{ maxWidth: '231px', width: '100%', height: '45px', borderRadius: '10px', mb: 2 }}
            >
              Добавить задачу
            </Button>
          )}
          {/* Ожидают исполнителя (только для куратора/организации) */}
          {isCuratorOrOrg && (
            <AccordionSection
              title="Ожидают исполнителя"
              count={pendingTasks.length}
              section="pending"
            >
              {pendingTasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  Нет задач, ожидающих исполнителя
                </Typography>
              ) : (
                <Stack spacing={2} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  {pendingTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isOwner={true}
                      onEdit={(taskId) => {
                        setEditingTaskId(taskId);
                        setIsAddDialogOpen(true);
                      }}
                      onDelete={handleDeleteTask}
                      isLoading={isLoading}
                    />
                  ))}
                </Stack>
              )}
            </AccordionSection>
          )}

          {/* Активные */}
          <AccordionSection
            title="Активные"
            count={activeTasks.length}
            section="active"
          >
            {activeTasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                Нет активных задач
              </Typography>
            ) : (
              <Stack spacing={2} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {activeTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isOwner={isCuratorOrOrg}
                    isVolunteer={isVolunteer}
                    isAssigned={task.status === 'assigned' || task.status === 'in_progress'}
                    onChat={handleChat}
                    onEdit={isCuratorOrOrg ? (taskId) => {
                      setEditingTaskId(taskId);
                      setIsAddDialogOpen(true);
                    } : undefined}
                    onCancel={handleCancelTask}
                    onDelete={isCuratorOrOrg ? handleDeleteTask : undefined}
                    onComplete={isCuratorOrOrg ? handleCompleteTask : undefined}
                    isLoading={isLoading}
                  />
                ))}
              </Stack>
            )}
          </AccordionSection>

          {/* Архив */}
          <AccordionSection
            title="Архив"
            count={archivedTasks.length}
            section="archive"
          >
            {archivedTasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                Архив пуст
              </Typography>
            ) : (
              <>
                <Stack spacing={2} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  {archivedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isOwner={isCuratorOrOrg}
                      isVolunteer={isVolunteer}
                      onChat={handleChat}
                      onDelete={isCuratorOrOrg ? handleDeleteTask : undefined}
                      isLoading={isLoading}
                    />
                  ))}
                </Stack>

                {archivedTasks.length < totalArchived && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button onClick={handleLoadMoreArchived} disabled={isLoading}>
                      {isLoading ? 'Загрузка...' : 'Показать ещё'}
                    </Button>
                  </Box>
                )}
              </>
            )}
          </AccordionSection>
        </>
      )}

      <AddTaskDialog
        open={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setEditingTaskId(null);
        }}
        onSubmit={async (data) => {
          if (editingTaskId) {
            await handleUpdateTask(editingTaskId, data as UpdateTaskRequest);
          } else {
            await handleCreateTask(data as CreateTaskRequest);
          }
        }}
        isLoading={isLoading}
        error={error}
        animals={myAnimals}
        isLoadingAnimals={isLoading}
      />
    </Container>
  );
};

export default MyTasksPage;