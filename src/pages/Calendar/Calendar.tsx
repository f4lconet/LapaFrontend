// pages/Calendar/Calendar.tsx
import { useEffect, useState, useCallback } from 'react'
import { Box, Card, CardContent, CircularProgress, Alert, Fab, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useCalendarPresenter } from '../../presenters/useCalendarPresenter'
import { useAuthPresenter } from '../../presenters/useAuthPresenter'
import type { CalendarEvent } from '../../models/calendar.model'
import { useCalendarForm } from '../../hooks/useCalendarForm'
import { CalendarHeader } from '../../components/calendar/CalendarHeader'
import { AdminAlert } from '../../components/calendar/AdminAlert'
import { CalendarView } from '../../components/calendar/CalendarView'
import { EventModal } from '../../components/calendar/EventModal'
import { CreateEventDialog } from '../../components/calendar/CreateEventDialog'
import './Calendar.scss'

const Calendar = () => {
  const { 
    loadMonthEvents, 
    currentMonthEvents, 
    isLoading, 
    error, 
    currentYear, 
    currentMonth, 
    clearError,
    createEvent,
    updateEvent,
    deleteEvent
  } = useCalendarPresenter()
  
  const { user } = useAuthPresenter()
  const isAdmin = user?.role === 'admin'
  const { formData, isFormValid, resetForm, setEventToForm, getCreatePayload, getUpdatePayload, updateForm } = useCalendarForm()

  const [eventModal, setEventModal] = useState<{
    open: boolean
    event: CalendarEvent | null
    mode: 'view' | 'edit'
  }>({ open: false, event: null, mode: 'view' })
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    loadMonthEvents(currentYear, currentMonth)
  }, [currentYear, currentMonth, loadMonthEvents])

  const calendarEvents = currentMonthEvents
    ? Object.entries(currentMonthEvents).flatMap(([_, events]) =>
        events.map((event) => ({
          id: event.id,
          title: event.title,
          date: event.event_date,
          start: `${event.event_date}T${event.start_time}`,
          end: `${event.event_date}T${event.end_time}`,
          extendedProps: event,
        }))
      )
    : []

  const refreshEvents = useCallback(() => {
    loadMonthEvents(currentYear, currentMonth)
  }, [loadMonthEvents, currentYear, currentMonth])

  const handleEventClick = useCallback((info: any) => {
    const event = info.event.extendedProps as CalendarEvent
    setEventModal({ open: true, event, mode: 'view' })
  }, [])

  const handleDateClick = useCallback((info: any) => {
    if (!isAdmin) return
    const date = info.dateStr
    setSelectedDate(date)
    resetForm(date)
    setCreateDialogOpen(true)
  }, [isAdmin, resetForm])

  const handleCloseModal = useCallback(() => {
    setEventModal({ open: false, event: null, mode: 'view' })
    resetForm()
  }, [resetForm])

  const handleEditEvent = useCallback(() => {
    if (eventModal.event) {
      setEventToForm(eventModal.event)
      setEventModal({ ...eventModal, mode: 'edit' })
    }
  }, [eventModal, setEventToForm])

  const handleDeleteEvent = useCallback(async () => {
    if (eventModal.event && window.confirm('Вы уверены, что хотите удалить это событие?')) {
      await deleteEvent(eventModal.event.id)
      handleCloseModal()
      refreshEvents()
    }
  }, [eventModal.event, deleteEvent, handleCloseModal, refreshEvents])

  const handleSaveEvent = useCallback(async () => {
    if (eventModal.event && eventModal.mode === 'edit') {
      const payload = getUpdatePayload()
      await updateEvent(eventModal.event.id, payload)
      handleCloseModal()
      refreshEvents()
      resetForm()
    }
  }, [eventModal, getUpdatePayload, updateEvent, handleCloseModal, refreshEvents, resetForm])

  const handleCreateEvent = useCallback(async () => {
    const payload = getCreatePayload()
    if (payload) {
      await createEvent(payload)
      setCreateDialogOpen(false)
      refreshEvents()
      resetForm()
    }
  }, [getCreatePayload, createEvent, refreshEvents, resetForm])

  const handleCloseCreateDialog = useCallback(() => {
    setCreateDialogOpen(false)
    resetForm()
  }, [resetForm])

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      <CalendarHeader />
      
      {error && <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>{error}</Alert>}
      
      <AdminAlert show={isAdmin} />

      <Card>
        <CardContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <CalendarView
              events={calendarEvents}
              isLoading={isLoading}
              isAdmin={isAdmin}
              onEventClick={handleEventClick}
              onDateClick={handleDateClick}
            />
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <Tooltip title="Добавить событие" placement="left">
          <Fab color="primary" sx={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => {
            resetForm()
            setCreateDialogOpen(true)
          }}>
            <AddIcon />
          </Fab>
        </Tooltip>
      )}

      <EventModal
        open={eventModal.open}
        event={eventModal.event}
        mode={eventModal.mode}
        isAdmin={isAdmin}
        formData={formData}
        onClose={handleCloseModal}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onSave={handleSaveEvent}
        onFormChange={updateForm}
      />

      <CreateEventDialog
        open={createDialogOpen}
        formData={formData}
        selectedDate={selectedDate}
        isValid={isFormValid}
        onClose={handleCloseCreateDialog}
        onChange={updateForm}
        onSubmit={handleCreateEvent}
      />
    </Box>
  )
}

export default Calendar