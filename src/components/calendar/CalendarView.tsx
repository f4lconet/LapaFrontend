import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

interface CalendarViewProps {
  events: any[]
  isLoading: boolean
  isAdmin: boolean
  onEventClick: (info: any) => void
  onDateClick: (info: any) => void
}

export const CalendarView = ({ 
  events, 
  isLoading, 
  isAdmin, 
  onEventClick, 
  onDateClick 
}: CalendarViewProps) => {
  if (isLoading) return null

  return (
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
      events={events}
      eventClick={onEventClick}
      dateClick={onDateClick}
      height="auto"
      locale="ru"
      contentHeight="auto"
      displayEventTime={true}
      displayEventEnd={true}
      titleFormat={{ year: 'numeric', month: 'long' }}
      weekText="Неделя"
      allDayText="Весь день"
      moreLinkText={(num) => `+ ещё ${num}`}
      noEventsText="Нет событий"
      dayHeaderFormat={{ weekday: 'long' }}
      views={{
        dayGridMonth: {
          titleFormat: { year: 'numeric', month: 'long' },
          dayHeaderFormat: { weekday: 'short' }
        },
        timeGridWeek: {
          titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
          dayHeaderFormat: { weekday: 'long', day: 'numeric' }
        }
      }}
      editable={isAdmin}
      selectable={isAdmin}
      selectMirror={true}
      dayMaxEvents={true}
      weekends={true}
      nowIndicator={true}
      eventDurationEditable={isAdmin}
      eventStartEditable={isAdmin}
      eventResizableFromStart={isAdmin}
      slotDuration="00:30:00"
      slotLabelInterval="01:00"
      scrollTime="08:00:00"
      businessHours={{
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '09:00',
        endTime: '18:00',
      }}
    />
  )
}