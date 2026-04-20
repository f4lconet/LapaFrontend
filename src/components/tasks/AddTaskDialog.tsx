import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useUserStore } from '../../services/stores/useUserStore';
import type { CreateTaskRequest, UpdateTaskRequest } from '../../models/task.model';
import type { Animal } from '../../models/user.model';

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  initialData?: CreateTaskRequest & { id?: string };
  isEditing?: boolean;
  animals: Animal[];
  isLoadingAnimals?: boolean;
}

export const AddTaskDialog = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  error,
  initialData,
  isEditing = false,
  animals = [],
  isLoadingAnimals = false,
}: AddTaskDialogProps) => {
  const { skills = [] } = useUserStore();

  const [formData, setFormData] = useState({
    animal_id: '',
    title: '',
    description: '',
    due_time: new Date().toISOString().split('T')[0],
    is_urgent: false,
    skill_ids: [] as string[],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        animal_id: initialData.animal_id,
        title: initialData.title,
        description: initialData.description,
        due_time: new Date(initialData.due_time).toISOString().split('T')[0],
        is_urgent: initialData.is_urgent,
        skill_ids: initialData.skill_ids,
      });
    } else {
      setFormData({
        animal_id: '',
        title: '',
        description: '',
        due_time: new Date().toISOString().split('T')[0],
        is_urgent: false,
        skill_ids: [],
      });
    }
  }, [open, initialData]);

  const handleSubmit = async () => {
    if (!formData.animal_id || !formData.title.trim()) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }

    try {
      const dataToSubmit: CreateTaskRequest | UpdateTaskRequest = {
        animal_id: formData.animal_id,
        title: formData.title,
        description: formData.description,
        due_time: new Date(formData.due_time).toISOString(),
        is_urgent: formData.is_urgent,
        skill_ids: formData.skill_ids,
      };

      await onSubmit(dataToSubmit);
      onClose();
    } catch (err) {
      // Error is handled by parent component
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Изменить задачу' : 'Добавить новую задачу'}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Autocomplete
            options={animals}
            getOptionLabel={(option) => option.name}
            value={animals.find((a) => a.id === formData.animal_id) || null}
            onChange={(_, newValue) => setFormData({ ...formData, animal_id: newValue?.id || '' })}
            renderInput={(params) => (
              <TextField {...params} label="Животное *" required loading={isLoadingAnimals} />
            )}
            fullWidth
          />

          <TextField
            label="Название задачи *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            multiline
            rows={2}
            fullWidth
            required
          />

          <TextField
            label="Описание задачи"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={3}
            fullWidth
          />

          <TextField
            label="Срок выполнения"
            type="datetime-local"
            value={formData.due_time}
            onChange={(e) => setFormData({ ...formData, due_time: e.target.value })}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_urgent}
                onChange={(e) => setFormData({ ...formData, is_urgent: e.target.checked })}
              />
            }
            label="Срочная задача"
          />

          <Autocomplete
            multiple
            options={skills}
            getOptionLabel={(option) => option.name}
            value={skills.filter((s) => formData.skill_ids.includes(s.id))}
            onChange={(_, newValue) =>
              setFormData({ ...formData, skill_ids: newValue.map((s) => s.id) })
            }
            renderInput={(params) => <TextField {...params} label="Требуемые навыки" />}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || !formData.animal_id || !formData.title.trim()}
        >
          {isLoading ? <CircularProgress size={24} /> : isEditing ? 'Обновить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
