import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, Box } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import type { CreateCalendarEventRequest } from '../../models/calendar.model'

interface CreateEventDialogProps {
  open: boolean
  formData: Partial<CreateCalendarEventRequest>
  selectedDate: string
  isValid: boolean
  onClose: () => void
  onChange: (data: Partial<CreateCalendarEventRequest>) => void
  onSubmit: () => void
}

export const CreateEventDialog = ({
  open,
  formData,
  selectedDate,
  isValid,
  onClose,
  onChange,
  onSubmit,
}: CreateEventDialogProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      slotProps={{
        paper: {
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '85vh', sm: '90vh' },
          }
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 0.5, sm: 1 },
          fontSize: { xs: '16px', sm: '18px', md: '20px' }
        }}>
          <EventIcon color="primary" />
          Создание события
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={{ xs: 1.5, sm: 2 }} sx={{ mt: { xs: 0.5, sm: 1 } }}>
          <TextField
            label="Название события *"
            fullWidth
            value={formData.title || ''}
            onChange={(e) => onChange({ ...formData, title: e.target.value })}
            required
            placeholder="Например: Встреча волонтёров"
            sx={{ fontSize: { xs: '13px', sm: '14px', md: '16px' } }}
          />
          <TextField
            label="Дата"
            type="date"
            fullWidth
            value={formData.event_date || ''}
            onChange={(e) => onChange({ ...formData, event_date: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
            helperText={selectedDate ? `Выбрано: ${selectedDate}` : ''}
            sx={{ fontSize: { xs: '13px', sm: '14px', md: '16px' } }}
          />
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <TextField
              label="Время начала"
              type="time"
              fullWidth
              value={formData.start_time?.slice(0,5) || ''}
              onChange={(e) => onChange({ ...formData, start_time: `${e.target.value}:00` })}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ fontSize: { xs: '13px', sm: '14px', md: '16px' } }}
            />
            <TextField
              label="Время окончания"
              type="time"
              fullWidth
              value={formData.end_time?.slice(0,5) || ''}
              onChange={(e) => onChange({ ...formData, end_time: `${e.target.value}:00` })}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ fontSize: { xs: '13px', sm: '14px', md: '16px' } }}
            />
          </Box>
          <TextField
            label="Место проведения"
            fullWidth
            value={formData.location || ''}
            onChange={(e) => onChange({ ...formData, location: e.target.value })}
            placeholder="Например: Онлайн или адрес"
            sx={{ fontSize: { xs: '13px', sm: '14px', md: '16px' } }}
          />
          <TextField
            label="Описание"
            fullWidth
            multiline
            rows={3}
            value={formData.description || ''}
            onChange={(e) => onChange({ ...formData, description: e.target.value })}
            placeholder="Подробное описание события..."
            sx={{ fontSize: { xs: '13px', sm: '14px', md: '16px' } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ gap: { xs: 0.5, sm: 1 }, p: { xs: 1, sm: 2 } }}>
        <Button 
          onClick={onClose}
          sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' } }}
        >
          Отмена
        </Button>
        <Button 
          onClick={onSubmit} 
          variant="contained" 
          disabled={!isValid}
          sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' } }}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  )
}