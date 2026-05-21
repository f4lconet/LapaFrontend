// pages/Calendar/components/EventModal.tsx
import { Modal, Box, Typography, IconButton, Button, Stack, TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { CalendarEvent } from '../../models/calendar.model'

interface EventModalProps {
  open: boolean
  event: CalendarEvent | null
  mode: 'view' | 'edit'
  isAdmin: boolean
  formData: Partial<CalendarEvent>
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onSave: () => void
  onFormChange: (data: Partial<CalendarEvent>) => void
}

export const EventModal = ({
  open,
  event,
  mode,
  isAdmin,
  formData,
  onClose,
  onEdit,
  onDelete,
  onSave,
  onFormChange,
}: EventModalProps) => {
  if (!event && mode === 'view') return null

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxWidth: 600,
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {mode === 'view' ? 'Детали события' : 'Редактирование события'}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {mode === 'view' && event ? (
          <Stack spacing={2}>
            <ViewField label="Название" value={event.title} />
            <ViewField label="Дата" value={event.event_date} />
            <ViewField 
              label="Время" 
              value={`${event.start_time.slice(0,5)} - ${event.end_time.slice(0,5)}`} 
            />
            <ViewField label="Место" value={event.location || 'Не указано'} />
            <ViewField label="Описание" value={event.description || 'Нет описания'} />
            {event.task_id && <ViewField label="ID задачи" value={event.task_id} />}
            
            {isAdmin && (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" startIcon={<EditIcon />} onClick={onEdit}>
                  Редактировать
                </Button>
                <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={onDelete}>
                  Удалить
                </Button>
              </Box>
            )}
          </Stack>
        ) : (
          <Stack spacing={2}>
            <TextField
              label="Название события *"
              fullWidth
              value={formData.title || ''}
              onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
              required
            />
            <TextField
              label="Дата"
              type="date"
              fullWidth
              value={formData.event_date || ''}
              onChange={(e) => onFormChange({ ...formData, event_date: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Время начала"
                type="time"
                fullWidth
                value={formData.start_time?.slice(0,5) || ''}
                onChange={(e) => onFormChange({ ...formData, start_time: `${e.target.value}:00` })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Время окончания"
                type="time"
                fullWidth
                value={formData.end_time?.slice(0,5) || ''}
                onChange={(e) => onFormChange({ ...formData, end_time: `${e.target.value}:00` })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
            <TextField
              label="Место проведения"
              fullWidth
              value={formData.location || ''}
              onChange={(e) => onFormChange({ ...formData, location: e.target.value })}
            />
            <TextField
              label="Описание"
              fullWidth
              multiline
              rows={3}
              value={formData.description || ''}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
            />
            
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="outlined" onClick={onClose}>
                Отмена
              </Button>
              <Button 
                variant="contained" 
                onClick={onSave}
                disabled={!formData.title?.trim() || !formData.event_date}
              >
                Сохранить
              </Button>
            </Box>
          </Stack>
        )}
      </Box>
    </Modal>
  )
}

const ViewField = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
)