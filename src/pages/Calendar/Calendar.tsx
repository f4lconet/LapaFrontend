import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { Box, Card, CardContent, Typography, CircularProgress, Alert, Button, Modal, TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useCalendarPresenter } from '../../presenters/useCalendarPresenter'
import type { CalendarEvent } from '../../models/calendar.model'
import './Calendar.scss'
import { BurgerMenu } from '../../components/navigation/BurgerMenu'

interface EventModalState {
  open: boolean
  event: CalendarEvent | null
}

const Calendar = () => {
  const { loadMonthEvents, currentMonthEvents, isLoading, error, currentYear, currentMonth, clearError } =
    useCalendarPresenter()

  const [eventModal, setEventModal] = useState<EventModalState>({
    open: false,
    event: null,
  })

  // Load events on component mount and when month changes
  useEffect(() => {
    loadMonthEvents(currentYear, currentMonth)
  }, [currentYear, currentMonth, loadMonthEvents])

  // Convert stored events to FullCalendar format
  const calendarEvents = currentMonthEvents
    ? Object.entries(currentMonthEvents).flatMap(([day, events]) =>
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

  const handleEventClick = (info: any) => {
    const event = info.event.extendedProps as CalendarEvent
    setEventModal({ open: true, event })
  }

  const handleCloseModal = () => {
    setEventModal({ open: false, event: null })
  }

  const handlePrevMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 2)
    loadMonthEvents(newDate.getFullYear(), newDate.getMonth() + 1)
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth)
    loadMonthEvents(newDate.getFullYear(), newDate.getMonth() + 1)
  }

  return (
    <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <BurgerMenu />
        </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Календарь мероприятий
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box className="calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
                }}
                buttonText={{
                    today: 'Сегодня',
                    month: 'Месяц',
                    week: 'Неделя',
                    day: 'День',
                    list: 'Список'
                }}
                events={calendarEvents}
                eventClick={handleEventClick}
                height="auto"
                locale="ruLocale"
                contentHeight="auto"
                displayEventTime={true}
                displayEventEnd={true}
                titleFormat={{ year: 'numeric', month: 'long' }}  // "Апрель 2025"
                weekText="Неделя"
                allDayText="Весь день"
                moreLinkText={(num) => `+ ещё ${num}`}
                noEventsText="Нет событий"
                dayHeaderFormat={{ weekday: 'long' }}  // "Понедельник"
                views={{
                    dayGridMonth: {
                    titleFormat: { year: 'numeric', month: 'long' },
                    dayHeaderFormat: { weekday: 'short' }  // "Пн", "Вт" и т.д.
                    },
                    timeGridWeek: {
                    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
                    dayHeaderFormat: { weekday: 'long', day: 'numeric' }  // "Понедельник 20"
                    }
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      <Modal open={eventModal.open} onClose={handleCloseModal}>
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
            maxWidth: 500,
            width: '90%',
          }}
        >
          {eventModal.event && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Event Details
                </Typography>
                <Button
                  onClick={handleCloseModal}
                  sx={{
                    minWidth: 'auto',
                    p: 1,
                  }}
                >
                  <CloseIcon />
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Title
                  </Typography>
                  <Typography variant="body1">{eventModal.event.title}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Date
                  </Typography>
                  <Typography variant="body1">{eventModal.event.event_date}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Time
                  </Typography>
                  <Typography variant="body1">
                    {eventModal.event.start_time} - {eventModal.event.end_time}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Location
                  </Typography>
                  <Typography variant="body1">{eventModal.event.location}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Description
                  </Typography>
                  <Typography variant="body1">{eventModal.event.description}</Typography>
                </Box>

                {eventModal.event.task_id && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      Related Task ID
                    </Typography>
                    <Typography variant="body1">{eventModal.event.task_id}</Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                  <Button onClick={handleCloseModal} variant="contained">
                    Close
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  )
}

export default Calendar