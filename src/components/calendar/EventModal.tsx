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
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: { xs: 1, sm: 2 },
          maxWidth: { xs: '90%', sm: '95%', md: 600 },
          width: { xs: '95%', sm: '90%', md: 'auto' },
          maxHeight: { xs: '85vh', sm: '90vh' },
          overflow: 'auto',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: { xs: 1.5, sm: 2 },
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 0 }
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '16px', sm: '18px', md: '20px' }
            }}
          >
            {mode === 'view' ? 'Детали события' : 'Редактирование события'}
          </Typography>
          <IconButton 
            onClick={onClose}
            sx={{ minWidth: 'auto' }}
          >
            <CloseIcon sx={{ fontSize: { xs: '20px', sm: '24px', md: '28px' } }} />
          </IconButton>
        </Box>

        {mode === 'view' && event ? (
          <Stack spacing={{ xs: 1, sm: 1.5, md: 2 }}>
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
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 0.5, sm: 1 }, 
                justifyContent: 'flex-end', 
                mt: { xs: 1.5, sm: 2 },
                flexWrap: 'wrap'
              }}>
                <Button 
                  variant="outlined" 
                  startIcon={<EditIcon />} 
                  onClick={onEdit}
                  sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' } }}
                >
                  Редактировать
                </Button>
                <Button 
                  variant="contained" 
                  color="error" 
                  startIcon={<DeleteIcon />} 
                  onClick={onDelete}
                  sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' } }}
                >
                  Удалить
                </Button>
              </Box>
            )}
          </Stack>
        ) : (
          <Stack spacing={{ xs: 1.5, sm: 2 }}>
            <TextField
              label="Название события *"
              fullWidth
              value={formData.title || ''}
              onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
              required
              sx={{ fontSize: { xs: '13px', sm: '14px', md: '16px' } }}
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