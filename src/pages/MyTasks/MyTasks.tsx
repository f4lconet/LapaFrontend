import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Paper,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Tab as MuiTab,
} from '@mui/material';
import { Add, Assignment, CheckCircle, Archive } from '@mui/icons-material';
import { BurgerMenu } from '../../components/navigation/BurgerMenu';
import { TaskCard } from '../../components/tasks/TaskCard';
import { AddTaskDialog } from '../../components/tasks/AddTaskDialog';
import { useTaskStore } from '../../services/stores/useTaskStore';
import { useUserPresenter } from '../../presenters/useUserPresenter';
import type { CreateTaskRequest, UpdateTaskRequest } from '../../models/task.model';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const MyTasksPage = () => {
  const { user } = useUserPresenter();
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    cancelTask,
    completeTask,
    clearError,
  } = useTaskStore();

  const { myAnimals } = useUserPresenter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const isVolunteer = user?.role === 'volunteer';
  const isCuratorOrOrg = user?.role === 'curator' || user?.role === 'organization';

  useEffect(() => {
    // Fetch my tasks when component mounts
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  const pendingTasks = tasks.filter((t) => t.status === 'in_pending');
  const activeTasks = tasks.filter((t) => t.status === 'assigned' || t.status === 'in_progress');
  const archivedTasks = tasks.filter(
    (t) => t.status === 'completed' || t.status === 'cancelled'
  );

  const handleCreateTask = async (data: CreateTaskRequest) => {
    try {
      await createTask(data);
      setIsAddDialogOpen(false);
    } catch (err) {
      // Error is shown in the dialog
    }
  };

  const handleUpdateTask = async (taskId: string, data: UpdateTaskRequest) => {
    try {
      await updateTask(taskId, data);
      setEditingTaskId(null);
    } catch (err) {
      // Error is shown in the dialog
    }
  };

  const handleTakeTask = async (taskId: string) => {
    // For volunteers taking tasks (should be on TasksFeed)
    // This shouldn't happen here
  };

  const handleCancelTask = async (taskId: string) => {
    try {
      await cancelTask(taskId);
    } catch (err) {
      // Error is handled
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
    } catch (err) {
      // Error is handled
    }
  };

  const handleChat = (taskId: string) => {
    // TODO: Implement chat redirection
    console.log('Chat with assignee:', taskId);
  };

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

      {isLoading && activeTasks.length === 0 && pendingTasks.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              aria-label="task tabs"
            >
              {isCuratorOrOrg && <Tab label="Ожидают исполнителя" id="tab-0" />}
              <Tab
                label={isCuratorOrOrg ? 'Активные' : 'Активные'}
                id={isCuratorOrOrg ? 'tab-1' : 'tab-0'}
              />
              <Tab
                label="Архив"
                id={isCuratorOrOrg ? 'tab-2' : 'tab-1'}
              />
            </Tabs>
          </Box>

          {/* Curator/Org: Pending Tasks Tab */}
          {isCuratorOrOrg && (
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setIsAddDialogOpen(true)}
                  sx={{ mb: 2 }}
                >
                  Добавить задачу
                </Button>
              </Box>

              {pendingTasks.length === 0 ? (
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Assignment sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body1" color="text.secondary">
                      Нет задач, ожидающих исполнителя
                    </Typography>
                  </Box>
                </Paper>
              ) : (
                <Stack spacing={2}>
                  {pendingTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isOwner={true}
                      onEdit={(taskId) => {
                        setEditingTaskId(taskId);
                        setIsAddDialogOpen(true);
                      }}
                      onCancel={handleCancelTask}
                      isLoading={isLoading}
                    />
                  ))}
                </Stack>
              )}
            </TabPanel>
          )}

          {/* Active Tasks Tab */}
          <TabPanel value={tabValue} index={isCuratorOrOrg ? 1 : 0}>
            {activeTasks.length === 0 ? (
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Assignment sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    Нет активных задач
                  </Typography>
                </Box>
              </Paper>
            ) : (
              <Stack spacing={2}>
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
                    onCancel={isCuratorOrOrg ? handleCancelTask : handleCancelTask}
                    onComplete={isCuratorOrOrg ? handleCompleteTask : undefined}
                    isLoading={isLoading}
                  />
                ))}
              </Stack>
            )}
          </TabPanel>

          {/* Archive Tab */}
          <TabPanel value={tabValue} index={isCuratorOrOrg ? 2 : 1}>
            {archivedTasks.length === 0 ? (
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Archive sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    Архив пуст
                  </Typography>
                </Box>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {archivedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isOwner={isCuratorOrOrg}
                    isLoading={isLoading}
                  />
                ))}
              </Stack>
            )}
          </TabPanel>
        </>
      )}

      {/* Add/Edit Task Dialog */}
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
