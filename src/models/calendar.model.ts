export interface CalendarEvent {
  id: string
  title: string
  description: string
  event_date: string // YYYY-MM-DD format
  start_time: string // HH:mm:ss format
  end_time: string // HH:mm:ss format
  location: string
  task_id?: string
  created_at: string
  updated_at: string
  created_by: string
}

export interface CalendarEventListResponse {
  items: CalendarEvent[]
  total: number
  next_offset: number
}

export interface CalendarMonthResponse {
  year: number
  month: number
  events: {
    [day: string]: CalendarEvent[]
  }
  total: number
}

export interface CreateCalendarEventRequest {
  title: string
  description: string
  event_date: string
  start_time: string
  end_time: string
  location: string
}

export interface UpdateCalendarEventRequest {
  title?: string
  description?: string
  event_date?: string
  start_time?: string
  end_time?: string
  location?: string
}
