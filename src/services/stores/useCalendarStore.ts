import { create } from 'zustand'
import { calendarService } from '../api/calendar.service'
import type {
  CalendarEvent,
  CalendarEventListResponse,
  CalendarMonthResponse,
  CreateCalendarEventRequest,
  UpdateCalendarEventRequest,
} from '../../models/calendar.model'

interface CalendarStore {
  // State
  events: CalendarEvent[]
  currentMonthEvents: { [day: string]: CalendarEvent[] } | null
  currentEvent: CalendarEvent | null
  isLoading: boolean
  error: string | null
  total: number
  currentOffset: number
  currentYear: number
  currentMonth: number

  // Actions
  fetchEvents: (startDate?: string, endDate?: string, limit?: number, offset?: number) => Promise<void>
  fetchMonthEvents: (year: number, month: number) => Promise<void>
  fetchEventById: (eventId: string) => Promise<void>
  createEvent: (data: CreateCalendarEventRequest) => Promise<void>
  updateEvent: (eventId: string, data: UpdateCalendarEventRequest) => Promise<void>
  deleteEvent: (eventId: string) => Promise<void>
  clearError: () => void
  reset: () => void
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: [],
  currentMonthEvents: null,
  currentEvent: null,
  isLoading: false,
  error: null,
  total: 0,
  currentOffset: 0,
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,

  // Fetch events with date range
  fetchEvents: async (startDate?: string, endDate?: string, limit: number = 50, offset: number = 0) => {
    set({ isLoading: true, error: null })
    try {
      const response = await calendarService.getEvents(startDate, endDate, limit, offset)
      set({
        events: response.items,
        total: response.total,
        currentOffset: offset,
      })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch events' })
    } finally {
      set({ isLoading: false })
    }
  },

  // Fetch events for a specific month
  fetchMonthEvents: async (year: number, month: number) => {
    set({ isLoading: true, error: null })
    try {
      const response = await calendarService.getMonthEvents(year, month)
      set({
        currentMonthEvents: response.events,
        currentYear: response.year,
        currentMonth: response.month,
        total: response.total,
      })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch month events' })
    } finally {
      set({ isLoading: false })
    }
  },

  // Fetch single event by ID
  fetchEventById: async (eventId: string) => {
    set({ isLoading: true, error: null })
    try {
      const event = await calendarService.getEventById(eventId)
      set({ currentEvent: event })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch event' })
    } finally {
      set({ isLoading: false })
    }
  },

  // Create new event (admin only)
  createEvent: async (data: CreateCalendarEventRequest) => {
    set({ isLoading: true, error: null })
    try {
      await calendarService.createEvent(data)
      // Refresh current month events after creation
      const { currentYear, currentMonth } = get()
      await get().fetchMonthEvents(currentYear, currentMonth)
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create event' })
    } finally {
      set({ isLoading: false })
    }
  },

  // Update event (admin only)
  updateEvent: async (eventId: string, data: UpdateCalendarEventRequest) => {
    set({ isLoading: true, error: null })
    try {
      await calendarService.updateEvent(eventId, data)
      // Refresh current month events after update
      const { currentYear, currentMonth } = get()
      await get().fetchMonthEvents(currentYear, currentMonth)
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update event' })
    } finally {
      set({ isLoading: false })
    }
  },

  // Delete event (admin only)
  deleteEvent: async (eventId: string) => {
    set({ isLoading: true, error: null })
    try {
      await calendarService.deleteEvent(eventId)
      // Refresh current month events after deletion
      const { currentYear, currentMonth } = get()
      await get().fetchMonthEvents(currentYear, currentMonth)
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete event' })
    } finally {
      set({ isLoading: false })
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () =>
    set({
      events: [],
      currentMonthEvents: null,
      currentEvent: null,
      isLoading: false,
      error: null,
      total: 0,
      currentOffset: 0,
    }),
}))
