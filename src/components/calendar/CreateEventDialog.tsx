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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon color="primary" />
          Создание события
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Название события *"
            fullWidth
            value={formData.title || ''}
            onChange={(e) => onChange({ ...formData, title: e.target.value })}
            required
            placeholder="Например: Встреча волонтёров"
          />
          <TextField
            label="Дата"
            type="date"
            fullWidth
            value={formData.event_date || ''}
            onChange={(e) => onChange({ ...formData, event_date: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
            helperText={selectedDate ? `Выбрано: ${selectedDate}` : ''}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Время начала"
              type="time"
              fullWidth
              value={formData.start_time?.slice(0,5) || ''}
              onChange={(e) => onChange({ ...formData, start_time: `${e.target.value}:00` })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Время окончания"
              type="time"
              fullWidth
              value={formData.end_time?.slice(0,5) || ''}
              onChange={(e) => onChange({ ...formData, end_time: `${e.target.value}:00` })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
          <TextField
            label="Место проведения"
            fullWidth
            value={formData.location || ''}
            onChange={(e) => onChange({ ...formData, location: e.target.value })}
            placeholder="Например: Онлайн или адрес"
          />
          <TextField
            label="Описание"
            fullWidth
            multiline
            rows={3}
            value={formData.description || ''}
            onChange={(e) => onChange({ ...formData, description: e.target.value })}
            placeholder="Подробное описание события..."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={onSubmit} variant="contained" disabled={!isValid}>
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  )
}