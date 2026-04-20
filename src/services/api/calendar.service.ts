import { apiClient } from './client'
import type {
  CalendarEvent,
  CalendarEventListResponse,
  CalendarMonthResponse,
  CreateCalendarEventRequest,
  UpdateCalendarEventRequest,
} from '../../models/calendar.model'

export const calendarService = {
  // GET /calendar/events - get events with date range and pagination
  async getEvents(
    startDate?: string,
    endDate?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<CalendarEventListResponse> {
    const response = await apiClient.get<CalendarEventListResponse>('/calendar/events', {
      params: {
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
        limit,
        offset,
      },
    })
    return response.data
  },

  // GET /calendar/events/month - get events for a specific month (grouped by day)
  async getMonthEvents(year: number, month: number): Promise<CalendarMonthResponse> {
    const response = await apiClient.get<CalendarMonthResponse>('/calendar/events/month', {
      params: { year, month },
    })
    return response.data
  },

  // GET /calendar/events/{event_id} - get event details
  async getEventById(eventId: string): Promise<CalendarEvent> {
    const response = await apiClient.get<CalendarEvent>(`/calendar/events/${eventId}`)
    return response.data
  },

  // POST /calendar/events - create new event (admin only)
  async createEvent(data: CreateCalendarEventRequest): Promise<CalendarEvent> {
    const response = await apiClient.post<CalendarEvent>('/calendar/events', data)
    return response.data
  },

  // PUT /calendar/events/{event_id} - update event (admin only)
  async updateEvent(eventId: string, data: UpdateCalendarEventRequest): Promise<CalendarEvent> {
    const response = await apiClient.put<CalendarEvent>(`/calendar/events/${eventId}`, data)
    return response.data
  },

  // DELETE /calendar/events/{event_id} - delete event (admin only)
  async deleteEvent(eventId: string): Promise<string> {
    const response = await apiClient.delete<string>(`/calendar/events/${eventId}`)
    return response.data
  },
}
