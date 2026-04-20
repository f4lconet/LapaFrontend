import { useCallback } from 'react'
import { useCalendarStore } from '../services/stores/useCalendarStore'
import type { CreateCalendarEventRequest, UpdateCalendarEventRequest } from '../models/calendar.model'

export const useCalendarPresenter = () => {
  const {
    events,
    currentMonthEvents,
    currentEvent,
    isLoading,
    error,
    total,
    currentYear,
    currentMonth,
    fetchEvents,
    fetchMonthEvents,
    fetchEventById,
    createEvent: storeCreateEvent,
    updateEvent: storeUpdateEvent,
    deleteEvent: storeDeleteEvent,
    clearError,
  } = useCalendarStore()

  // Fetch events for a date range
  const loadEvents = useCallback(
    async (startDate?: string, endDate?: string, limit?: number, offset?: number) => {
      await fetchEvents(startDate, endDate, limit, offset)
    },
    [fetchEvents]
  )

  // Fetch events for a specific month
  const loadMonthEvents = useCallback(
    async (year: number, month: number) => {
      await fetchMonthEvents(year, month)
    },
    [fetchMonthEvents]
  )

  // Load specific event
  const loadEvent = useCallback(
    async (eventId: string) => {
      await fetchEventById(eventId)
    },
    [fetchEventById]
  )

  // Create event (admin only)
  const createEvent = useCallback(
    async (data: CreateCalendarEventRequest) => {
      try {
        await storeCreateEvent(data)
        return { success: true }
      } catch (err) {
        return { success: false, error: err }
      }
    },
    [storeCreateEvent]
  )

  // Update event (admin only)
  const updateEvent = useCallback(
    async (eventId: string, data: UpdateCalendarEventRequest) => {
      try {
        await storeUpdateEvent(eventId, data)
        return { success: true }
      } catch (err) {
        return { success: false, error: err }
      }
    },
    [storeUpdateEvent]
  )

  // Delete event (admin only)
  const deleteEvent = useCallback(
    async (eventId: string) => {
      try {
        await storeDeleteEvent(eventId)
        return { success: true }
      } catch (err) {
        return { success: false, error: err }
      }
    },
    [storeDeleteEvent]
  )

  return {
    // State
    events,
    currentMonthEvents,
    currentEvent,
    isLoading,
    error,
    total,
    currentYear,
    currentMonth,

    // Actions
    loadEvents,
    loadMonthEvents,
    loadEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    clearError,
  }
}
